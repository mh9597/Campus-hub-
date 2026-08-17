import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { getResourcesBySubject } from '../services/resources/resourcesApi';

/**
 * Hook: fetch active resources for a specific subject code (e.g. "CE0516").
 * Uses caching for instant subject navigation.
 *
 * @param {string} subjectCode
 * @returns {{ resources: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSubjectResources(subjectCode) {
  const fetchFn = useMemo(() => () => getResourcesBySubject(subjectCode), [subjectCode]);
  const { data, loading, error, refetch } = useFetch(fetchFn, [subjectCode], {
    cacheKey: subjectCode ? `ch_subject_${subjectCode}` : null,
    ttl: 60000,
  });
  return { resources: data ?? [], loading, error, refetch };
}
