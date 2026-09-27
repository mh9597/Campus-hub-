import { useFetch } from './useFetch';
import { getOpportunities, getAnnouncements } from '../services/opportunities/opportunitiesApi';

/**
 * Hook: fetch all active opportunities from the backend.
 *
 * @returns {{ opportunities: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useOpportunities() {
  const { data, loading, error, refetch } = useFetch(getOpportunities, [], {
    cacheKey: 'ch_opportunities_active',
    ttl: 30000,
  });
  return { opportunities: data ?? [], loading, error, refetch };
}

/**
 * Hook: fetch latest announcements from the backend.
 *
 * @returns {{ announcements: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useAnnouncements() {
  const { data, loading, error, refetch } = useFetch(getAnnouncements, [], {
    cacheKey: 'ch_announcements_active',
    ttl: 30000,
  });
  return { announcements: data ?? [], loading, error, refetch };
}
