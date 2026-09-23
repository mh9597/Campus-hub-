import { queryClient } from './queryClient';
import { queryKeys } from './queryKeys';
import {
  getSemesters,
  getSemesterById,
  getSubjectByCode,
  getResourcesBySubject,
} from '../services/resources/resourcesApi';
import {
  getOpportunities,
  getAnnouncements,
} from '../services/opportunities/opportunitiesApi';

const DEFAULT_PREFETCH_STALE_TIME = 1000 * 60 * 10; // 10 minutes

/**
 * Prefetch all semesters catalog (e.g. when hovering over "Resources" or "Explore Semesters").
 */
export function prefetchSemesters() {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.semesters,
    queryFn: getSemesters,
    staleTime: DEFAULT_PREFETCH_STALE_TIME,
  });
}

/**
 * Prefetch a specific semester with subjects (e.g. when hovering over a Semester card like Semester 5).
 *
 * @param {number|string} semesterId
 */
export function prefetchSemester(semesterId) {
  if (!semesterId) return Promise.resolve();
  const id = Number(semesterId);
  return queryClient.prefetchQuery({
    queryKey: queryKeys.semester(id),
    queryFn: () => getSemesterById(id),
    staleTime: DEFAULT_PREFETCH_STALE_TIME,
  });
}

/**
 * Prefetch resources for a subject code (e.g. "CE0516").
 *
 * @param {string} subjectCode
 */
export function prefetchSubjectResources(subjectCode) {
  if (!subjectCode) return Promise.resolve();
  const code = String(subjectCode).trim();
  return queryClient.prefetchQuery({
    queryKey: queryKeys.subjectResources(code),
    queryFn: () => getResourcesBySubject(code),
    staleTime: DEFAULT_PREFETCH_STALE_TIME,
  });
}

/**
 * Prefetch both subject metadata and its active resources (e.g. when hovering over a folder card).
 *
 * @param {string} subjectCode
 */
export function prefetchSubject(subjectCode) {
  if (!subjectCode) return Promise.resolve();
  const code = String(subjectCode).trim();
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.subject(code),
      queryFn: () => getSubjectByCode(code),
      staleTime: DEFAULT_PREFETCH_STALE_TIME,
    }),
    prefetchSubjectResources(code),
  ]);
}

/**
 * Prefetch opportunities postings.
 */
export function prefetchOpportunities() {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.opportunities,
    queryFn: getOpportunities,
    staleTime: DEFAULT_PREFETCH_STALE_TIME,
  });
}

/**
 * Prefetch announcements.
 */
export function prefetchAnnouncements() {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.announcements,
    queryFn: getAnnouncements,
    staleTime: DEFAULT_PREFETCH_STALE_TIME,
  });
}
