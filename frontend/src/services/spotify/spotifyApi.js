// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY WEB API SERVICE & RESPONSE NORMALIZATION
// ──────────────────────────────────────────────────────────────────────────────
import { getValidAccessToken } from './spotifyAuth';

const BASE_URL = 'https://api.spotify.com/v1';

// ─── Format Time Helper ───────────────────────────────────────────────────────
export function formatMsToTime(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ─── Data Normalization ───────────────────────────────────────────────────────

export function normalizeTrack(trackItem, fallbackIndex = 1) {
  if (!trackItem) return null;
  const track = trackItem.track || trackItem; // Handle wrapped playlist track objects

  if (!track || !track.id) return null;

  return {
    id: track.id,
    number: fallbackIndex,
    title: track.name || 'Unknown Track',
    artist: (track.artists || []).map((a) => a.name).join(', ') || 'Unknown Artist',
    albumName: track.album?.name || '',
    artwork: track.album?.images?.[0]?.url || '',
    durationMs: track.duration_ms || 0,
    durationFormatted: formatMsToTime(track.duration_ms || 0),
    uri: track.uri || `spotify:track:${track.id}`,
    externalUrl: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`,
    previewUrl: track.preview_url || null,
  };
}

export function normalizePlaylist(rawPlaylist) {
  if (!rawPlaylist) return null;

  const rawTracks = rawPlaylist.tracks?.items || [];
  const tracks = rawTracks
    .map((item, idx) => normalizeTrack(item, idx + 1))
    .filter(Boolean);

  return {
    id: rawPlaylist.id,
    name: rawPlaylist.name || 'Spotify Playlist',
    description: rawPlaylist.description || '',
    artwork: rawPlaylist.images?.[0]?.url || '',
    totalTracks: rawPlaylist.tracks?.total || tracks.length,
    tracks: tracks,
    uri: rawPlaylist.uri || `spotify:playlist:${rawPlaylist.id}`,
    externalUrl: rawPlaylist.external_urls?.spotify || `https://open.spotify.com/playlist/${rawPlaylist.id}`,
    owner: rawPlaylist.owner?.display_name || 'Spotify',
  };
}

// ─── Authenticated Spotify Fetch Wrapper ──────────────────────────────────────

async function spotifyFetch(endpoint, options = {}) {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Spotify.');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return null; // Empty body on successful playback commands
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || response.statusText || 'Spotify API request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

// ─── Spotify API Methods ──────────────────────────────────────────────────────

export async function getCurrentUser() {
  return await spotifyFetch('/me');
}

export async function getUserPlaylists(limit = 20) {
  const data = await spotifyFetch(`/me/playlists?limit=${limit}`);
  return (data.items || []).map((pl) => normalizePlaylist(pl));
}

export async function getPlaylist(playlistId) {
  const data = await spotifyFetch(`/playlists/${playlistId}`);
  return normalizePlaylist(data);
}

export async function getPlaylistTracks(playlistId, limit = 50) {
  const data = await spotifyFetch(`/playlists/${playlistId}/tracks?limit=${limit}`);
  return (data.items || []).map((item, idx) => normalizeTrack(item, idx + 1)).filter(Boolean);
}

export async function getPlaybackState() {
  return await spotifyFetch('/me/player');
}

export async function getCurrentlyPlaying() {
  return await spotifyFetch('/me/player/currently-playing');
}

export async function transferPlayback(deviceId, play = false) {
  return await spotifyFetch('/me/player', {
    method: 'PUT',
    body: JSON.stringify({
      device_ids: [deviceId],
      play: play,
    }),
  });
}

export async function startPlayback({ deviceId, uris, contextUri, offset }) {
  const query = deviceId ? `?device_id=${deviceId}` : '';
  const body = {};

  if (contextUri) {
    body.context_uri = contextUri;
    if (typeof offset === 'number') {
      body.offset = { position: offset };
    } else if (typeof offset === 'string') {
      body.offset = { uri: offset };
    }
  } else if (uris && uris.length > 0) {
    body.uris = uris;
    if (typeof offset === 'number') {
      body.offset = { position: offset };
    }
  }

  return await spotifyFetch(`/me/player/play${query}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function pausePlayback(deviceId) {
  const query = deviceId ? `?device_id=${deviceId}` : '';
  return await spotifyFetch(`/me/player/pause${query}`, {
    method: 'PUT',
  });
}

export async function resumePlayback(deviceId) {
  const query = deviceId ? `?device_id=${deviceId}` : '';
  return await spotifyFetch(`/me/player/play${query}`, {
    method: 'PUT',
  });
}

export async function skipToNext(deviceId) {
  const query = deviceId ? `?device_id=${deviceId}` : '';
  return await spotifyFetch(`/me/player/next${query}`, {
    method: 'POST',
  });
}

export async function skipToPrevious(deviceId) {
  const query = deviceId ? `?device_id=${deviceId}` : '';
  return await spotifyFetch(`/me/player/previous${query}`, {
    method: 'POST',
  });
}

export async function seekPlayback(positionMs, deviceId) {
  const queryParams = new URLSearchParams({ position_ms: positionMs });
  if (deviceId) queryParams.set('device_id', deviceId);

  return await spotifyFetch(`/me/player/seek?${queryParams.toString()}`, {
    method: 'PUT',
  });
}

export async function setPlaybackVolume(volumePercent, deviceId) {
  const queryParams = new URLSearchParams({ volume_percent: Math.min(100, Math.max(0, volumePercent)) });
  if (deviceId) queryParams.set('device_id', deviceId);

  return await spotifyFetch(`/me/player/volume?${queryParams.toString()}`, {
    method: 'PUT',
  });
}
