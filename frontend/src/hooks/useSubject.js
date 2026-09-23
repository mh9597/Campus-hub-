import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getSubjectByCode } from '../services/resources/resourcesApi';

/**
 * Hook: fetch subject metadata (title, code, semester, department) by subject code.
 * Leverages cached semesters catalog for zero-delay instant lookup.
 *
 * @param {string} subjectCode
 * @returns {{ subject: Object|null, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useSubject(subjectCode) {
  const queryClient = useQueryClient();
  const normalizedCode = (subjectCode || '').trim();

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.subject(normalizedCode),
    queryFn: () => getSubjectByCode(normalizedCode),
    enabled: !!normalizedCode,
    initialData: () => {
      if (!normalizedCode) return undefined;
      const target = normalizedCode.toLowerCase();
      const cachedSemesters = queryClient.getQueryData(queryKeys.semesters);
      if (Array.isArray(cachedSemesters)) {
        for (const sem of cachedSemesters) {
          if (!sem.subjects) continue;
          const found = sem.subjects.find((s) =>
            s.code.toLowerCase() === target ||
            s.path === `/subject/${target}`
          );
          if (found) {
            return { ...found, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } };
          }
        }
      }
      return undefined;
    },
  });

  return {
    subject: data ?? null,
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load subject') : null,
    refetch,
  };
}
