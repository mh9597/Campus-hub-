import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { getSemesterById } from '../services/resources/resourcesApi';

/**
 * Hook: fetch a single semester by numeric ID (with subjects).
 * Falls back to static data automatically if DB is unreachable.
 *
 * @param {number} semesterId
 * @returns {{ semester: Object|null, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSemesterById(semesterId) {
  const fetchFn = useMemo(() => () => getSemesterById(semesterId), [semesterId]);
  const { data, loading, error, refetch } = useFetch(fetchFn, [semesterId]);
  return { semester: data, loading, error, refetch };
}
