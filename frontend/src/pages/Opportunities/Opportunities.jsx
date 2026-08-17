import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpportunities, useAnnouncements } from '../../hooks/useOpportunities';
import { OpportunityCardSkeleton, AnnouncementSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatRelativeTime } from '../../services/opportunities/opportunitiesApi';
import { useOpportunitySubmit } from '../../hooks/useResourceRequest';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import AcademicCalendar from './components/AcademicCalendar';
import { SplitText, DecipherText } from './components/CharacterText';

const CATEGORY_TABS = [
  { id: 'All', label: 'All Postings', icon: 'auto_awesome' },
  { id: 'Internships', label: 'Internships', icon: 'work' },
  { id: 'Hackathons', label: 'Hackathons', icon: 'emoji_events' },
  { id: 'Scholarships', label: 'Scholarships', icon: 'school' },
  { id: 'Coding', label: 'Open Source & Grants', icon: 'terminal' },
  { id: 'Workshops', label: 'Workshops', icon: 'psychology' },
  { id: 'Remote', label: 'Remote', icon: 'public' },
  { id: 'Online', label: 'Online', icon: 'devices' },
];

const CLOSING_SOON_DATA = [
  {
    id: 'close-1',
    title: 'Google Summer of Code 2026',
    category: 'Open Source',
    deadline: 'In 3 days',
    urgent: true,
    tag: 'Stipend $1500+',
    link: 'https://summerofcode.withgoogle.com',
  },
  {
    id: 'close-2',
    title: 'Microsoft Explore Internship',
    category: 'Internship',
    deadline: 'This Friday',
    urgent: true,
    tag: 'Paid • 2nd Year',
    link: 'https://careers.microsoft.com',
  },
  {
    id: 'close-3',
    title: 'Smart India Hackathon (SIH)',
    category: 'Hackathon',
    deadline: 'Closing soon',
    urgent: false,
    tag: 'Govt • ₹1 Lakh Prize',
    link: 'https://sih.gov.in',
  },
];

