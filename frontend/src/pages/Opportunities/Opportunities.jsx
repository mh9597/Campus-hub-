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

  return (
    <div className="pt-20 bg-[#fffcf0] text-on-surface font-body-md min-h-screen pb-12 bulletin-board-bg">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8 items-center gap-2 text-on-surface-variant font-body-md text-sm">
          <Link className="hover:text-black opacity-60 transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-black font-bold">Opportunities</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Main Content Area (75%) */}
          <div className="w-full lg:w-3/4">
            <div className="mb-12 space-y-6">
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold text-4xl leading-tight">
                Explore Opportunities
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Discover internships, hackathons, workshops, scholarships, coding competitions, webinars, certifications and career opportunities.
              </p>

              {/* Search & Filter */}
              <div className="mt-8 space-y-6">
                <div className="relative max-w-xl">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold">
                    search
                  </span>
                  <input
                    type="text"
                    id="opportunity-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-amber-400/90 bg-white shadow-sm focus:ring-4 focus:ring-amber-400/25 focus:border-black outline-none transition-all font-semibold text-black"
                    placeholder="Search opportunities..."
                    aria-label="Search opportunities"
                  />
                </div>
                <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter opportunities">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      aria-pressed={activeFilter === filter}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm active-press cursor-pointer ${
                        activeFilter === filter
                          ? 'bg-black text-amber-400 border-2 border-amber-400 shadow-md'
                          : 'bg-white border-2 border-amber-300/80 text-black hover:border-black hover:bg-amber-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error state */}
            {oppError && !oppLoading && (
              <ErrorState message={oppError} onRetry={refetchOpp} className="mb-8" />
            )}

            {/* Opportunities Bento Grid */}
            <div className="relative">
              <div className="absolute -top-4 left-0 w-full h-1 marching-ants opacity-20"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Loading skeletons */}
                {oppLoading && Array.from({ length: 6 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))}

                {/* Loaded opportunities */}
                {!oppLoading && !oppError && filteredOpportunities.map((opp) => {
                  const badgeClasses = {
                    primary: 'bg-[#FEF3D6] text-black border-2 border-amber-400 font-bold',
                    tertiary: 'bg-amber-100 text-amber-900 border-2 border-amber-500 font-bold',
                    error: 'bg-red-100 text-red-800 border-2 border-red-400 font-bold',
                  };
                  const badgeClass = badgeClasses[opp.tagType] || badgeClasses.primary;

                  return (
                    <div
                      key={opp.id}
                      className="outlined-card p-8 rounded-2xl hover:rotate-0 transition-all duration-300 relative group"
                      style={{
                        '--rotate': opp.rotate,
                        transform: `rotate(${opp.rotate})`,
                      }}
                    >
                      {/* Push Pin */}
                      <div
                        className="push-pin"
                        style={{
                          background: opp.pinBg,
                          transform: 'translateX(-50%)',
                        }}
                      ></div>

                      <div className="flex items-start justify-between mb-6">
                        <span className="text-4xl">{opp.emoji}</span>
                        {opp.tag && (
                          <span className={`px-3 py-1 rounded-lg text-xs tracking-wider shadow-2xs ${badgeClass}`}>
                            {opp.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline-md text-headline-md mb-4 text-black font-extrabold text-xl leading-snug">
                        {opp.title}
                      </h3>
                      <p className="font-body-md text-body-md text-gray-600 mb-6 leading-relaxed font-medium">
                        {opp.description}
                      </p>
                      <Link to="/resources" className="inline-flex items-center gap-2 text-black hover:text-amber-600 font-extrabold text-sm group/link">
                        <span>Explore</span>
                        <span className="group-hover/link:translate-x-1.5 transition-transform font-bold">&rarr;</span>
                      </Link>
                    </div>
                  );
                })}

                {/* Empty state */}
                {!oppLoading && !oppError && filteredOpportunities.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500 space-y-2">
                    <span className="material-symbols-outlined text-5xl text-amber-400 block">search_off</span>
                    <p className="font-bold text-black">No opportunities match your search.</p>
                    <p className="text-sm">Try a different search term or filter.</p>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-8 left-0 w-full h-1 marching-ants opacity-20"></div>
            </div>
          </div>

          {/* Sticky Sidebar (25%) */}
          <div className="w-full lg:w-1/4">
            <div className="sidebar-sticky space-y-6">
              {/* Announcements Widget */}
              <div className="bg-white p-6 rounded-[24px] shadow-md border-2 border-amber-300/70 hover:border-black transition-all">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    campaign
                  </span>
                  <h2 className="font-headline-md text-headline-md text-black font-extrabold text-lg">
                    Latest Announcements
                  </h2>
                </div>
                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {/* Loading skeletons */}
                  {annLoading && Array.from({ length: 4 }).map((_, i) => (
                    <AnnouncementSkeleton key={i} />
                  ))}

                  {/* Loaded announcements */}
                  {!annLoading && !annError && announcements.map((ann) => (
                    <div key={ann.id} className="group cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className={`w-3 h-3 rounded-full ${ann.color} mt-1.5 shrink-0`}></span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-body-md text-black leading-snug group-hover:text-amber-600 transition-colors text-sm font-semibold">
                              {ann.text}
                            </p>
                            {ann.badge && (
                              <span className="bg-black text-amber-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase border border-amber-400">
                                {ann.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 flex justify-between">
                            <span>{formatRelativeTime(ann.created_at)}</span>
                            {ann.deadline && <span className="text-red-600 font-bold">Deadline: {ann.deadline}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Announcement error */}
                  {annError && !annLoading && (
                    <p className="text-xs text-red-500 text-center font-semibold">Could not load announcements.</p>
                  )}
                </div>
                <Link to="/resources" className="block text-center text-black font-extrabold border-t border-amber-200/80 pt-4 hover:translate-x-1 transition-transform text-sm">
                  View All Announcements &rarr;
                </Link>
              </div>

              {/* Academic Calendar Widget */}
              <AcademicCalendar />
            </div>
          </div>
        </div>
      </main>

      {/* CTA Bottom Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter mb-section-gap-md">
        <div className="bg-white rounded-[32px] p-10 md:p-14 text-center border-2 border-black shadow-lg max-w-7xl mx-auto space-y-6">
          <h2 className="font-display-lg-mobile md:font-headline-lg text-black font-black text-2xl sm:text-3xl">Can't find the right opportunity?</h2>
          <p className="font-body-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed font-medium">
            Help us grow the community by requesting a specific resource or submitting one you've found.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-black-yellow px-8 py-3.5 rounded-full font-extrabold shadow-lg inline-block text-center cursor-pointer active-press text-sm"
            >
              Submit Opportunity
            </button>
            <Link
              to="/contact"
              className="btn-yellow-black px-8 py-3.5 rounded-full font-extrabold shadow-md cursor-pointer text-center inline-block active-press text-sm"
            >
              Request a Resource
            </Link>
          </div>
        </div>
      </section>

      {/* Submit Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-outline-variant bg-white shadow-2xl relative animate-scale-up">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="font-bold text-2xl text-black mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">publish</span>
              Submit an Opportunity
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed font-medium">
              Share internships, hackathons, scholarships, or other opportunities with the student community. Submissions will go live after admin moderation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="opp-title" className="block font-bold text-sm mb-1.5 text-black">
                  Opportunity Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="opp-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Google STEP Internship 2026"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col justify-between h-full">
                  <label htmlFor="opp-category" className="block font-bold text-sm mb-1.5 text-black">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-auto">
                    <select
                      id="opp-category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black appearance-none cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      {FILTERS.filter(f => f !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submitter Email */}
                <div className="flex flex-col justify-between h-full">
                  <label htmlFor="opp-email" className="block font-bold text-sm mb-1.5 text-black">
                    Your Email <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(must be @gmail.com)</span>
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
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black mt-auto"
                    disabled={submitStatus === 'loading'}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="opp-desc" className="block font-bold text-sm mb-1.5 text-black">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="opp-desc"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the opportunity, eligibility, deadlines, and how to apply..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black resize-none"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-300 hover:border-black transition-colors cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-black-yellow px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-md flex items-center gap-2 cursor-pointer active-press"
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
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
