import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * Enhanced async data-fetching hook backed by TanStack Query.
 * Provides backward compatibility while benefiting from cache persistence,
 * keepPreviousData, and stale-while-revalidate behavior.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array that triggers re-fetch when changed
 * @param {Object} options - Optional caching parameters ({ cacheKey, ttl })
 * @returns {{ data: any, loading: boolean, isFetching: boolean, error: string|null, refetch: Function }}
 */
export function useFetch(fetchFn, deps = [], options = {}) {
  const { cacheKey = null, ttl = 60000 } = options;

  const queryKey = cacheKey ? ['legacy_fetch', cacheKey] : ['legacy_fetch', ...deps];

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: ttl,
    enabled: typeof fetchFn === 'function',
  });

  return {
    data: data ?? null,
    loading: isPending && !data,
    isFetching,
    error: error ? (error.message || 'An unexpected error occurred. Please try again.') : null,
    refetch,
  };
}
