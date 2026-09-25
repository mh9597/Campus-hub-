// frontend/src/services/viva/vivaApi.js
/**
 * Viva API Service — Communicates with the Backend Proxy.
 * Strictly adheres to Frontend Isolation and Backend Proxy constraints.
 */

import { fetchFromApi } from '../../lib/api';
import { getUniversalSubjectViva } from '../../data/vivaData';

/**
 * Fetch viva syllabus, questions, and experiments for a subject.
 * Proxies request through backend /api/viva/:subjectCode, with seamless
 * fallback to client-side educational knowledge base when backend is offline.
 *
 * @param {string} subjectCode 
 * @param {Object} [subjectMetadata] Optional cached metadata from subject catalog
 * @returns {Promise<Object>}
 */
export async function getSubjectVivaData(subjectCode, subjectMetadata = {}) {
  if (!subjectCode) return null;
  const normalizedCode = subjectCode.toUpperCase().trim();
  const safeMeta = subjectMetadata || {};

  try {
    const data = await fetchFromApi(`viva/${normalizedCode}`);
    if (data && data.questions && data.questions.length > 0) {
      return data;
    }
    // If backend returns partial structure, enrich with client dataset
    const localData = getUniversalSubjectViva(normalizedCode, safeMeta);
    return { ...localData, ...(data || {}) };
  } catch (err) {
    // When backend is offline or proxy is transitioning, use universal local knowledge base
    return getUniversalSubjectViva(normalizedCode, safeMeta);
  }
}
