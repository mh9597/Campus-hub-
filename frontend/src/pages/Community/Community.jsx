import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, useToast } from '../../components/ui/Toast';
// ─── Local Spotify Study Lounge Categories & Helper ─────────────────────────────
const SPOTIFY_STUDY_CATEGORIES = [
  {
    id: 'lofi',
    label: 'Lo-Fi Study',
    name: 'Lofi Beats · Beats to Relax/Study To',
    playlistId: '0vvXsWCC9xrXsKd4FyS8kM',
    description: 'Relaxing lofi hip hop beats for deep focus & calm study sessions.',
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80',
    tracks: [
      { id: '1', number: 1, title: 'Misty Meadows', artist: 'eleven, Mondo Loops', durationFormatted: '3:28', durationMs: 208000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '2', number: 2, title: 'Thinking Spot', artist: 'xander.', durationFormatted: '2:45', durationMs: 165000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '3', number: 3, title: 'Snowfall', artist: 'Oneheart, reidenshi', durationFormatted: '2:03', durationMs: 123000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '4', number: 4, title: 'Coffee & Cigarettes', artist: 'Lofi Girl', durationFormatted: '2:50', durationMs: 170000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '5', number: 5, title: 'Night Trouble', artist: 'Petit Biscuit', durationFormatted: '3:10', durationMs: 190000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '6', number: 6, title: 'Affection', artist: 'Jinsang', durationFormatted: '2:40', durationMs: 160000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '7', number: 7, title: 'Controlla', artist: 'Idealism', durationFormatted: '2:25', durationMs: 145000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '8', number: 8, title: "I'm Closing My Eyes", artist: 'Potsu', durationFormatted: '2:15', durationMs: 135000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '9', number: 9, title: '5:32 PM', artist: 'The Deli', durationFormatted: '2:38', durationMs: 158000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '10', number: 10, title: 'Soft Rain Study', artist: 'Lofi Study Lounge', durationFormatted: '3:05', durationMs: 185000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '11', number: 11, title: 'Midnight Call', artist: 'Kavvson', durationFormatted: '3:12', durationMs: 192000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '12', number: 12, title: 'Sleepwell', artist: 'Purrple Cat', durationFormatted: '4:05', durationMs: 245000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '13', number: 13, title: 'Late Night Study', artist: 'SwuM', durationFormatted: '2:58', durationMs: 178000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '14', number: 14, title: 'Warm Tea Session', artist: 'Kupla', durationFormatted: '3:02', durationMs: 182000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
      { id: '15', number: 15, title: 'Quiet Library Corner', artist: 'Kudasa', durationFormatted: '3:15', durationMs: 195000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM' },
    ],
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Flow',
    name: 'High Octane Synthwave · 140 BPM Coding',
    playlistId: '37i9dQZF1DXdLENZaqioXM',
    description: 'High-energy futuristic synthwave for fast coding & late-night debugging.',
    artwork: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
    tracks: [
      { id: '10', number: 1, title: 'Resonance', artist: 'HOME', durationFormatted: '3:32', durationMs: 212000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b1a37c38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '11', number: 2, title: 'Tech Noir', artist: 'GUNSHIP', durationFormatted: '4:57', durationMs: 297000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24e3c3f875.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '12', number: 3, title: 'Turbulence', artist: 'Daniel Deluxe', durationFormatted: '3:45', durationMs: 225000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b1a37c38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '13', number: 4, title: 'Overdrive', artist: 'Lazerhawk', durationFormatted: '4:15', durationMs: 255000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24e3c3f875.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '14', number: 5, title: 'Sunset Synth', artist: 'The Midnight', durationFormatted: '5:26', durationMs: 326000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b1a37c38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '15', number: 6, title: 'Cyber City 2077', artist: 'Synthwave Boy', durationFormatted: '3:50', durationMs: 230000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24e3c3f875.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '16', number: 7, title: 'Nightcall Drive', artist: 'Kavinsky', durationFormatted: '4:18', durationMs: 258000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b1a37c38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
      { id: '17', number: 8, title: 'Neon Blade Flow', artist: 'Moondeity', durationFormatted: '2:40', durationMs: 160000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24e3c3f875.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLENZaqioXM' },
    ],
  },
  {
    id: 'bollywood',
    label: 'Bollywood Hype',
    name: 'Bollywood Acoustic & Hype Remixes',
    playlistId: '37i9dQZF1DX0XUfTFmNBRM',
    description: 'Arijit, Pritam & energetic Hindi study remixes for high morale.',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    tracks: [
      { id: '20', number: 1, title: 'Kesariya (Unplugged Hype)', artist: 'Arijit Singh', durationFormatted: '3:42', durationMs: 222000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '21', number: 2, title: 'Apna Bana Le (Chill Bass)', artist: 'Arijit Singh, Sachin-Jigar', durationFormatted: '3:20', durationMs: 200000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_651a5c6ee1.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '22', number: 3, title: 'Choo Lo (Indie Acoustic)', artist: 'The Local Train', durationFormatted: '3:50', durationMs: 230000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '23', number: 4, title: 'Kabira (Session Remix)', artist: 'Tochi Raina, Rekha Bhardwaj', durationFormatted: '4:11', durationMs: 251000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_651a5c6ee1.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '24', number: 5, title: 'Tum Se Hi (Lo-Fi Mix)', artist: 'Mohit Chauhan', durationFormatted: '4:02', durationMs: 242000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '25', number: 6, title: 'Jo Tum Mere Ho (Chill Session)', artist: 'Anuv Jain', durationFormatted: '3:10', durationMs: 190000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_651a5c6ee1.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '26', number: 7, title: 'Husn (Acoustic Unplugged)', artist: 'Anuv Jain', durationFormatted: '3:35', durationMs: 215000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
      { id: '27', number: 8, title: 'Kun Faya Kun (Sufi Ambient)', artist: 'A.R. Rahman', durationFormatted: '7:50', durationMs: 470000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_651a5c6ee1.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM' },
    ],
  },
  {
    id: 'phonk',
    label: 'Drift Phonk',
    name: 'Hard Phonk & Bass · Exam Grind Mode',
    playlistId: '37i9dQZF1DWZq93646i9Z6',
    description: 'Heavy 808 basslines & aggressive drift phonk for 3 AM exam revision.',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    tracks: [
      { id: '30', number: 1, title: 'MURDER IN MY MIND', artist: 'KORDHELL', durationFormatted: '2:25', durationMs: 145000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/01/17/audio_4fb4cf9a38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '31', number: 2, title: 'RAVE', artist: 'Dxrk 🚪', durationFormatted: '2:49', durationMs: 169000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2c4187f547.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '32', number: 3, title: 'Metamorphosis', artist: 'INTERWORLD', durationFormatted: '2:22', durationMs: 142000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/01/17/audio_4fb4cf9a38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '33', number: 4, title: 'PHONK TOWN', artist: 'Playaphonk', durationFormatted: '2:10', durationMs: 130000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2c4187f547.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '34', number: 5, title: 'Shadow Drift', artist: 'ONIX', durationFormatted: '2:15', durationMs: 135000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/01/17/audio_4fb4cf9a38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '35', number: 6, title: 'Sahara Bass', artist: 'Hensonn', durationFormatted: '2:51', durationMs: 171000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2c4187f547.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '36', number: 7, title: 'Live Another Day', artist: 'KORDHELL', durationFormatted: '2:14', durationMs: 134000, audioUrl: 'https://cdn.pixabay.com/download/audio/2023/01/17/audio_4fb4cf9a38.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
      { id: '37', number: 8, title: 'Automotive Phonk', artist: 'MC Orsen', durationFormatted: '2:30', durationMs: 150000, audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2c4187f547.mp3', externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZq93646i9Z6' },
    ],
  },
];

function formatMsToTime(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ─── SVG Platform Icons ───────────────────────────────────────────────────────
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const TelegramIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.197 1.005.128.832.941z" />
  </svg>
);

const SpotifyIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.216.353-.674.468-1.026.252-2.825-1.727-6.38-2.118-10.57-1.162-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.045 8.51-.599 11.68 1.348.352.216.468.674.252 1.026zm1.467-3.262c-.272.443-.85.586-1.293.314-3.235-1.988-8.167-2.564-11.993-1.402-.497.151-1.028-.135-1.179-.632-.151-.498.135-1.028.632-1.179 4.375-1.328 9.808-.687 13.52 1.606.443.272.585.85.313 1.293zm.126-3.41c-3.879-2.304-10.286-2.517-14.004-1.388-.595.181-1.229-.157-1.41-.752-.181-.595.157-1.229.752-1.41 4.271-1.296 11.341-1.05 15.795 1.595.536.318.712 1.012.394 1.548-.318.536-1.012.712-1.548.394z" />
  </svg>
);



// ─── Push Pin SVG Component ───────────────────────────────────────────────────
const PushPin = ({ color = '#EF4444', className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="5" fill={color} stroke="#0F172A" strokeWidth="2" />
    <path d="M12 12V22" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="10" cy="5.5" r="1.5" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (!numericTarget) return;
    const step = numericTarget / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const suffix = target.includes('+') ? '+' : target.includes('%') ? '%' : target.includes('Min') ? ' Min' : '';
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Static Data Constants ───────────────────────────────────────────────────
const METRICS = [
  { label: 'Campus Members', value: '5,000+', icon: 'school', pinColor: '#EF4444', stamp: 'VERIFIED', rotation: '-1deg' },
  { label: 'Study Resources', value: '1,500+', icon: 'folder_shared', pinColor: '#F59E0B', stamp: '100% FREE', rotation: '1.5deg' },
  { label: 'Doubt Solve Speed', value: '5 Min', icon: 'bolt', pinColor: '#10B981', stamp: 'FAST HELP', rotation: '-1.5deg' },
  { label: 'Active Channels', value: '14+', icon: 'diversity_3', pinColor: '#6366F1', stamp: 'ACTIVE 24/7', rotation: '1deg' },
];

const PINNED_STICKIES = [
  {
    author: 'Keval (3rd Year CSE)',
    time: '12:41 PM',
    text: 'Need verified TOC Unit-3 Pumping Lemma numerical proofs for Mid-Sem!',
    tag: '#DoubtDesk',
    solution: 'Manan Gohil uploaded solved 2024 notes + cheat sheet (42 upvotes)',
    color: 'bg-[#FEF9C3] border-[#FACC15]', // Yellow sticky
    pinColor: '#EF4444',
  },
  {
    author: 'CampusHub Bot',
    time: '12:30 PM',
    text: '🚨 University Circular: Summer 2026 Exam Forms deadline extended till March 10th.',
    tag: '#ExamAlert',
    solution: 'Official Indus University PDF verified & pinned in Announcement Channel',
    color: 'bg-[#DCFCE7] border-[#86EFAC]', // Green sticky
    pinColor: '#10B981',
  },
  {
    author: 'Krish Patel',
    time: '12:15 PM',
    text: 'Google Summer of Code 2026 Org list released! Free AMA session tonight.',
    tag: '#CareerIntel',
    solution: '30-min roadmap webinar link shared in Tech Community',
    color: 'bg-[#E0F2FE] border-[#7DD3FC]', // Blue sticky
    pinColor: '#0EA5E9',
  },
];

const GUILD_PERKS = [
  {
    title: 'Instant Resource Requests',
    icon: 'search_check',
    desc: 'Can’t find a specific subject module or Indus University solution? Post in the room and get hand-curated links from peers in minutes.',
    color: 'bg-[#FEF3D6] border-amber-300',
  },
  {
    title: 'Senior & Alumni Mentorship',
    icon: 'workspace_premium',
    desc: 'Direct interaction with semester toppers, university rankers, and working alumni for viva questions, project reviews, and exam hacks.',
    color: 'bg-[#E0F2FE] border-sky-300',
  },
  {
    title: 'Fast Exam & Circular Alerts',
    icon: 'bolt',
    desc: 'Never get caught off-guard by sudden schedule changes, exam hall notifications, or urgent grade re-checking circulars.',
    color: 'bg-[#FFE4E6] border-rose-300',
  },
  {
    title: 'Hackathon Teammate Matcher',
    icon: 'groups_3',
    desc: 'Find designers, backend developers, and presentation leads for Smart India Hackathon (SIH), college hackathons, and ideathons.',
    color: 'bg-[#DCFCE7] border-emerald-300',
  },
  {
    title: 'Free Certification Roadmaps',
    icon: 'auto_awesome',
    desc: 'Access verified links to 100% free engineering courses, Cloud vouchers, AI workshops, and recognized skill certificates.',
    color: 'bg-[#F3E8FF] border-purple-300',
  },
  {
    title: 'Zero-Spam Learning Haven',
    icon: 'verified_user',
    desc: 'Active student moderators enforce zero spam, no promotional affiliate links, and pure academic value 24 hours a day.',
    color: 'bg-[#CCFBF1] border-teal-300',
  },
];

const FAQS = [
  {
    question: 'Are all CampusHub community groups and resources free?',
    answer: 'Yes, 100% free forever. CampusHub is an open student initiative created to make college notes, peer help, and exam alerts accessible to every learner without paywalls.',
  },
  {
    question: 'Which study channel should I join first?',
    answer: 'We recommend joining the "Official Student Broadcast" on WhatsApp for urgent timetables, plus our Telegram community lounge for daily notes and doubt resolution.',
  },
  {
    question: 'How does doubt solving work on the Quad board?',
    answer: 'Whenever you post an academic doubt in your group, active peers and verified senior rankers answer with handwritten snippets or step-by-step solutions within 5 to 10 minutes.',
  },
  {
    question: 'How do you keep the groups free from spam and ads?',
    answer: 'Our community operates under a strict Zero-Spam Policy. Verified student moderators and automated filters promptly ban unauthorized commercial links, promotions, or spam.',
  },
  {
    question: 'Can I contribute handwritten notes or become a student mentor?',
    answer: 'Yes! We warmly welcome note contributors and toppers. Reach out via our Contact desk or message any active group admin to get your verified contributor badge.',
  },
];

// ─── Main Community Component ─────────────────────────────────────────────────
export default function Community() {
  const { toasts, addToast, removeToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Live Campus Referendum / Ballot Box
  const [pollSelected, setPollSelected] = useState(null);
  const [pollVotes, setPollVotes] = useState({
    opt1: 54,
    opt2: 28,
    opt3: 13,
    opt4: 5,
  });

  // ─── Local Spotify Study Lounge State & Audio Control ─────────────────────
  const audioRef = useRef(null);
  const [activeCategoryId, setActiveCategoryId] = useState('lofi');
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);
  const [isTracklistOpen, setIsTracklistOpen] = useState(false);

  const activeCategory = SPOTIFY_STUDY_CATEGORIES.find((c) => c.id === activeCategoryId) || SPOTIFY_STUDY_CATEGORIES[0];
  const playlistTracks = activeCategory.tracks;
  const currentTrack = playlistTracks[trackIndex] || playlistTracks[0];
  const duration = currentTrack.durationMs;

  // Sync actual HTML5 Audio playback with isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback waiting for user action:', err);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, trackIndex, activeCategoryId]);

  // Sync volume and mute with HTML5 Audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPosition(Math.floor(audioRef.current.currentTime * 1000));
    }
  };

  const selectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    setTrackIndex(0);
    setPosition(0);
  };

  const playTrack = (track, index) => {
    setTrackIndex(index);
    setPosition(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % playlistTracks.length);
    setPosition(0);
  };

  const previousTrack = () => {
    setTrackIndex((prev) => (prev - 1 + playlistTracks.length) % playlistTracks.length);
    setPosition(0);
  };

  const seekTo = (pos) => {
    setPosition(pos);
    if (audioRef.current) {
      audioRef.current.currentTime = pos / 1000;
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val / 100;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume || 80);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  // Floating Stamp / Hype Reactions
  const [stampCount, setStampCount] = useState({
    cheer: 96,
    brain: 58,
    rocket: 134,
    hundred: 82,
  });
  const [floatingStamps, setFloatingStamps] = useState([]);

  const handleStamp = (type, emoji) => {
    setStampCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    const id = Date.now() + Math.random();
    const xOffset = Math.random() * 80 - 40;
    setFloatingStamps((prev) => [...prev, { id, emoji, xOffset }]);
    setTimeout(() => {
      setFloatingStamps((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  };

  const handleVote = (optionKey) => {
    if (pollSelected) return;
    setPollSelected(optionKey);
    setPollVotes((prev) => ({ ...prev, [optionKey]: prev[optionKey] + 1 }));
    addToast({ message: 'Stamped your vote in the Campus Ballot Box!', type: 'success' });
  };

  const totalVotes = pollVotes.opt1 + pollVotes.opt2 + pollVotes.opt3 + pollVotes.opt4;

  return (
    <div className="pt-24 sm:pt-28 min-h-screen text-[#0F172A] font-body-md pb-24 relative overflow-hidden bg-[#FFF8EC]">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* ── Cork & Tactile Pinboard Pattern Background ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 -z-10"
        style={{
          backgroundImage: 'radial-gradient(#b45309 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating Reaction Stamps */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
        {floatingStamps.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, y: 0, scale: 1, x: s.xOffset }}
            animate={{ opacity: 0, y: -130, scale: 1.6 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute text-3xl font-black drop-shadow-md"
          >
            {s.emoji}
          </motion.span>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-16 sm:space-y-20 relative z-10">

        {/* ══════════════════════════════════════════════════════════════════════════
            HERO CONCEPT: THE CAMPUS QUAD NOTICEBOARD & OFFICIAL STUDENT PASS
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: The Official Student Guild Card / Lanyard Pass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#FFFDF9] rounded-[36px] p-7 sm:p-10 lg:p-12 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] relative flex flex-col justify-between overflow-hidden"
          >
            {/* Tactile Pushpin Header */}
            <div className="absolute top-4 right-6 flex items-center gap-2">
              <PushPin color="#EF4444" className="w-8 h-8 drop-shadow-md" />
            </div>

            <div className="space-y-6">
              
              {/* College Marquee Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border-2 border-[#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-slate-900" />
                <span>The Student Quad · Est. 2026</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#0F172A]">
                Your Campus Hub for <br />
                <span className="bg-[#FACC15] px-2 py-0.5 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] inline-block mt-1">
                  Peer Power
                </span> &amp; Notes.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-700 text-sm sm:text-base lg:text-lg font-bold max-w-xl leading-relaxed">
                Connect with 5,000+ engineers across 40+ colleges. Instant doubt resolution, verified toppers&apos; notes, live study rooms, and direct exam alerts.
              </p>

              {/* Stamp Reaction Bar */}
              <div className="pt-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  📌 Stamp the quad bulletin board:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: 'cheer', emoji: '🔥', count: stampCount.cheer, label: 'Hype' },
                    { key: 'brain', emoji: '💡', count: stampCount.brain, label: 'Solved' },
                    { key: 'rocket', emoji: '🚀', count: stampCount.rocket, label: 'Boost' },
                    { key: 'hundred', emoji: '💯', count: stampCount.hundred, label: 'Verified' },
                  ].map((s) => (
                    <motion.button
                      key={s.key}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handleStamp(s.key, s.emoji)}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FEF3D6] border-2 border-[#0F172A] text-xs font-black text-[#0F172A] shadow-[2px_2px_0px_#0F172A] transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <span>{s.emoji}</span>
                      <span>{s.count}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Primary High-Energy Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 sm:px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                  <span>Join WhatsApp Community</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>

                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B132B] hover:bg-[#152244] text-[#FACC15] font-black px-6 sm:px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#FACC15]"
                >
                  <TelegramIcon className="w-5 h-5 text-[#FACC15]" />
                  <span>Join Telegram Channel</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Bottom Pass Barcode Mockup */}
            <div className="pt-6 mt-6 border-t-2 border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Verified by Indus University Rankers &amp; Alumni
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                |||| | ||||| || |||||| PASS-FREE
              </span>
            </div>
          </motion.div>

          {/* Right: The Live Corkboard Noticeboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-[#FAF6ED] rounded-[36px] p-6 sm:p-7 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] flex-grow flex flex-col justify-between relative overflow-hidden">
              
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📌</span>
                    <div>
                      <h2 className="font-black text-sm text-slate-900 uppercase tracking-tight">Quad Noticeboard</h2>
                      <p className="text-[11px] text-slate-500 font-bold">Live pinned peer discussions</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Pulse
                  </span>
                </div>

                {/* Pinned Sticky Notes */}
                <div className="space-y-3.5 mt-4">
                  {PINNED_STICKIES.map((note, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, rotate: 0 }}
                      className={`p-4 rounded-2xl border-2 ${note.color} shadow-[3px_3px_0px_rgba(15,23,42,0.15)] relative transition-all`}
                      style={{ transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` }}
                    >
                      <div className="absolute -top-3 left-4">
                        <PushPin color={note.pinColor} className="w-5 h-5" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-black text-slate-900">{note.author}</span>
                        <span className="font-bold text-slate-500">{note.time}</span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                        &quot;{note.text}&quot;
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-extrabold text-emerald-800">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          {note.solution}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/10 text-slate-800 text-[10px]">
                          {note.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Noticeboard Footer */}
              <div className="pt-3 mt-3 border-t-2 border-slate-200 text-center">
                <span className="text-[11px] font-black text-slate-600 flex items-center justify-center gap-1">
                  ⚡ Over 120+ peer discussions solved daily on our Quad board
                </span>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 2: 4 TACTILE BULLETIN METRIC BADGES
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {METRICS.map((m, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, rotate: 0 }}
              style={{ transform: `rotate(${m.rotation})` }}
              className="bg-white rounded-2xl p-5 border-2 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between relative group transition-all"
            >
              <div className="absolute -top-3 left-4">
                <PushPin color={m.pinColor} className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between mb-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] border-2 border-[#0F172A] text-slate-900 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">{m.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  {m.stamp}
                </span>
              </div>

              <div>
                <p className="font-black text-3xl text-slate-900 tracking-tight leading-none">
                  <AnimatedCounter target={m.value} />
                </p>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mt-1.5">{m.label}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{m.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 3: THE QUAD ACOUSTIC STAGE & STUDENT BALLOT BOX
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: The Spotify Study & Chill Lounge */}
          <div className="lg:col-span-6 bg-[#FEF3D6] rounded-[32px] p-6 sm:p-8 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              {/* Pill & Live Vibes Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A] text-[#1DB954] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
                  <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                  <span>Spotify Study Lounge</span>
                </span>
                <span className="text-xs text-slate-700 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
                  🎧 340+ Students Vibing
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  Bored or Tired? Play Study Beats
                </h2>
                <p className="text-xs text-slate-700 font-bold leading-relaxed mt-1">
                  Listen to student-curated Lo-Fi beats, deep coding soundscapes, and chill acoustic tracks directly while studying.
                </p>
              </div>

              {/* Playlist Category Quick Selectors */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
                {SPOTIFY_STUDY_CATEGORIES.map((cat) => {
                  const isSelected = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.id)}
                      className={`py-2 px-1 text-center rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer border-2 border-[#0F172A] whitespace-nowrap truncate ${
                        isSelected
                          ? 'bg-[#1DB954] text-slate-950 shadow-[2px_2px_0px_#0F172A]'
                          : 'bg-white text-slate-800 hover:bg-[#FFFDF9]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Compact Spotify Player Widget matching screenshot with Hover Playlist Reveal Drawer */}
              <div className="group/player rounded-[24px] overflow-visible border-2 border-[#0F172A] shadow-xl shadow-black/50 bg-[#1a1a1a] text-white relative transition-all duration-300">
                {/* Player Main Content Container */}
                <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Album Cover */}
                    <div className="relative shrink-0 group-hover/player:scale-105 transition-transform duration-300">
                      <img
                        src={activeCategory.artwork}
                        alt={currentTrack.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 shadow-md"
                      />
                      {isPlaying && (
                        <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 h-4 bg-[#121212] rounded px-1.5 py-0.5 border border-[#1DB954]/30">
                          {[40, 90, 60, 100, 50].map((h, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.2}%`] }}
                              transition={{ repeat: Infinity, duration: 0.45 + i * 0.1, ease: 'easeInOut' }}
                              className="w-0.5 bg-[#1DB954] rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Track Preview List & Playlist Header */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          {playlistTracks.slice(0, 2).map((tr, idx) => (
                            <div
                              key={tr.id}
                              onClick={() => playTrack(tr, idx)}
                              className={`flex items-center gap-2 text-xs font-semibold truncate cursor-pointer transition-colors ${
                                trackIndex === idx ? 'text-[#1DB954]' : 'text-white/80 hover:text-white'
                              }`}
                            >
                              <span className="font-mono text-white/40 text-[11px]">{idx + 1}</span>
                              <span className="truncate font-bold">{tr.title}</span>
                              <span className="text-white/40 text-[11px]">· {tr.artist}</span>
                            </div>
                          ))}
                        </div>

                        <a
                          href={currentTrack.externalUrl || `https://open.spotify.com/playlist/${activeCategory.playlistId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
                          title="Open on Spotify"
                        >
                          <SpotifyIcon className="w-5 h-5 text-white/80 hover:text-[#1DB954]" />
                        </a>
                      </div>

                      {/* Playlist Subtitle */}
                      <p className="text-xs font-bold text-white/60 truncate pt-0.5">
                        {activeCategory.name}
                      </p>
                    </div>
                  </div>

                  {/* Scrub Bar & Controls */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={previousTrack}
                      className="text-white/70 hover:text-white cursor-pointer transition-colors active:scale-90"
                      title="Previous Track"
                    >
                      <span className="material-symbols-outlined text-xl">skip_previous</span>
                    </button>

                    {/* Scrub Bar */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={position}
                        onChange={(e) => seekTo(Number(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#1DB954]"
                      />
                      <span className="text-[10px] font-mono text-white/50 shrink-0">
                        {formatMsToTime(position)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-white/50 hover:text-white cursor-pointer transition-colors"
                      title="Add to library"
                    >
                      <span className="material-symbols-outlined text-lg">add_circle_outline</span>
                    </button>

                    <button
                      type="button"
                      className="text-white/50 hover:text-white cursor-pointer transition-colors"
                      title="More options"
                    >
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>

                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-950 flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-90 shrink-0"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      <span className="material-symbols-outlined text-2xl text-slate-950">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Status Footer Bar */}
                <div className="px-4 py-2.5 bg-[#121212] border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 font-bold relative z-20 rounded-b-[22px]">
                  {/* Left: Full HD Stream Live Beat (Hover or Click to open tracklist menu) */}
                  <div className="relative group/stream-pill">
                    <button
                      type="button"
                      onClick={() => setIsTracklistOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-[#1DB954]/20 border border-white/10 hover:border-[#1DB954]/40 text-white transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-0.5 text-[#1DB954]">
                        <span className="w-1 h-2 bg-[#1DB954] rounded-xs animate-pulse" />
                        <span className="w-1 h-3 bg-[#1DB954] rounded-xs animate-pulse delay-75" />
                        <span className="w-1 h-1.5 bg-[#1DB954] rounded-xs animate-pulse delay-150" />
                      </span>
                      <span className="font-extrabold text-white">Full HD Stream</span>
                      <span className="text-rose-400 font-extrabold">Live Beat</span>
                      <span className="text-[10px] text-[#1DB954] font-black group-hover/stream-pill:translate-y-[-1px] transition-transform">
                        🎵 Songs ▾
                      </span>
                    </button>

                    {/* Track Selector Popover on Hover / Click */}
                    <div className={`absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-[#181818] border-2 border-[#1DB954]/50 rounded-2xl p-3.5 shadow-2xl transition-all duration-250 z-50 ${
                      isTracklistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/stream-pill:opacity-100 group-hover/stream-pill:pointer-events-auto'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-1.5 text-xs font-black text-white">
                          <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                          <span>{activeCategory.label} Playlist ({playlistTracks.length} Songs)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsTracklistOpen(false)}
                          className="text-[9px] text-[#1DB954] hover:underline font-extrabold cursor-pointer"
                        >
                          Close ✕
                        </button>
                      </div>

                      <div className="space-y-1 my-2 max-h-52 overflow-y-auto pr-1">
                        {playlistTracks.map((tr, idx) => {
                          const isActive = trackIndex === idx;
                          return (
                            <button
                              key={tr.id}
                              type="button"
                              onClick={() => {
                                playTrack(tr, idx);
                                setIsTracklistOpen(false);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-all cursor-pointer border ${
                                isActive
                                  ? 'bg-[#1DB954]/20 border-[#1DB954]/50 text-[#1DB954] font-black'
                                  : 'bg-white/5 border-transparent text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-[10px] text-white/40">{idx + 1}</span>
                                <div className="min-w-0">
                                  <p className="truncate font-bold leading-tight text-[11px]">{tr.title}</p>
                                  <p className="text-[9px] text-white/40 truncate">{tr.artist}</p>
                                </div>
                              </div>
                              <span className="font-mono text-[9px] text-white/40 shrink-0">{tr.durationFormatted}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-bold">
                        <span>Click song to play live</span>
                        <span className="text-[#1DB954]">Indus Lounge</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Working Interactive Volume Control (Hover/Click to adjust volume) */}
                  <div className="flex items-center gap-2 group/volume relative">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <span className="material-symbols-outlined text-base text-white/80">
                        {isMuted || volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                        className="w-16 sm:w-20 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#1DB954]"
                      />
                      <span className="font-mono text-[10px] text-white/60 min-w-6 text-right font-bold">
                        {isMuted ? '0%' : `${volume}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HTML5 Audio Stream Element */}
                <audio
                  ref={audioRef}
                  src={currentTrack.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={nextTrack}
                  preload="auto"
                />
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-4 mt-4 border-t-2 border-slate-900/10 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://open.spotify.com/playlist/${activeCategory.playlistId || '0vvXsWCC9xrXsKd4FyS8kM'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-[#1DB954] hover:bg-[#1aa34a] text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <SpotifyIcon className="w-5 h-5 text-slate-950" />
                <span>Open in Spotify App</span>
                <span className="w-5 h-5 rounded-md border border-slate-950/40 flex items-center justify-center bg-slate-950/10">
                  <span className="material-symbols-outlined text-xs text-slate-950">open_in_new</span>
                </span>
              </a>

              <span className="text-xs sm:text-sm text-slate-800 font-extrabold">
                Curated for Indus University Peers
              </span>
            </div>
          </div>

          {/* Right: The Student Ballot Box */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-7 sm:p-8 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3D6] text-slate-900 border-2 border-[#0F172A] text-xs font-black">
                  <span className="material-symbols-outlined text-sm">how_to_vote</span>
                  Campus Referendum Box
                </span>
                <span className="text-xs text-slate-500 font-black">{totalVotes} Ballots Cast</span>
              </div>

              <h2 className="text-lg font-black text-slate-900">
                What is your biggest blocker for upcoming university exams?
              </h2>

              {/* Poll Options */}
              <div className="space-y-2.5 mt-4">
                {[
                  { key: 'opt1', label: 'Missing step-by-step solved PYQ papers', votes: pollVotes.opt1 },
                  { key: 'opt2', label: 'Complex numerical derivations & formulas', votes: pollVotes.opt2 },
                  { key: 'opt3', label: 'Viva questions & practical experiment files', votes: pollVotes.opt3 },
                  { key: 'opt4', label: 'Time management & sudden date changes', votes: pollVotes.opt4 },
                ].map((opt) => {
                  const pct = Math.round((opt.votes / totalVotes) * 100);
                  const isChosen = pollSelected === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleVote(opt.key)}
                      disabled={!!pollSelected}
                      className={`w-full p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-black transition-all relative overflow-hidden cursor-pointer ${
                        isChosen
                          ? 'border-[#0F172A] bg-amber-100 text-slate-900 shadow-[2px_2px_0px_#0F172A]'
                          : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-[#0F172A] hover:bg-white'
                      }`}
                    >
                      {pollSelected && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                          className={`absolute top-0 left-0 bottom-0 ${isChosen ? 'bg-amber-300/40' : 'bg-slate-200/50'} pointer-events-none`}
                        />
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span>{opt.label}</span>
                        {pollSelected && <span className="font-black text-slate-900">{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-bold mt-4 pt-3 border-t border-slate-100">
              💡 Solutions for the winning topic get uploaded to the Resource Vault every Friday.
            </p>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 4: EXCLUSIVE GUILD PERKS (TACTILE CARDS)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF3D6] text-slate-900 text-xs font-black uppercase tracking-wider mb-2 border border-[#0F172A]">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>Member Privileges</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Join the CampusHub Community?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-bold mt-1 max-w-2xl">
              Everything you need to excel in university exams, lab vivas, hackathons, and placement drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUILD_PERKS.map((perk, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className={`rounded-3xl p-6 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between group ${perk.color}`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FACC15] border-2 border-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_#0F172A]">
                    <span className="material-symbols-outlined text-2xl">{perk.icon}</span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-amber-800 transition-colors">
                    {perk.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                    {perk.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-black/10 flex items-center text-xs font-black text-slate-700">
                  <span>Available in all groups</span>
                  <span className="material-symbols-outlined text-sm ml-auto">chevron_right</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 5: CODE OF CONDUCT & HELPDESK ACCORDION
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF3D6] text-slate-900 text-xs font-black uppercase tracking-wider mb-2 border border-[#0F172A]">
                <span className="material-symbols-outlined text-sm">help</span>
                <span>Frequently Asked Questions</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaq === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="bg-white rounded-2xl border-2 border-[#0F172A] overflow-hidden shadow-[3px_3px_0px_#0F172A]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`material-symbols-outlined text-lg text-slate-600 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-amber-700' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-4 pt-1 text-xs text-slate-600 font-bold leading-relaxed border-t-2 border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quad Code of Conduct */}
          <div className="lg:col-span-5 bg-[#FAF6ED] p-6 sm:p-8 rounded-3xl border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] text-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FACC15] flex items-center justify-center font-black border-2 border-[#0F172A]">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Quad Code of Conduct</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-bold">
                Our student groups operate under strict active moderation to guarantee an ad-free, spam-free learning haven.
              </p>

              <ul className="space-y-2.5 pt-1">
                {[
                  'Zero tolerance for commercial spam or marketing links',
                  'Only verified syllabus notes & genuine paper solutions',
                  'Academic decorum & mutual respect for all peers',
                  'Privacy protected: no unsolicited direct messaging',
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-black">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-slate-200 text-center">
              <Link
                to="/contact"
                className="text-xs font-black text-slate-900 hover:text-amber-700 underline inline-flex items-center gap-1"
              >
                <span>Report an issue or contact Admin Desk</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 6: CLAIM YOUR PASS (BOTTOM TICKET BANNER)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-[#FACC15] rounded-[36px] p-8 sm:p-12 text-center text-slate-950 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-[#FACC15] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              <span>Join 5,000+ Student Engineers</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-950">
              Never Study Alone Again.
            </h2>

            <p className="text-slate-900 text-xs sm:text-sm sm:text-base font-extrabold max-w-lg mx-auto">
              Get instant study materials, fast doubt solutions, and exam alerts delivered directly to your phone.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://chat.whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F172A] hover:bg-slate-800 text-[#FACC15] font-black px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A] text-xs sm:text-sm"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                <span>Join Official WhatsApp</span>
              </a>

              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-950 font-black px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A] text-xs sm:text-sm"
              >
                <TelegramIcon className="w-5 h-5 text-[#229ED9]" />
                <span>Join Official Telegram</span>
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
