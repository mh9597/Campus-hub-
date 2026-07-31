import { useFetch } from './useFetch';
import { getSemesters } from '../services/resources/resourcesApi';

/**
 * Hook: fetch all semesters (with subjects) from the backend.
 * Falls back to static data automatically if DB is unreachable.
 *
 * @returns {{ semesters: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSemesters() {
  const { data, loading, error, refetch } = useFetch(getSemesters, []);
  return { semesters: data ?? [], loading, error, refetch };
}
