import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getSemesters } from '../services/resources/resourcesApi';

/**
 * Hook: fetch all semesters (with subjects) from the backend.
 * Uses TanStack Query cache with staleTime and persistence for instant page loads
 * across route switches without showing skeleton loaders.
 *
 * @returns {{ semesters: Array, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useSemesters() {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.semesters,
    queryFn: getSemesters,
  });

  return {
    semesters: data ?? [],
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load semesters') : null,
    refetch,
  };
}
