import { useState, useEffect, useCallback } from 'react';

/**
 * Generic async data-fetching hook.
 * Provides consistent { data, loading, error, refetch } pattern across all pages.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array that triggers re-fetch when changed
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function }}
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
