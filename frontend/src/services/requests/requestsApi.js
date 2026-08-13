// ─── requests/requestsApi.js ──────────────────────────────────
// Wires resource requests and uploads to Express endpoints.

import { fetchFromApi } from '../../lib/api';

// ─── Resource Request ────────────────────────────────────────
// POST /api/submissions/request
export async function submitResourceRequest({ subjectCode, resourceType, message, requesterEmail }) {
  if (!message?.trim()) {
    return { success: false, error: 'Please describe what resource you need.' }; 
  }
  
  const email = requesterEmail;
  if (!email?.trim() || !email.endsWith('@gmail.com')) {
    return { success: false, error: 'A valid @gmail.com email is required.' };
  }

  try {
    await fetchFromApi('submissions/request', {
      method: 'POST',
      body: JSON.stringify({ subjectCode, resourceType, message, email }),
    });
    return { success: true };
  } catch (err) {
    console.error('[requestsApi] submitResourceRequest failed:', err.message);
    return { success: false, error: err.message || 'Failed to submit request. Please try again.' };
  }
}

// ─── Resource Upload (URL-based) ─────────────────────────────
// POST /api/submissions/upload
export async function submitResourceUpload({ subjectCode, resourceType, title, description }) {
  if (!title?.trim()) {
    return { success: false, error: 'Title is required.' };
  }

  try {
    await fetchFromApi('submissions/upload', {
      method: 'POST',
      body: JSON.stringify({ subjectCode, resourceType, title, description }),
    });
    return { success: true };
  } catch (err) {
    console.error('[requestsApi] submitResourceUpload failed:', err.message);
    return { success: false, error: err.message || 'Failed to upload resource. Please try again.' };
  }
}

// ─── Opportunity Submission ───────────────────────────────────
// Opportunities are submitted through the admin portal, not the public API.
// Kept as a no-op stub for any legacy call sites.
export async function submitOpportunity() {
  return { success: false, error: 'Opportunity submissions require admin access.' };
}
