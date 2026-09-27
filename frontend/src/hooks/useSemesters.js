import { useCallback } from 'react';
import { useFetch } from './useFetch';
import { getSemesters } from '../services/resources/resourcesApi';

/**
 * Hook: fetch semesters (with subjects) from the backend for a given department.
 * Uses cached data for instant page loads across route switches.
 *
 * @param {string} [departmentCode='CE'] - 'CE', 'CSE', 'IT'
 * @returns {{ semesters: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSemesters(departmentCode = 'CE') {
  const normalized = (departmentCode || 'CE').toUpperCase();
  const fetcher = useCallback(() => getSemesters(normalized), [normalized]);
  const { data, loading, error, refetch } = useFetch(fetcher, [normalized], {
    cacheKey: `ch_semesters_list_${normalized}`,
    ttl: 60000,
  });
  return { semesters: data ?? [], loading, error, refetch };
}
