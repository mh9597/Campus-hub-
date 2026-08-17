import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities, useAnnouncements } from '../../hooks/useOpportunities';
import { OpportunityCardSkeleton, AnnouncementSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatRelativeTime } from '../../services/opportunities/opportunitiesApi';
import { useOpportunitySubmit } from '../../hooks/useResourceRequest';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import AcademicCalendar from './components/AcademicCalendar';

const FILTERS = ['All', 'Internships', 'Hackathons', 'Scholarships', 'Coding', 'Workshops', 'Remote', 'Online'];

function Opportunities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

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

  useEffect(() => {
    if (submitStatus === 'success') {
      addToast({
        message: '✅ Opportunity submitted! Pending admin moderation.',
        type: 'success',
        duration: 5000,
      });
      setIsModalOpen(false);
      resetForm();
    }
    if (submitStatus === 'error' && submitError) {
      addToast({ message: submitError, type: 'error', duration: 5000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus, submitError]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || opp.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getBadgeStyle = (category, tag) => {
    const text = (tag || category || '').toLowerCase();
    if (text.includes('campus') || text.includes('intern')) {
      return 'bg-amber-100/90 text-amber-900 border border-amber-300/60';
    }
    if (text.includes('govt') || text.includes('hackathon') || text.includes('active')) {
      return 'bg-rose-100/90 text-rose-900 border border-rose-300/60';
    }
    if (text.includes('source') || text.includes('coding') || text.includes('demand')) {
      return 'bg-sky-100/90 text-sky-900 border border-sky-300/60';
    }
    if (text.includes('scholarship') || text.includes('funded')) {
      return 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/60';
    }
    return 'bg-slate-100 text-slate-800 border border-slate-200';
  };

  return (
    <div className="pt-24 bg-[#f8fafc] text-slate-800 font-sans min-h-screen pb-16 relative overflow-hidden">
      {/* ─── Background Theme Decorations (Soft Ambient Canvas) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Base Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-slate-100/50" />

        {/* Soft Ambient Aurora Mesh Glows */}
        <div className="absolute -top-10 -left-20 w-[480px] h-[480px] bg-amber-200/35 rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[15%] right-[-10%] w-[450px] h-[450px] bg-sky-200/30 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[50%] left-[-5%] w-[460px] h-[460px] bg-purple-200/25 rounded-full blur-3xl opacity-65" />
        <div className="absolute bottom-[5%] right-[10%] w-[420px] h-[420px] bg-emerald-200/30 rounded-full blur-3xl opacity-70" />

        {/* Subtle Hollow Amber Accent Rings */}
        <div className="hidden md:block absolute top-[16%] left-[48%] w-5 h-5 rounded-full border-2 border-amber-400/70 opacity-75" />
        <div className="hidden md:block absolute top-[44%] right-[4%] w-6 h-6 rounded-full border-2 border-amber-400/70 opacity-80" />
        <div className="hidden md:block absolute top-[75%] left-[5%] w-6 h-6 rounded-full border-2 border-amber-400/70 opacity-80" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 pt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Explore Opportunities
          </h1>

          {/* Centered Search Bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <input
              type="text"
              id="opportunity-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-12 py-3.5 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
              placeholder="Search opportunities..."
              aria-label="Search opportunities"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
              search
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8" role="group" aria-label="Filter opportunities">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FACC15] text-slate-950 font-bold border border-yellow-400 shadow-xs scale-[1.02]'
                      : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Opportunities Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Error State */}
            {oppError && !oppLoading && (
              <ErrorState message={oppError} onRetry={refetchOpp} className="mb-6" />
            )}

            {/* Skeletons */}
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
                {filteredOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-200 group"
                  >
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(opp.category, opp.tag)}`}>
                        {opp.tag || opp.category || 'Opportunity'}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-snug">
                      {opp.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {opp.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{opp.created_at ? formatRelativeTime(opp.created_at) : 'Aug 8, 2025'}</span>
                      <Link
                        to="/resources"
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-amber-600 font-semibold transition-colors group/link text-xs"
                      >
                        <span>Explore</span>
                        <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {filteredOpportunities.length === 0 && (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/70 shadow-xs">
                    <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">search_off</span>
                    <p className="font-bold text-slate-800 text-base mb-1">No opportunities match your search</p>
                    <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Latest Announcements Widget */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
                Latest Announcements
              </h2>

              <div className="space-y-4">
                {annLoading && Array.from({ length: 3 }).map((_, i) => (
                  <AnnouncementSkeleton key={i} />
                ))}

                {!annLoading && !annError && announcements.map((ann) => (
                  <div key={ann.id} className="border-b border-slate-100 last:border-0 pb-3.5 mb-3.5 last:pb-0 last:mb-0 group cursor-pointer">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-amber-600 transition-colors">
                      {ann.text}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      {formatRelativeTime(ann.created_at)}
                    </p>
                  </div>
                ))}

                {annError && !annLoading && (
                  <p className="text-xs text-rose-500 font-medium">Could not load announcements.</p>
                )}
              </div>
            </div>

            {/* Closing This Week Widget */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-bold text-slate-900 mb-3 tracking-tight">
                Closing This Week
              </h2>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                Summer Researchity • Remote
              </div>
            </div>

            {/* Academic Calendar Widget */}
            <AcademicCalendar />
          </div>
        </div>
      </main>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 relative z-10">
        <div className="bg-[#0B132B] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800 text-white">
          {/* Subtle Technical Pattern inside CTA Box */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none">
              <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight text-white">
              Can't find the right opportunity?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Help us grow the community by requesting a specific resource or submitting one you've found.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-bold px-7 py-3 rounded-full text-sm shadow-md transition-all cursor-pointer"
              >
                Submit Opportunity
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-semibold border border-slate-600 hover:border-slate-400 px-7 py-3 rounded-full text-sm transition-all text-center inline-block"
              >
                Request a Resource
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="font-bold text-xl text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">publish</span>
              Submit an Opportunity
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Share internships, hackathons, scholarships, or other opportunities with the student community. Submissions will go live after admin moderation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="opp-title" className="block font-semibold text-xs uppercase tracking-wider text-slate-700 mb-1">
                  Opportunity Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="opp-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Google STEP Internship 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label htmlFor="opp-category" className="block font-semibold text-xs uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="opp-category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                    disabled={submitStatus === 'loading'}
                  >
                    {FILTERS.filter(f => f !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Submitter Email */}
                <div>
                  <label htmlFor="opp-email" className="block font-semibold text-xs uppercase tracking-wider text-slate-700 mb-1">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                    disabled={submitStatus === 'loading'}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="opp-desc" className="block font-semibold text-xs uppercase tracking-wider text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="opp-desc"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the opportunity, eligibility, deadlines, and how to apply..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
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
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Opportunities;

