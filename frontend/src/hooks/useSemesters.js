import { useFetch } from './useFetch';
import { getSemesters } from '../services/resources/resourcesApi';

/**
 * Hook: fetch all semesters (with subjects) from the backend.
 * Uses cached data for instant page loads across route switches.
 *
 * @returns {{ semesters: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSemesters() {
  const { data, loading, error, refetch } = useFetch(getSemesters, [], {
    cacheKey: 'ch_semesters_list',
    ttl: 60000,
  });
  return { semesters: data ?? [], loading, error, refetch };
}
