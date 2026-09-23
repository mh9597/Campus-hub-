import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getOpportunities, getAnnouncements } from '../services/opportunities/opportunitiesApi';

/**
 * Hook: fetch all active opportunities from the backend.
 * Uses TanStack Query with stale-while-revalidate and persistence.
 *
 * @returns {{ opportunities: Array, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useOpportunities() {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.opportunities,
    queryFn: getOpportunities,
  });

  return {
    opportunities: data ?? [],
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load opportunities') : null,
    refetch,
  };
}

/**
 * Hook: fetch latest announcements from the backend.
 *
 * @returns {{ announcements: Array, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useAnnouncements() {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.announcements,
    queryFn: getAnnouncements,
  });

  return {
    announcements: data ?? [],
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'Failed to load announcements') : null,
    refetch,
  };
}
