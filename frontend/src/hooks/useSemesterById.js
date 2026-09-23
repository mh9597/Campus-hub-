import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getSemesterById } from '../services/resources/resourcesApi';

/**
 * Hook: fetch a single semester by numeric ID (with subjects).
 * Uses caching and initialData derivation from cached semesters list for instant detail views.
 *
 * @param {number|string} semesterId
 * @returns {{ semester: Object|null, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useSemesterById(semesterId) {
  const queryClient = useQueryClient();
  const numericId = semesterId ? parseInt(semesterId, 10) : null;

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.semester(numericId),
    queryFn: () => getSemesterById(numericId),
    enabled: !!numericId,
    initialData: () => {
      if (!numericId) return undefined;
      const cachedSemesters = queryClient.getQueryData(queryKeys.semesters);
      if (Array.isArray(cachedSemesters)) {
        const found = cachedSemesters.find((s) => s.id === numericId);
        if (found && Array.isArray(found.subjects)) {
          return found;
        }
      }
      return undefined;
    },
  });

  return {
    semester: data ?? null,
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load semester') : null,
    refetch,
  };
}
