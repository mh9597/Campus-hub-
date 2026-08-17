import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { getSemesterById } from '../services/resources/resourcesApi';

/**
 * Hook: fetch a single semester by numeric ID (with subjects).
 * Uses caching for instant detail views.
 *
 * @param {number} semesterId
 * @returns {{ semester: Object|null, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSemesterById(semesterId) {
  const fetchFn = useMemo(() => () => getSemesterById(semesterId), [semesterId]);
  const { data, loading, error, refetch } = useFetch(fetchFn, [semesterId], {
    cacheKey: semesterId ? `ch_sem_${semesterId}` : null,
    ttl: 60000,
  });
  return { semester: data, loading, error, refetch };
}
