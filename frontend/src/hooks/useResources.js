import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getResourcesBySubject } from '../services/resources/resourcesApi';

/**
 * Hook: fetch active resources for a specific subject code (e.g. "CE0516").
 * Uses TanStack Query cache with stale-while-revalidate and persistence for instant navigation.
 *
 * @param {string} subjectCode
 * @returns {{ resources: Array, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useSubjectResources(subjectCode) {
  const normalizedCode = (subjectCode || '').trim();

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.subjectResources(normalizedCode),
    queryFn: () => getResourcesBySubject(normalizedCode),
    enabled: !!normalizedCode,
  });

  return {
    resources: data ?? [],
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load resources') : null,
    refetch,
  };
}
