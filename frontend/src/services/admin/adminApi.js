// ─── src/services/admin/adminApi.js ──────────────────────────
// All authenticated admin API calls.
// Bearer token is injected automatically by fetchFromApi via sessionStorage.

import { fetchFromApi, setAccessToken } from '../../lib/api';

// ─── Auth ────────────────────────────────────────────────────

export async function adminLogin({ email, password }) {
  const data = await fetchFromApi('admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function adminMe() {
  return fetchFromApi('admin/auth/me');
}

export async function adminLogout() {
  try {
    await fetchFromApi('admin/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}

// ─── Uploads (student submissions) ───────────────────────────

// GET /api/admin/uploads?status=PENDING|APPROVED|REJECTED
export async function getAdminUploads(status = 'PENDING') {
  return fetchFromApi(`admin/uploads?status=${status}`);
}

// PATCH /api/admin/uploads/:id  body: { action: 'APPROVED'|'REJECTED', title?, subjectCode?, resourceType? }
export async function reviewUpload(id, action, updatedData = {}) {
  return fetchFromApi(`admin/uploads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action, ...updatedData }),
  });
}

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING|APPROVED|REJECTED
export async function getAdminRequests(status = 'PENDING') {
  return fetchFromApi(`admin/requests?status=${status}`);
}

// PATCH /api/admin/requests/:id  body: { action: 'APPROVED'|'REJECTED' }
export async function reviewRequest(id, action) {
  return fetchFromApi(`admin/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

// ─── Resources ───────────────────────────────────────────────

// GET /api/admin/resources?subjectCode=&search=
export async function getAdminResources({ subjectCode = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (subjectCode) params.set('subjectCode', subjectCode);
  if (search) params.set('search', search);
  const qs = params.toString();
  return fetchFromApi(`admin/resources${qs ? `?${qs}` : ''}`);
}

// POST /api/admin/resources  (JSON — URL-based resource)
export async function createResource({ subjectId, title, resourceType, fileUrl, description, source }) {
  return fetchFromApi('admin/resources', {
    method: 'POST',
    body: JSON.stringify({ subjectId, title, resourceType, fileUrl, description, source }),
  });
}

// POST /api/admin/resources  (multipart — file upload)
export async function createResourceWithFile(formData) {
  // Do NOT set Content-Type — browser sets multipart boundary automatically
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const token = sessionStorage.getItem('admin_access_token');
  const res = await fetch(`${API_BASE_URL}/admin/resources`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// PUT /api/admin/resources/:id
export async function updateResource(id, data) {
  return fetchFromApi(`admin/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE /api/admin/resources/:id  (soft-delete)
export async function deleteResource(id) {
  return fetchFromApi(`admin/resources/${id}`, { method: 'DELETE' });
}

// POST /api/admin/resources/bulk-delete  (hard-delete selected IDs + Drive files)
export async function bulkDeleteResources(ids) {
  return fetchFromApi('admin/resources/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
export async function getAdminOpportunities() {
  return fetchFromApi('admin/opportunities');
}

// POST /api/admin/opportunities
export async function createOpportunity({ title, description, category, tag, pinBg }) {
  return fetchFromApi('admin/opportunities', {
    method: 'POST',
    body: JSON.stringify({ title, description, category, tag, pinBg }),
  });
}

// PATCH /api/admin/opportunities/:id/toggle
export async function toggleOpportunity(id) {
  return fetchFromApi(`admin/opportunities/${id}/toggle`, { method: 'PATCH' });
}

// DELETE /api/admin/opportunities/:id
export async function deleteOpportunity(id) {
  return fetchFromApi(`admin/opportunities/${id}`, { method: 'DELETE' });
}

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
export async function getAdminAnnouncements() {
  return fetchFromApi('admin/announcements');
}

// POST /api/admin/announcements
export async function createAnnouncement({ text, badge, color, deadline }) {
  return fetchFromApi('admin/announcements', {
    method: 'POST',
    body: JSON.stringify({ text, badge, color, deadline }),
  });
}

// PATCH /api/admin/announcements/:id/toggle
export async function toggleAnnouncement(id) {
  return fetchFromApi(`admin/announcements/${id}/toggle`, { method: 'PATCH' });
}

// DELETE /api/admin/announcements/:id
export async function deleteAnnouncement(id) {
  return fetchFromApi(`admin/announcements/${id}`, { method: 'DELETE' });
}

// ─── Catalog (for subject picker in resource form) ────────────
export async function getAdminCatalog() {
  return fetchFromApi('categories/semesters');
}
