import { QueryClient, keepPreviousData } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/**
 * Global QueryClient configured for high performance, aggressive client caching,
 * and minimal server load.
 *
 * - staleTime: 10 minutes. Within this window, route transitions and re-renders
 *   render directly from memory without triggering background network requests.
 * - gcTime: 24 hours. Cached data is kept alive for persistence across sessions.
 * - placeholderData: keepPreviousData. Preserves prior data while transitions take place.
 * - refetchOnWindowFocus: false. Avoids hammering the backend server when tabs lose/gain focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false, // Reduces server load
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

/**
 * Synchronous localStorage persister for offline-first instant page loads.
 * Restores previous route data immediately on startup to prevent skeleton flash.
 */
export const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'CAMPUSHUB_QUERY_CACHE',
  throttleTime: 1000,
});
