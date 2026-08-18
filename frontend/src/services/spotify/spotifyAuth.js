// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY OAUTH 2.0 PKCE AUTHENTICATION SERVICE
// ──────────────────────────────────────────────────────────────────────────────
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, getSpotifyRedirectUri } from './spotifyConfig';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  EXPIRES_AT: 'spotify_expires_at',
  CODE_VERIFIER: 'spotify_code_verifier',
  AUTH_STATE: 'spotify_auth_state',
};

// ─── PKCE Cryptographic Helpers ──────────────────────────────────────────────

function generateRandomString(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// ─── Initiate PKCE Spotify Login Flow ────────────────────────────────────────

export async function initiateSpotifyLogin() {
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error('Missing VITE_SPOTIFY_CLIENT_ID in environment variables.');
  }

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const state = generateRandomString(16);
  const redirectUri = getSpotifyRedirectUri();

  // Store in sessionStorage for verification upon callback
  sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
  sessionStorage.setItem(STORAGE_KEYS.AUTH_STATE, state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state: state,
    show_dialog: 'true',
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// ─── Handle OAuth Callback & Code Exchange ───────────────────────────────────

export async function handleAuthCallback(code, state) {
  const storedState = sessionStorage.getItem(STORAGE_KEYS.AUTH_STATE);
  const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
  const redirectUri = getSpotifyRedirectUri();

  if (!state || state !== storedState) {
    throw new Error('Invalid OAuth state parameter. Possible CSRF attack.');
  }

  if (!codeVerifier) {
    throw new Error('Missing PKCE code verifier in session storage.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || errorData.error || 'Failed to exchange authorization code for token');
  }

  const tokenData = await response.json();
  saveTokenData(tokenData);

  // Clean up PKCE parameters
  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);

  return tokenData.access_token;
}

// ─── Token Storage & Refresh ──────────────────────────────────────────────────

function saveTokenData(data) {
  const { access_token, refresh_token, expires_in } = data;
  const expiresAt = Date.now() + expires_in * 1000 - 60000; // 1-minute buffer

  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  sessionStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

  if (refresh_token) {
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
  }
}

export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) {
    logoutSpotify();
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      logoutSpotify();
      return null;
    }

    const tokenData = await response.json();
    saveTokenData(tokenData);
    return tokenData.access_token;
  } catch (err) {
    console.error('Spotify token refresh failed:', err);
    logoutSpotify();
    return null;
  }
}

export async function getValidAccessToken() {
  const accessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAt = Number(sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT) || 0);

  if (!accessToken) {
    return null;
  }

  // If token is still valid, return it
  if (Date.now() < expiresAt) {
    return accessToken;
  }

  // Token expired, attempt refresh
  return await refreshAccessToken();
}

export function isSpotifyAuthenticated() {
  const accessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAt = Number(sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT) || 0);
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  return !!(accessToken && (Date.now() < expiresAt || refreshToken));
}

export function logoutSpotify() {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
}
