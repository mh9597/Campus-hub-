import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { getResourcesBySubject } from '../services/resources/resourcesApi';

/**
 * Hook: fetch active resources for a specific subject code (e.g. "CE0516").
 * Falls back to static resources automatically if DB is unreachable.
 *
 * @param {string} subjectCode
 * @returns {{ resources: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSubjectResources(subjectCode) {
  const fetchFn = useMemo(() => () => getResourcesBySubject(subjectCode), [subjectCode]);
  const { data, loading, error, refetch } = useFetch(fetchFn, [subjectCode]);
  return { resources: data ?? [], loading, error, refetch };
}