function Opportunities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ch_bookmarked_opps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { toasts, addToast, removeToast } = useToast();

  // Close dialogs on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedOpp(null);
        setIsSubmitModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const {
    formData,
    handleChange,
    handleSubmit,
    status: submitStatus,
    errorMessage: submitError,
    reset: resetForm,
  } = useOpportunitySubmit();

  const { opportunities, loading: oppLoading, error: oppError, refetch: refetchOpp } = useOpportunities();
  const { announcements, loading: annLoading, error: annError } = useAnnouncements();

  // Save / Toggle bookmarks
  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ch_bookmarked_opps', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      addToast({
        message: prev.includes(id) ? 'Removed from Watchlist' : '⭐ Saved to Watchlist!',
        type: 'info',
        duration: 2500,
      });
      return next;
    });
  };

  const handleShareLink = (opp, e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      message: '📋 Opportunity link copied to clipboard!',
      type: 'success',
      duration: 2500,
    });
  };

  useEffect(() => {
    if (submitStatus === 'success') {
      addToast({
        message: '🎉 Opportunity submitted! It will appear once reviewed by admin.',
        type: 'success',
        duration: 5000,
      });
      setIsSubmitModalOpen(false);
      resetForm();
    }
    if (submitStatus === 'error' && submitError) {
      addToast({ message: submitError, type: 'error', duration: 5000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus, submitError]);

  // Filtering
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (opp.title && opp.title.toLowerCase().includes(q)) ||
        (opp.description && opp.description.toLowerCase().includes(q)) ||
        (opp.category && opp.category.toLowerCase().includes(q)) ||
        (opp.tag && opp.tag.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Saved') return bookmarkedIds.includes(opp.id);

      const cat = (opp.category || '').toLowerCase();
      const tag = (opp.tag || '').toLowerCase();
      const filterLower = activeFilter.toLowerCase();

      return cat.includes(filterLower) || tag.includes(filterLower);
    });
  }, [opportunities, searchQuery, activeFilter, bookmarkedIds]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: opportunities.length };
    opportunities.forEach((opp) => {
      const cat = opp.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  // Visual Theme Helpers
  const getCategoryTheme = (category, tag) => {
    const text = `${category || ''} ${tag || ''}`.toLowerCase();
    if (text.includes('campus') || text.includes('placement') || text.includes('intern')) {
      return {
        badge: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
        icon: 'work',
        glow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
        borderHover: 'hover:border-amber-400',
        pillColor: 'bg-amber-500',
      };
    }
    if (text.includes('govt') || text.includes('hackathon') || text.includes('prize')) {
      return {
        badge: 'bg-rose-100/90 text-rose-900 border-rose-300/80',
        icon: 'emoji_events',
        glow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]',
        borderHover: 'hover:border-rose-400',
        pillColor: 'bg-rose-500',
      };
    }
    if (text.includes('source') || text.includes('coding') || text.includes('tech')) {
      return {
        badge: 'bg-sky-100/90 text-sky-900 border-sky-300/80',
        icon: 'code',
        glow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]',
        borderHover: 'hover:border-sky-400',
        pillColor: 'bg-sky-500',
      };
    }
    if (text.includes('scholarship') || text.includes('funded')) {
      return {
        badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80',
        icon: 'school',
        glow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
        borderHover: 'hover:border-emerald-400',
        pillColor: 'bg-emerald-500',
      };
    }
    return {
      badge: 'bg-purple-100/90 text-purple-900 border-purple-300/80',
      icon: 'psychology',
      glow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]',
      borderHover: 'hover:border-purple-400',
      pillColor: 'bg-purple-500',
    };
  };

  return (
    <div className="pt-20 bg-[#f8fafc] text-slate-800 font-sans min-h-screen pb-20 relative overflow-x-clip selection:bg-amber-300 selection:text-slate-900">
      {/* ─── Ambient Canvas & Subtle Grid Pattern ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[25%] -right-24 w-[550px] h-[550px] bg-gradient-to-bl from-sky-300/25 via-indigo-300/15 to-transparent rounded-full blur-3xl opacity-65" />
        <div className="absolute top-[65%] -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-300/20 via-pink-300/10 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── HERO HEADER SECTION WITH KINETIC TYPOGRAPHY ─── */}
        <section className="pt-8 pb-6 text-center max-w-4xl mx-auto">
          {/* Status Eyebrow Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>Discover Top Opportunities</span>
            <span className="text-amber-400">•</span>
            <span className="text-slate-600 font-semibold">Updated Daily</span>
          </div>

          {/* Headline with Per-Character Kinetic Text Effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <SplitText
              text="Accelerate Your"
              className="text-slate-900"
              charClassName="hover:text-amber-500 transition-colors"
              stagger={0.025}
              delay={0.05}
            />
            <span className="relative inline-flex items-baseline pb-1">
              <SplitText
                text="Career Journey"
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 drop-shadow-xs"
                charClassName="hover:scale-110 transition-transform"
                stagger={0.03}
                delay={0.2}
              />
              <svg
                className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-amber-400/80 pointer-events-none"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0 6 Q 50 0 100 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8">
            Curated internships, high-impact hackathons, prestigious scholarships, campus placement drives, and open-source grants.
          </p>

          {/* Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-7 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">verified</span>
              <span>{opportunities.length || '50+'} Verified Opportunities</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">update</span>
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-sky-500 text-[18px]">public</span>
              <span>100% Free &amp; Open Access</span>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-7">
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-1.5 pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[22px]">
                  search
                </span>
              </div>

              <input
                type="text"
                id="opportunity-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                placeholder="Search opportunities by title, category, company, or keywords..."
                aria-label="Search opportunities"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <span className="hidden sm:inline-block absolute right-4 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-400 border border-slate-200 pointer-events-none">
                  SEARCH
                </span>
              )}
            </div>
          </div>

          {/* Categorized Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2" role="group" aria-label="Filter opportunities">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = tab.id === 'All' ? categoryCounts.All : categoryCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30 border border-amber-400 scale-[1.03]'
                      : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {typeof count === 'number' && count > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Saved Bookmarks Filter Tab */}
            {bookmarkedIds.length > 0 && (
              <button
                onClick={() => setActiveFilter('Saved')}
                aria-pressed={activeFilter === 'Saved'}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeFilter === 'Saved'
                    ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-400 scale-[1.03]'
                    : 'bg-white/90 text-amber-700 hover:text-amber-900 border border-amber-200/80 hover:bg-amber-50/60 shadow-2xs'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-amber-500 font-fill">bookmark</span>
                <span>Watchlist ({bookmarkedIds.length})</span>
              </button>
            )}
          </div>
        </section>

        {/* ─── MAIN FEED & SIDEBAR GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Feed (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Feed Status Header */}
            <div className="flex items-center justify-between px-1 pb-1 text-xs sm:text-sm text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredOpportunities.length}</strong> {activeFilter === 'All' ? 'opportunities' : activeFilter}
                </span>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-600 hover:underline text-xs cursor-pointer font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Clear Filter</span>
                </button>
              )}
            </div>

            {/* Error State */}
            {oppError && !oppLoading && (
              <ErrorState message={oppError} onRetry={refetchOpp} className="mb-6" />
            )}

            {/* Loading Skeletons */}
            {oppLoading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Opportunities List */}
            {!oppLoading && !oppError && (
              <div className="space-y-4">
                {filteredOpportunities.map((opp) => {
                  const theme = getCategoryTheme(opp.category, opp.tag);
                  const isSaved = bookmarkedIds.includes(opp.id);

                  return (
                    <motion.div
                      layoutId={`opp-card-${opp.id}`}
                      key={opp.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedOpp(opp)}
                      className={`group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${theme.borderHover} ${theme.glow} transition-all duration-300 overflow-hidden cursor-pointer`}
                    >
                      {/* Left Color Accent Line */}
                      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${theme.pillColor}`} />

                      <div className="flex items-start justify-between gap-4 mb-3">
                        {/* Tags & Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.span
                            layoutId={`opp-tag-${opp.id}`}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}`}
                          >
                            <span className="material-symbols-outlined text-[13px]">{theme.icon}</span>
                            <DecipherText text={opp.tag || opp.category || 'Opportunity'} trigger="hover" speed={20} />
                          </motion.span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {opp.created_at || opp.createdAt ? formatRelativeTime(opp.created_at || opp.createdAt) : 'Recently added'}
                          </span>
                        </div>

                        {/* Top Actions: Share & Bookmark */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleShareLink(opp, e)}
                            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy link"
                            aria-label="Share opportunity"
                          >
                            <span className="material-symbols-outlined text-[17px] leading-none">share</span>
                          </button>

                          <button
                            onClick={(e) => toggleBookmark(opp.id, e)}
                            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSaved
                                ? 'bg-amber-50 text-amber-500 border-amber-300 shadow-2xs'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                            aria-label="Bookmark opportunity"
                          >
                            <span className={`material-symbols-outlined text-[18px] leading-none ${isSaved ? 'font-fill text-amber-500' : ''}`}>
                              {isSaved ? 'bookmark' : 'bookmark_border'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Card Title */}
                      <motion.h2
                        layoutId={`opp-title-${opp.id}`}
                        className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors"
                      >
                        {opp.title}
                      </motion.h2>

                      {/* Description */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                        {opp.description}
                      </p>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 text-[11px]">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Verified Hub Post</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOpp(opp);
                          }}
                          className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer"
                        >
                          <span>Inquire / Apply</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Empty State */}
                {filteredOpportunities.length === 0 && (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">No matching opportunities found</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                      No results found for &quot;{searchQuery || activeFilter}&quot;. Try adjusting your keywords or category filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('All');
                      }}
                      className="px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR (4 Columns) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Live Announcements Widget */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Live Announcements
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Campus Updates
                </span>
              </div>

              <div className="space-y-3">
                {annLoading && Array.from({ length: 3 }).map((_, i) => (
                  <AnnouncementSkeleton key={i} />
                ))}

                {!annLoading && !annError && announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-amber-50/50 border border-slate-200/60 hover:border-amber-200 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-amber-500 shrink-0 mt-0.5">
                        campaign
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-amber-800 transition-colors">
                          {ann.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-medium">
                          {ann.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200/80 text-amber-900">
                              {ann.badge}
                            </span>
                          )}
                          <span>{formatRelativeTime(ann.created_at || ann.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {annError && !annLoading && (
                  <p className="text-xs text-rose-500 font-medium">Could not load announcements.</p>
                )}
              </div>
            </div>

            {/* 2. Urgent / Closing Soon Widget */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-5 sm:p-6 border border-amber-300/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[20px] animate-bounce">
                    local_fire_department
                  </span>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Closing This Week
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Critical Deadlines
                </span>
              </div>

              <div className="space-y-3">
                {CLOSING_SOON_DATA.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {item.tag}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        {item.deadline}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 3. Academic Calendar Widget */}
            <div className="bg-white rounded-3xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/80">
              <AcademicCalendar />
            </div>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 relative z-10">
        <div className="bg-[#0B132B] rounded-3xl p-8 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-2xl border border-white/10 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none">
              <pattern id="cta-grid-opp-clean" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid-opp-clean)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span>Community-Driven Hub</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight text-white">
              Know of an opportunity we missed?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed font-medium">
              Share hackathons, summer internships, or study grants with the campus community. Submissions are reviewed and made live for all students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black px-8 py-3.5 rounded-full text-sm shadow-lg hover:shadow-yellow-400/20 hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Submit Opportunity</span>
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold border-2 border-white/40 hover:border-white px-8 py-3.5 rounded-full text-sm transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
                <span>Request a Resource</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MORPHING DIALOG MODAL ─── */}
      <AnimatePresence>
        {selectedOpp && (() => {
          const theme = getCategoryTheme(selectedOpp.category, selectedOpp.tag);
          const isSaved = bookmarkedIds.includes(selectedOpp.id);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
              {/* Click backdrop to morph back */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={() => setSelectedOpp(null)}
              />

              <motion.div
                layoutId={`opp-card-${selectedOpp.id}`}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200/90 shadow-2xl z-10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Accent Strip */}
                <div className={`absolute top-0 left-0 right-0 h-2 ${theme.pillColor}`} />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                {/* Header Metadata */}
                <div className="flex items-center gap-2 mb-4 flex-wrap pt-2">
                  <motion.span
                    layoutId={`opp-tag-${selectedOpp.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{theme.icon}</span>
                    <span>{selectedOpp.tag || selectedOpp.category || 'Opportunity'}</span>
                  </motion.span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>
                      {selectedOpp.created_at || selectedOpp.createdAt
                        ? formatRelativeTime(selectedOpp.created_at || selectedOpp.createdAt)
                        : 'Recently added'}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs font-bold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Verified Post</span>
                  </span>
                </div>

                {/* Expanded Title */}
                <motion.h2
                  layoutId={`opp-title-${selectedOpp.id}`}
                  className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-snug"
                >
                  {selectedOpp.title}
                </motion.h2>

                {/* Full Description & Context */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 max-h-[300px] overflow-y-auto">
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                    {selectedOpp.description}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={(e) => toggleBookmark(selectedOpp.id, e)}
                      className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'font-fill text-amber-500' : ''}`}>
                        {isSaved ? 'bookmark' : 'bookmark_border'}
                      </span>
                      <span>{isSaved ? 'Saved to Watchlist' : 'Save to Watchlist'}</span>
                    </button>

                    <button
                      onClick={(e) => handleShareLink(selectedOpp, e)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Share link"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/contact"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 text-center"
                      onClick={() => setSelectedOpp(null)}
                    >
                      <span>Inquire / Apply</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ─── SUBMIT OPPORTUNITY MODAL ─── */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  resetForm();
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">publish</span>
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 leading-none">Submit Opportunity</h3>
                  <p className="text-xs text-slate-500 mt-1">Help peers discover new programs and jobs</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <label htmlFor="opp-title" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                    Opportunity Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="opp-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Google STEP Internship 2026"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                    disabled={submitStatus === 'loading'}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="opp-category" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="opp-category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      {CATEGORY_TABS.filter((f) => f.id !== 'All').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="opp-email" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="opp-email"
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => handleChange('submitterEmail', e.target.value)}
                      placeholder="student@gmail.com"
                      pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                      title="Please enter a valid @gmail.com address"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                      disabled={submitStatus === 'loading'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="opp-desc" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                    Description &amp; Link <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="opp-desc"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide details about the role, eligibility, stipend, and official application URL..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
                    disabled={submitStatus === 'loading'}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitModalOpen(false);
                      resetForm();
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    disabled={submitStatus === 'loading'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    disabled={submitStatus === 'loading'}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Submit for Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Opportunities;
