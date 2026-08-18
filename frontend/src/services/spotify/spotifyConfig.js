// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY CONFIGURATION & SCOPES
// ──────────────────────────────────────────────────────────────────────────────

export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'bd983944252c4c14bca888c0a6269e55';

export function getSpotifyRedirectUri() {
  if (typeof window !== 'undefined') {
    const port = window.location.port || '5173';
    // Spotify strictly forbids the word 'localhost' - always use 127.0.0.1 with the current port
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://127.0.0.1:${port}/community`;
    }
    return `${window.location.origin}/community`;
  }
  return import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/community';
}

export const SPOTIFY_REDIRECT_URI = getSpotifyRedirectUri();

// Spotify Scopes required for Web Playback SDK, Player Control, and Playlist reading
export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
];

// CampusHub Study & Chill Curated Playlist Mapping
export const SPOTIFY_STUDY_CATEGORIES = [
  {
    id: 'lofi',
    label: 'Lo-Fi Study',
    name: 'Lofi Beats · Chill Study Session',
    playlistId: '0vvXsWCC9xrXsKd4FyS8kM',
    description: 'Slow, relaxing instrumental lofi hip hop beats to concentrate or destress.',
  },
  {
    id: 'focus',
    label: 'Deep Focus',
    name: 'Deep Focus · Coding Flow',
    playlistId: '37i9dQZF1DWZeKCadgRdKQ',
    description: 'Atmospheric ambient soundscapes for prolonged exam revision and problem solving.',
  },
  {
    id: 'bollywood',
    label: 'Bollywood Chill',
    name: 'Bollywood Acoustic Vibes',
    playlistId: '37i9dQZF1DX0XUfTFmNBRM',
    description: 'Unwind with smooth acoustic, indie, and chill Hindi tracks between study sessions.',
  },
  {
    id: 'piano',
    label: 'Peaceful Piano',
    name: 'Calm Piano & Rain Flow',
    playlistId: '37i9dQZF1DX4t95PaoR1zy',
    description: 'Gentle piano melodies to calm your mind when feeling overwhelmed or bored.',
  },
];
