import { fetchFromApi } from '../../lib/api';
import { semestersData } from '../../data/semestersData';
import { queryClient } from '../../lib/queryClient';
import { queryKeys } from '../../lib/queryKeys';

const TIMEOUT_MS = 8000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}

// In-flight promise coalescing to eliminate duplicate simultaneous requests
let inFlightCategoriesPromise = null;

async function fetchCategoriesSemestersRaw() {
  if (inFlightCategoriesPromise) return inFlightCategoriesPromise;
  inFlightCategoriesPromise = withTimeout(fetchFromApi('categories/semesters'))
    .finally(() => {
      inFlightCategoriesPromise = null;
    });
  return inFlightCategoriesPromise;
}

export async function getSemesters() {
  try {
    const data = await fetchCategoriesSemestersRaw();
    const dept = data.find(d => d.code === 'CE') || data[0];
    if (dept && dept.semesters) {
      return dept.semesters.map(sem => {
        const count = sem.subjects?.reduce((acc, subj) => acc + (subj._count?.resources || 0), 0) || 0;
        return { ...sem, resourcesCount: `${count}+ Resources` };
      });
    }
    return [];
  } catch (err) {
    console.warn('[resourcesApi] getSemesters failed, falling back to static data:', err.message);
    return semestersData;
  }
}

export async function getSemesterById(semesterId) {
  const numericId = parseInt(semesterId, 10);

  // 1. Instant cache lookup from already loaded semesters to bypass server request
  const cachedSemesters = queryClient.getQueryData(queryKeys.semesters);
  if (Array.isArray(cachedSemesters)) {
    const found = cachedSemesters.find((s) => s.id === numericId);
    if (found && Array.isArray(found.subjects)) {
      const count = found.subjects.reduce((acc, subj) => acc + (subj._count?.resources || 0), 0);
      const mappedSubjects = found.subjects.map(subj => ({
        ...subj,
        resourcesCount: `${subj._count?.resources || 0}+ Resources`
      }));
      return { ...found, subjects: mappedSubjects, resourcesCount: `${count}+ Resources` };
    }
  }

  // 2. Fetch if not found in cache
  try {
    const data = await fetchCategoriesSemestersRaw();
    for (const dept of data) {
      const sem = dept.semesters?.find((s) => s.id === numericId);
      if (sem) {
        const count = sem.subjects?.reduce((acc, subj) => acc + (subj._count?.resources || 0), 0) || 0;
        const mappedSubjects = sem.subjects?.map(subj => ({
          ...subj,
          resourcesCount: `${subj._count?.resources || 0}+ Resources`
        })) || [];
        return { ...sem, subjects: mappedSubjects, resourcesCount: `${count}+ Resources` };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[resourcesApi] getSemesterById(${semesterId}) failed, using static fallback:`, err.message);
    return semestersData.find((s) => s.id === numericId) ?? null;
  }
}

export async function getResourcesBySubject(subjectCode) {
  if (!subjectCode) return [];
  try {
    const data = await withTimeout(fetchFromApi(`resources?subjectCode=${subjectCode}`));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[resourcesApi] getResourcesBySubject(${subjectCode}) failed (backend may be offline):`, err.message);
    return [];
  }
}

export async function getResourceById(id) {
  if (!id) return null;
  try {
    const data = await withTimeout(fetchFromApi(`resources/${id}`));
    return data;
  } catch (err) {
    console.error(`[resourcesApi] getResourceById(${id}) failed:`, err.message);
    return null;
  }
}

export async function getSubjectByCode(subjectCode) {
  if (!subjectCode) return null;
  const targetCode = subjectCode.toLowerCase().trim();

  // 1. Instant cache lookup from cached semesters
  const cachedSemesters = queryClient.getQueryData(queryKeys.semesters);
  if (Array.isArray(cachedSemesters)) {
    for (const sem of cachedSemesters) {
      if (!sem.subjects) continue;
      const found = sem.subjects.find((s) =>
        s.code.toLowerCase() === targetCode ||
        s.path === `/subject/${targetCode}`
      );
      if (found) {
        return { ...found, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } };
      }
    }
  }

  // 2. Fetch from backend if not yet in cache
  try {
    const data = await fetchCategoriesSemestersRaw();
    for (const dept of data) {
      if (!dept.semesters) continue;
      for (const sem of dept.semesters) {
        if (!sem.subjects) continue;
        const subject = sem.subjects.find((s) =>
          s.code.toLowerCase() === targetCode ||
          s.path === `/subject/${targetCode}`
        );
        if (subject) {
          return { ...subject, semester: sem, department: dept };
        }
      }
    }
    return null;
  } catch (err) {
    console.warn(`[resourcesApi] getSubjectByCode(${subjectCode}) failed:`, err.message);
    return null;
  }
}

export async function searchAllSubjects(query) {
  if (!query || query.trim() === '') return [];
  const lowerQuery = query.toLowerCase().trim();

  const filterSubjects = (subjectsList) => {
    return subjectsList.filter(s => {
      const codeMatch = s.code.toLowerCase().includes(lowerQuery);
      const titleMatch = s.title.toLowerCase().includes(lowerQuery);
      const shortFormMatch = s.shortForm ? s.shortForm.toLowerCase().includes(lowerQuery) : false;

      // Attempt alias matching (e.g. Design and Analysis of Algorithms -> DAA)
      const words = s.title.split(' ');
      const acronym = words.map(w => w[0]).join('').toLowerCase();
      const filteredWords = words.filter(w => !['and', 'of', '&'].includes(w.toLowerCase()));
      const strictAcronym = filteredWords.map(w => w[0]).join('').toLowerCase();

      const aliasMatch = acronym.includes(lowerQuery) || strictAcronym.includes(lowerQuery);

      return codeMatch || titleMatch || shortFormMatch || aliasMatch;
    });
  };

  // 1. Check if semesters are already cached in React Query to avoid network hit
  const cachedSemesters = queryClient.getQueryData(queryKeys.semesters);
  if (Array.isArray(cachedSemesters) && cachedSemesters.length > 0) {
    const allSubjects = [];
    for (const sem of cachedSemesters) {
      if (!sem.subjects) continue;
      for (const subject of sem.subjects) {
        allSubjects.push({ ...subject, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } });
      }
    }
    return filterSubjects(allSubjects);
  }

  // 2. Otherwise fetch with coalesced promise
  try {
    const data = await fetchCategoriesSemestersRaw();
    const allSubjects = [];

    for (const dept of data) {
      if (!dept.semesters) continue;
      for (const sem of dept.semesters) {
        if (!sem.subjects) continue;
        for (const subject of sem.subjects) {
          allSubjects.push({ ...subject, semester: sem, department: dept });
        }
      }
    }

    return filterSubjects(allSubjects);
  } catch (err) {
    console.warn(`[resourcesApi] searchAllSubjects failed, using fallback:`, err.message);
    const allSubjects = [];
    for (const sem of semestersData) {
      if (!sem.subjects) continue;
      for (const subject of sem.subjects) {
        allSubjects.push({ ...subject, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } });
      }
    }

    return filterSubjects(allSubjects);
  }
}
