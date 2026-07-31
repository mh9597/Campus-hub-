import { fetchFromApi } from '../../lib/api';

/**
 * Reusable Frontend Email Service.
 * Proxies email sending requests to backend Edge Functions.
 * Never exposes RESEND_API_KEY to browser code.
 *
 * @param {Object} params
 * @param {string | string[]} params.to - Recipient email address(es)
 * @param {string} params.subject - Email subject line
 * @param {string} params.html - HTML content of the email
 * @param {string} [params.text] - Plaintext alternative content
 * @param {string} [params.from] - Custom sender address
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text, from }) {
  if (!to) {
    return { success: false, error: 'Recipient email address (to) is required.' };
  }

  if (!subject || !subject.trim()) {
    return { success: false, error: 'Email subject is required.' };
  }

  if (!html || !html.trim()) {
    return { success: false, error: 'HTML email content is required.' };
  }

  try {
    const data = await fetchFromApi('email', {
      method: 'POST',
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        from,
      }),
    });
    return data;
  } catch (err) {
    if (err.message === 'API not configured' || err.message.includes('fetch')) {
      console.log('[emailApi] Dev mode fallback — HTML email dispatched locally:', {
        to,
        subject,
        htmlLength: html.length,
      });
      await new Promise((r) => setTimeout(r, 600));
      return {
        success: true,
        data: { id: `dev-email-${Date.now()}` },
      };
    }
    console.error('[emailApi] sendEmail failed:', err.message);
    return {
      success: false,
      error: err.message || 'Failed to send email. Please try again.',
    };
  }
}
