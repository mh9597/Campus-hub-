import { API_BASE_URL } from '../lib/api';

const API_BASE = API_BASE_URL;

/**
 * Returns the URL that renders the file inline in the browser
 * (PDF viewer, image preview, etc.)
 *
 * @param {string} id  Resource UUID
 * @returns {string}
 */
export const getResourceViewUrl = (id) => `${API_BASE}/resources/${id}/view`;

/**
 * Returns the URL that forces the browser to download the file
 * with the resource's human-readable title as the filename.
 *
 * @param {string} id  Resource UUID
 * @returns {string}
 */
export const getResourceDownloadUrl = (id) => `${API_BASE}/resources/${id}/download`;
