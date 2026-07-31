import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities, useAnnouncements } from '../../hooks/useOpportunities';
import { OpportunityCardSkeleton, AnnouncementSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatRelativeTime } from '../../services/opportunities/opportunitiesApi';
import { useOpportunitySubmit } from '../../hooks/useResourceRequest';
import { ToastContainer, useToast } from '../../components/ui/Toast';

const FILTERS = ['All', 'Internships', 'Hackathons', 'Scholarships', 'Coding', 'Workshops', 'Remote', 'Online'];

const CLOSING_THIS_WEEK = [
  { id: 1, name: 'MLH Fellowship', daysLeft: '2 days left' },
  { id: 2, name: 'Google STEP Internship', daysLeft: '4 days left' },
  { id: 3, name: 'Hacktoberfest 2026', daysLeft: '6 days left' },
];

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
    <div className="bg-[#fffcf0] text-on-surface font-body-md min-h-screen pb-12 bulletin-board-bg">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8 items-center gap-2 text-on-surface-variant font-body-md text-sm">
          <Link className="hover:text-primary opacity-60" to="/">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Opportunities</span>
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
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    id="opportunity-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md"
                    placeholder="Search opportunities..."
                    aria-label="Search opportunities"
                  />
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter opportunities">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      aria-pressed={activeFilter === filter}
                      className={`px-4 py-1.5 rounded-full text-sm font-button transition-all shadow-sm ${
                        activeFilter === filter
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
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
                    primary: 'bg-primary-container/10 text-primary',
                    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
                    error: 'bg-error-container text-on-error-container',
                  };
                  const badgeClass = badgeClasses[opp.tagType] || badgeClasses.primary;

                  return (
                    <div
                      key={opp.id}
                      className="paper-card p-8 rounded-xl border border-outline-variant hover:rotate-0 transition-transform duration-300"
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
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                            {opp.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline-md text-headline-md mb-4 text-on-surface font-bold text-lg">
                        {opp.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                        {opp.description}
                      </p>
                      <Link to="/resources" className="flex items-center gap-2 text-primary font-button group font-semibold">
                        Explore <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  );
                })}

                {/* Empty state */}
                {!oppLoading && !oppError && filteredOpportunities.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500 space-y-2">
                    <span className="material-symbols-outlined text-5xl text-gray-300 block">search_off</span>
                    <p className="font-semibold">No opportunities match your search.</p>
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
              <div className="bg-white p-6 rounded-[20px] shadow-[0_40px_80px_rgba(30,41,59,0.08)] border border-surface-container">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    campaign
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">
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
                            <p className="font-body-md text-on-surface leading-snug group-hover:text-primary transition-colors text-sm font-medium">
                              {ann.text}
                            </p>
                            {ann.badge && (
                              <span className="bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                {ann.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant flex justify-between">
                            <span>{formatRelativeTime(ann.created_at)}</span>
                            {ann.deadline && <span className="text-error font-semibold">Deadline: {ann.deadline}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Announcement error */}
                  {annError && !annLoading && (
                    <p className="text-xs text-red-500 text-center">Could not load announcements.</p>
                  )}
                </div>
                <Link to="/resources" className="block text-center text-primary font-button border-t border-outline-variant/10 pt-4 hover:translate-x-1 transition-transform text-sm font-semibold">
                  View All Announcements &rarr;
                </Link>
              </div>

              {/* Closing This Week Widget */}
              <div className="bg-white p-6 rounded-[20px] shadow-[0_40px_80px_rgba(30,41,59,0.08)] border border-surface-container">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-md mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-xl">alarm</span> Closing This Week
                </h3>
                <div className="space-y-4">
                  {CLOSING_THIS_WEEK.map((item) => (
                    <div key={item.id} className="pb-3 border-b border-outline-variant/10 last:border-b-0 last:pb-0">
                      <p className="font-body-md text-on-surface font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-error font-medium">{item.daysLeft}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Opportunity Widget */}
              <div className="bg-primary text-on-primary p-6 rounded-[20px] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <span className="material-symbols-outlined text-6xl">star</span>
                </div>
                <h3 className="font-label-lg text-label-lg uppercase tracking-widest mb-2 opacity-80 text-xs font-semibold">
                  Featured Opportunity
                </h3>
                <h4 className="font-headline-md text-headline-md mb-1 font-bold text-lg">
                  Summer Research Intern
                </h4>
                <p className="font-body-md mb-4 opacity-90 text-sm">Stanford University &bull; Remote</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold">Deadline: Nov 15</span>
                  <button className="bg-white text-primary px-5 py-1.5 rounded-full font-button text-xs hover:bg-surface-container-low transition-colors font-semibold shadow-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Bottom Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter mb-section-gap-md">
        <div className="bg-surface-container-high rounded-[32px] p-12 text-center border border-primary/10 shadow-sm max-w-7xl mx-auto space-y-6">
          <h2 className="font-display-lg-mobile md:font-headline-lg text-on-surface font-bold text-2xl">Can't find the right opportunity?</h2>
          <p className="font-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto leading-relaxed">
            Help us grow the community by requesting a specific resource or submitting one you've found.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-button hover:scale-105 transition-transform shadow-lg font-semibold inline-block text-center cursor-pointer"
            >
              Submit Opportunity
            </button>
            <Link
              to="/contact"
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-button hover:scale-105 transition-transform font-semibold cursor-pointer text-center inline-block"
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

            <h3 className="font-bold text-2xl text-navy-accent mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">publish</span>
              Submit an Opportunity
            </h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Share internships, hackathons, scholarships, or other opportunities with the student community. Submissions will go live after admin moderation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="opp-title" className="block font-semibold text-sm mb-1.5 text-on-surface">
                  Opportunity Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="opp-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Google STEP Internship 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-body-md"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label htmlFor="opp-category" className="block font-semibold text-sm mb-1.5 text-on-surface">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="opp-category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-body-md appearance-none cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      {FILTERS.filter(f => f !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Submitter Email */}
                <div>
                  <label htmlFor="opp-email" className="block font-semibold text-sm mb-1.5 text-on-surface">
                    Your Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="opp-email"
                    type="email"
                    value={formData.submitterEmail}
                    onChange={(e) => handleChange('submitterEmail', e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-body-md"
                    disabled={submitStatus === 'loading'}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="opp-desc" className="block font-semibold text-sm mb-1.5 text-on-surface">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="opp-desc"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the opportunity, eligibility, deadlines, and how to apply..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-body-md resize-none"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-button font-semibold border border-outline hover:bg-gray-50 transition-colors cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-button font-semibold bg-primary text-on-primary hover:bg-primary/95 transition-all shadow flex items-center gap-2 cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
