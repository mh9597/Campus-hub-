// ─── subscribers/subscribersApi.js ───────────────────────────
// POST /api/subscribers

import { fetchFromApi } from '../../lib/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribe an email address to the newsletter.
 * @param {{ email: string }} params
 */
export async function subscribeNewsletter({ email }) {
  if (!email?.trim()) {
    return { success: false, error: 'Email address cannot be empty.' };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    await fetchFromApi('subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail }),
    });
    return { success: true, message: 'Subscribed successfully!' };
  } catch (err) {
    console.error('[subscribersApi] subscribeNewsletter failed:', err.message);
    return { success: false, error: err.message || 'Failed to subscribe. Please try again.' };
  }
}
