// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY OAUTH 2.0 PKCE CALLBACK HANDLER
// ──────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { handleAuthCallback } from '../../services/spotify/spotifyAuth';

export default function SpotifyCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const authError = searchParams.get('error');

    if (authError) {
      setError(`Spotify authorization was declined: ${authError}`);
      setIsProcessing(false);
      return;
    }

    if (!code || !state) {
      setError('Missing authorization code or state from Spotify.');
      setIsProcessing(false);
      return;
    }

    handleAuthCallback(code, state)
      .then(() => {
        // Successful PKCE Token Exchange -> Navigate to Community Page
        navigate('/community', { replace: true });
      })
      .catch((err) => {
        console.error('Spotify token exchange error:', err);
        setError(err.message || 'Failed to complete Spotify authorization.');
        setIsProcessing(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="max-w-md w-full bg-[#FEF3D6] rounded-[32px] p-8 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] text-center space-y-6">
        {/* Spotify Logo Badge */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0F172A] flex items-center justify-center text-[#1DB954] shadow-[3px_3px_0px_#0F172A]">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.216.353-.674.468-1.026.252-2.825-1.727-6.38-2.118-10.57-1.162-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.045 8.51-.599 11.68 1.348.352.216.468.674.252 1.026zm1.467-3.262c-.272.443-.85.586-1.293.314-3.235-1.988-8.167-2.564-11.993-1.402-.497.151-1.028-.135-1.179-.632-.151-.498.135-1.028.632-1.179 4.375-1.328 9.808-.687 13.52 1.606.443.272.585.85.313 1.293zm.126-3.41c-3.879-2.304-10.286-2.517-14.004-1.388-.595.181-1.229-.157-1.41-.752-.181-.595.157-1.229.752-1.41 4.271-1.296 11.341-1.05 15.795 1.595.536.318.712 1.012.394 1.548-.318.536-1.012.712-1.548.394z" />
          </svg>
        </div>

        {isProcessing ? (
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-slate-900">Connecting Spotify...</h1>
            <p className="text-xs font-bold text-slate-600">
              Verifying your PKCE authorization code and connecting to CampusHub Study Lounge.
            </p>
            <div className="flex justify-center pt-2">
              <div className="w-8 h-8 border-4 border-[#0F172A] border-t-[#1DB954] rounded-full animate-spin" />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h1 className="text-xl font-black text-rose-600">Authentication Issue</h1>
            <p className="text-xs font-bold text-slate-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {error}
            </p>
            <Link
              to="/community"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-black text-xs hover:bg-slate-800 transition-all border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A]"
            >
              Return to Community
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
