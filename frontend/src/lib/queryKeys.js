/**
 * Centralized React Query Keys
 * Ensures consistent cache key access across hooks, prefetch handlers, and mutations.
 */
export const queryKeys = {
  semesters: ['semesters'],
  semester: (id) => ['semesters', Number(id)],
  subject: (code) => ['subject', String(code || '').toLowerCase()],
  subjectResources: (code) => ['resources', 'subject', String(code || '').toLowerCase()],
  resource: (id) => ['resources', 'detail', String(id)],
  opportunities: ['opportunities'],
  announcements: ['announcements'],
};
