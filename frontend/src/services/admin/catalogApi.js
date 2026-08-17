// src/services/admin/catalogApi.js
// All catalog CRUD calls — goes through the backend proxy (never direct DB).
import { fetchFromApi } from '../../lib/api';

// ─── Departments ──────────────────────────────────────────────

/** Fetch full department hierarchy (with semesters + subjects nested). */
export function getAdminDepartments() {
  return fetchFromApi('admin/catalog/departments');
}

/** Create a new department/branch. */
export function createDepartment(data) {
  return fetchFromApi('admin/catalog/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Edit an existing department. */
export function updateDepartment(id, data) {
  return fetchFromApi(`admin/catalog/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Delete a department (only succeeds if it has no semesters). */
export function deleteDepartment(id) {
  return fetchFromApi(`admin/catalog/departments/${id}`, { method: 'DELETE' });
}

// ─── Semesters ────────────────────────────────────────────────

/** Create a semester under a given department. */
export function createSemester(data) {
  return fetchFromApi('admin/catalog/semesters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Edit semester metadata. */
export function updateSemester(id, data) {
  return fetchFromApi(`admin/catalog/semesters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Delete a semester (only succeeds if it has no subjects). */
export function deleteSemester(id) {
  return fetchFromApi(`admin/catalog/semesters/${id}`, { method: 'DELETE' });
}

/**
 * Cascade-delete a semester along with ALL its subjects + resources.
 * Also triggers backend Drive cleanup for every resource file.
 */
export function deleteSemesterCascade(id) {
  return fetchFromApi(`admin/catalog/semesters/${id}/cascade`, { method: 'DELETE' });
}

// ─── Subjects ─────────────────────────────────────────────────

/** Create a subject under a given semester. */
export function createSubject(data) {
  return fetchFromApi('admin/catalog/subjects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Edit subject metadata. */
export function updateSubject(id, data) {
  return fetchFromApi(`admin/catalog/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Delete a subject (only succeeds if it has no active resources). */
export function deleteSubject(id) {
  return fetchFromApi(`admin/catalog/subjects/${id}`, { method: 'DELETE' });
}
