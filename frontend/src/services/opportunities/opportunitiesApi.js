import { fetchFromApi } from '../../lib/api';

const TIMEOUT_MS = 8000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}

const FALLBACK_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Upcoming Hackathons',
    description: 'Collaborate with peers to build innovative solutions for real-world problems. Great for portfolio building.',
    emoji: '🚀',
    tag: 'Active',
    tagType: 'primary',
    rotate: '-1deg',
    pinBg: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)',
    category: 'Hackathons',
  },
  {
    id: '2',
    title: 'Internships',
    description: 'Gain professional experience with top companies in tech, finance, and creative industries worldwide.',
    emoji: '💼',
    tag: 'High Demand',
    tagType: 'tertiary',
    rotate: '1.2deg',
    pinBg: 'radial-gradient(circle at 30% 30%, rgb(59, 130, 246), rgb(30, 58, 138))',
    category: 'Internships',
  },
  {
    id: '3',
    title: 'Scholarships',
    description: 'Financial aid opportunities for undergraduate and postgraduate studies across various disciplines.',
    emoji: '🎓',
    tag: 'Funded',
    tagType: 'error',
    rotate: '0.5deg',
    pinBg: 'radial-gradient(circle at 30% 30%, rgb(16, 185, 129), rgb(6, 78, 59))',
    category: 'Scholarships',
  },
  {
    id: '4',
    title: 'Workshops',
    description: 'Hands-on learning sessions led by industry experts to master specific tools and technologies.',
    emoji: '🛠',
    tag: 'Certified',
    tagType: 'primary',
    rotate: '-1.5deg',
    pinBg: 'radial-gradient(circle at 30% 30%, rgb(168, 85, 247), rgb(88, 28, 135))',
    category: 'Workshops',
  },
  {
    id: '5',
    title: 'Webinars',
    description: 'Live online seminars featuring thought leaders discussing current trends and career advice.',
    emoji: '🎥',
    tag: 'Online',
    tagType: 'tertiary',
    rotate: '0.9deg',
    pinBg: 'radial-gradient(circle at 30% 30%, rgb(6, 182, 212), rgb(22, 78, 99))',
    category: 'Online',
  },
  {
    id: '6',
    title: 'Certifications',
    description: 'Validate your skills with industry-recognized certificates from leading providers and universities.',
    emoji: '📜',
    tag: 'Self-paced',
    tagType: 'primary',
    rotate: '-0.4deg',
    pinBg: 'radial-gradient(circle at 30% 30%, #6366f1, #312e81)',
    category: 'Remote',
  },
  {
    id: '7',
    title: 'College Events',
    description: 'Stay updated with cultural fests, technical events, and campus activities happening near you.',
    emoji: '📅',
    tag: 'Cultural',
    tagType: 'primary',
    rotate: '0.7deg',
    pinBg: 'radial-gradient(circle at 30% 30%, #f59e0b, #b45309)',
    category: 'Coding',
  },
];

const FALLBACK_ANNOUNCEMENTS = [
  { id: '1', text: 'Google Summer of Code registrations are open.', badge: 'New', color: 'bg-green-500', deadline: null, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', text: 'Smart India Hackathon 2026 registrations started.', badge: 'New', color: 'bg-red-500', deadline: null, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', text: 'Microsoft Internship applications closing soon.', badge: 'Closing Soon', color: 'bg-yellow-500', deadline: 'Oct 25, 2026', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', text: 'Amazon Campus Hiring announced for SDE roles.', badge: 'Updated', color: 'bg-blue-500', deadline: 'Nov 10, 2026', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '5', text: 'NPTEL July Certification enrollment open.', badge: null, color: 'bg-purple-500', deadline: null, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
];

export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return 'Just now';
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export async function getOpportunities() {
  try {
    const data = await withTimeout(fetchFromApi('opportunities'));
    return data.opportunities || FALLBACK_OPPORTUNITIES;
  } catch (err) {
    console.warn('[opportunitiesApi] getOpportunities failed, using fallback:', err.message);
    return FALLBACK_OPPORTUNITIES;
  }
}

export async function getAnnouncements() {
  try {
    const data = await withTimeout(fetchFromApi('opportunities'));
    return data.announcements || FALLBACK_ANNOUNCEMENTS;
  } catch (err) {
    console.warn('[opportunitiesApi] getAnnouncements failed, using fallback:', err.message);
    return FALLBACK_ANNOUNCEMENTS;
  }
}
