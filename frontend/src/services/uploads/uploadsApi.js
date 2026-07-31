// src/services/uploads/uploadsApi.js
// Student-facing file upload submission service.
// Sends multipart/form-data to the backend proxy — never touches the DB directly.
import { API_BASE_URL } from '../../lib/api';

/**
 * Submit a resource file for admin review.
 *
 * @param {FormData} formData  Must contain:
 *   - title        (string, required)
 *   - subjectCode  (string, required)
 *   - resourceType (string, required)
 *   - description  (string, optional)
 *   - file         (File object, optional but recommended)
 * @returns {Promise<object>} The created ResourceUpload record (status: PENDING)
 */
export async function submitResourceUpload(formData) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/submissions/upload`;

  // NOTE: Do NOT set Content-Type manually.
  // When sending FormData, the browser automatically sets:
  //   Content-Type: multipart/form-data; boundary=<generated-boundary>
  // Setting it manually removes the boundary and breaks the upload.
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Upload failed with status ${response.status}`
    );
  }

  const json = await response.json();

  // Unwrap standard envelope { success: true, data: ... }
  if (json && json.success !== undefined && json.data !== undefined) {
    return json.data;
  }
  return json;
}
