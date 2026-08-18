// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY CENTRAL CONTEXT & WEB PLAYBACK SDK MANAGER
// ──────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  initiateSpotifyLogin,
  logoutSpotify,
  isSpotifyAuthenticated,
  getValidAccessToken,
  handleAuthCallback,
} from '../services/spotify/spotifyAuth';
import {
  getCurrentUser,
  getPlaylist,
  startPlayback,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
  seekPlayback,
  setPlaybackVolume,
  transferPlayback,
  normalizeTrack,
} from '../services/spotify/spotifyApi';
import { SPOTIFY_STUDY_CATEGORIES } from '../services/spotify/spotifyConfig';

const SpotifyContext = createContext(null);

export function SpotifyProvider({ children }) {
  // Authentication & User State
  const [isConnected, setIsConnected] = useState(() => isSpotifyAuthenticated());
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Category & Playlist State
  const [activeCategoryId, setActiveCategoryId] = useState('lofi');
  const activeCategory =
    SPOTIFY_STUDY_CATEGORIES.find((c) => c.id === activeCategoryId) || SPOTIFY_STUDY_CATEGORIES[0];
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  // Web Playback SDK Player State
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  // Status & Error Messages
  const [playbackError, setPlaybackError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // ─── 0. Handle OAuth Redirect Callback (Supports /community & /callback) ────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const authError = urlParams.get('error');

    if (authError) {
      setPlaybackError(`Spotify login was cancelled or declined: ${authError}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && state) {
      setIsAuthenticating(true);
      handleAuthCallback(code, state)
        .then(() => {
          setIsConnected(true);
          setIsAuthenticating(false);
          setPlaybackError(null);
          // Clean query params from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error('Failed to complete Spotify authorization:', err);
          setIsAuthenticating(false);
          setPlaybackError(err.message || 'Spotify authorization code exchange failed.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  // ─── 1. Load User Profile on Connect ─────────────────────────────────────────
  useEffect(() => {
    if (!isConnected) {
      setUser(null);
      return;
    }

    let isMounted = true;
    getCurrentUser()
      .then((userData) => {
        if (isMounted) setUser(userData);
      })
      .catch((err) => {
        console.warn('Could not fetch Spotify user profile:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  // ─── 2. Fetch Playlist Tracks when Category Changes ──────────────────────────
  const loadCategoryPlaylist = useCallback(async (category) => {
    setIsLoadingTracks(true);
    setPlaybackError(null);

    try {
      const playlistData = await getPlaylist(category.playlistId);
      setActivePlaylist(playlistData);
      setPlaylistTracks(playlistData.tracks || []);

      // If no current track is set, set first track as current track preview
      if (playlistData.tracks && playlistData.tracks.length > 0) {
        setCurrentTrack((prev) => prev || playlistData.tracks[0]);
        setDuration((prev) => (prev ? prev : playlistData.tracks[0].durationMs));
      }
    } catch (err) {
      console.error('Error fetching Spotify playlist:', err);
      setPlaybackError(`Failed to load ${category.label} playlist from Spotify.`);
    } finally {
      setIsLoadingTracks(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadCategoryPlaylist(activeCategory);
    }
  }, [isConnected, activeCategory, loadCategoryPlaylist]);

  // ─── 3. Initialize Official Spotify Web Playback SDK ─────────────────────────
  useEffect(() => {
    if (!isConnected) {
      if (playerRef.current) {
        try {
          playerRef.current.disconnect();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
      setIsPlayerReady(false);
      setDeviceId(null);
      return;
    }

    let isMounted = true;

    // Load Spotify SDK script if not already present in document
    if (!window.Spotify) {
      const existingScript = document.getElementById('spotify-player-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'spotify-player-script';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    const initPlayer = () => {
      if (!window.Spotify || !isMounted) return;

      const player = new window.Spotify.Player({
        name: 'CampusHub Study Lounge',
        getOAuthToken: async (cb) => {
          const token = await getValidAccessToken();
          if (token) cb(token);
        },
        volume: volume / 100,
      });

      player.addListener('ready', ({ device_id }) => {
        if (!isMounted) return;
        setDeviceId(device_id);
        setIsPlayerReady(true);
        setStatusMessage('CampusHub Player Ready');
        // Transfer playback device seamlessly
        transferPlayback(device_id, false).catch(() => {});
      });

      player.addListener('not_ready', ({ device_id }) => {
        if (!isMounted) return;
        setIsPlayerReady(false);
        console.warn('Device ID has gone offline:', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!isMounted || !state) return;

        setIsPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);

        if (state.track_window?.current_track) {
          const raw = state.track_window.current_track;
          const normalized = {
            id: raw.id,
            title: raw.name,
            artist: (raw.artists || []).map((a) => a.name).join(', '),
            albumName: raw.album?.name || '',
            artwork: raw.album?.images?.[0]?.url || '',
            durationMs: raw.duration_ms || state.duration,
            uri: raw.uri,
            externalUrl: `https://open.spotify.com/track/${raw.id}`,
          };
          setCurrentTrack(normalized);
        }
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('Spotify Player Initialization Error:', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Spotify Player Authentication Error:', message);
        setPlaybackError('Spotify session expired. Please reconnect.');
      });

      player.addListener('account_error', ({ message }) => {
        console.warn('Spotify Account Notice:', message);
        setPlaybackError(
          'Spotify Web Playback SDK streaming requires a Spotify Premium account. Free accounts can browse and launch in Spotify app.'
        );
      });

      player.connect();
      playerRef.current = player;
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, [isConnected]);

  // ─── 4. Real-time Progress Position Ticker ───────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition((prev) => {
          if (duration > 0 && prev >= duration) {
            return prev;
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // ─── 5. Playback Actions ──────────────────────────────────────────────────────

  const connectSpotify = () => {
    setIsAuthenticating(true);
    initiateSpotifyLogin().catch((err) => {
      setIsAuthenticating(false);
      setPlaybackError(err.message || 'Could not start Spotify authentication.');
    });
  };

  const disconnectSpotify = () => {
    logoutSpotify();
    if (playerRef.current) {
      try {
        playerRef.current.disconnect();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }
    setIsConnected(false);
    setUser(null);
    setIsPlayerReady(false);
    setDeviceId(null);
    setIsPlaying(false);
    setCurrentTrack(null);
    setPosition(0);
    setPlaybackError(null);
  };

  const selectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    const cat = SPOTIFY_STUDY_CATEGORIES.find((c) => c.id === categoryId);
    if (cat && isConnected) {
      loadCategoryPlaylist(cat);
    }
  };

  const playTrack = async (track, playlistContextUri, trackIndex = 0) => {
    setPlaybackError(null);
    setCurrentTrack(track);
    setPosition(0);
    setDuration(track.durationMs || 0);

    try {
      await startPlayback({
        deviceId: deviceId,
        contextUri: playlistContextUri || activePlaylist?.uri,
        offset: track.uri || trackIndex,
      });
      setIsPlaying(true);
    } catch (err) {
      console.warn('Playback request fallback:', err);
      // If Web API player fails (e.g. non-premium or inactive SDK), open external or notify
      if (err.status === 403) {
        setPlaybackError(
          'Spotify in-browser Web Playback requires a Spotify Premium account. Opening track directly on Spotify.'
        );
        window.open(track.externalUrl, '_blank');
      } else {
        setPlaybackError(err.message || 'Playback failed. Check Spotify connection.');
      }
    }
  };

  const togglePlayPause = async () => {
    setPlaybackError(null);
    if (isPlaying) {
      try {
        if (playerRef.current) {
          await playerRef.current.pause();
        } else {
          await pausePlayback(deviceId);
        }
        setIsPlaying(false);
      } catch (err) {
        console.error('Error pausing playback:', err);
      }
    } else {
      try {
        if (playerRef.current) {
          await playerRef.current.resume();
        } else if (currentTrack) {
          await playTrack(currentTrack, activePlaylist?.uri);
        } else {
          await resumePlayback(deviceId);
        }
        setIsPlaying(true);
      } catch (err) {
        console.warn('Error resuming playback:', err);
        if (currentTrack) {
          window.open(currentTrack.externalUrl, '_blank');
        }
      }
    }
  };

  const nextTrack = async () => {
    try {
      if (playerRef.current) {
        await playerRef.current.nextTrack();
      } else {
        await skipToNext(deviceId);
      }
    } catch (err) {
      console.warn('Skip next failed:', err);
      // Fallback: cycle local playlist tracks
      if (playlistTracks.length > 0 && currentTrack) {
        const currentIdx = playlistTracks.findIndex((t) => t.id === currentTrack.id);
        const nextIdx = (currentIdx + 1) % playlistTracks.length;
        playTrack(playlistTracks[nextIdx], activePlaylist?.uri, nextIdx);
      }
    }
  };

  const previousTrack = async () => {
    try {
      if (playerRef.current) {
        await playerRef.current.previousTrack();
      } else {
        await skipToPrevious(deviceId);
      }
    } catch (err) {
      console.warn('Skip previous failed:', err);
      // Fallback: cycle local playlist tracks
      if (playlistTracks.length > 0 && currentTrack) {
        const currentIdx = playlistTracks.findIndex((t) => t.id === currentTrack.id);
        const prevIdx = (currentIdx - 1 + playlistTracks.length) % playlistTracks.length;
        playTrack(playlistTracks[prevIdx], activePlaylist?.uri, prevIdx);
      }
    }
  };

  const seekTo = async (positionMs) => {
    setPosition(positionMs);
    try {
      if (playerRef.current) {
        await playerRef.current.seek(positionMs);
      } else {
        await seekPlayback(positionMs, deviceId);
      }
    } catch (err) {
      console.warn('Seek failed:', err);
    }
  };

  const changeVolume = async (newVolPercent) => {
    const val = Math.min(100, Math.max(0, newVolPercent));
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);

    try {
      if (playerRef.current) {
        await playerRef.current.setVolume(val / 100);
      } else {
        await setPlaybackVolume(val, deviceId);
      }
    } catch (err) {
      console.warn('Volume change failed:', err);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      changeVolume(previousVolume || 80);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      changeVolume(0);
    }
  };

  return (
    <SpotifyContext.Provider
      value={{
        isConnected,
        isAuthenticating,
        user,
        activeCategoryId,
        activeCategory,
        activePlaylist,
        playlistTracks,
        isLoadingTracks,
        deviceId,
        isPlayerReady,
        currentTrack,
        isPlaying,
        position,
        duration,
        volume: isMuted ? 0 : volume,
        isMuted,
        playbackError,
        statusMessage,
        connectSpotify,
        disconnectSpotify,
        selectCategory,
        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        seekTo,
        changeVolume,
        toggleMute,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}
