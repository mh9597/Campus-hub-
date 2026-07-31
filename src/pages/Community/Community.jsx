import { Link } from 'react-router-dom';

function Community() {
  const benefits = [
    {
      title: 'Request Missing Resources',
      icon: 'library_add',
      description: 'Ask for specific notes, PYQs, or practical files, and our community admins/peers will help upload them.',
    },
    {
      title: 'Exclusive Free Courses',
      icon: 'school',
      description: 'Get notified about free certifications, expert webinars, and academic courses available to members.',
    },
    {
      title: 'Student Resource Sharing',
      icon: 'handshake',
      description: 'Share your own class notes and study materials to earn contributor badges and help your peers.',
    },
    {
      title: 'Instant Notifications',
      icon: 'rocket_launch',
      description: 'Be the first to receive updates on exam timetables, syllabus changes, and semester bulletin board updates.',
    },
    {
      title: 'Ask Seniors & Mentors',
      icon: 'psychology',
      description: 'Connect with top-performing seniors and industry mentors for viva advice, project guidance, and placement tips.',
    },
    {
      title: 'Community Exclusive Content',
      icon: 'campaign',
      description: 'Access curated question banks, specialized lab guides, and placement preparation materials.',
    },
  ];

  const guidelines = [
    'Be Respectful',
    'No Spam',
    'Share Verified Resources',
    'Help Other Students',
  ];

  return (
    <div className="bg-[#FFF8EC] text-[#1E293B] font-body-md min-h-screen pb-12">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-secondary font-label-lg text-label-lg">
          <Link className="hover:text-primary opacity-60" to="/">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Community</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg text-navy-accent font-bold text-4xl mb-4">
            Student Community
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
            Stay connected with fellow students through our official communication channels. Join thousands of learners sharing resources, opportunities, and support.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-gutter">
          {/* Main Content Area (75%) */}
          <div className="md:w-3/4 space-y-8">
            <section className="mb-12">
              <div className="mb-10">
                <h2 className="font-headline-lg text-headline-lg text-navy-accent font-bold text-2xl mb-4">
                  ✨ Exclusive Community Benefits
                </h2>
                <p className="font-body-md text-body-md text-secondary max-w-2xl leading-relaxed">
                  Access exclusive resources, request missing materials, connect with seniors, and receive instant updates that are not available on the website.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="premium-card bg-white p-6 rounded-xl shadow-sm border border-orange-100/50 flex flex-col gap-3 h-full premium-card-hover">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2 flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[32px]">
                        {benefit.icon}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[20px] text-navy-accent font-bold text-md">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* WhatsApp Community Section */}
            <section className="premium-card bg-white border border-orange-100/50 rounded-2xl p-10 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-8 hidden sm:block">
                <span className="bg-[#E7F3EF] text-[#059669] px-4 py-1 rounded-full font-label-lg text-label-lg font-semibold text-xs">
                  Status: Active
                </span>
              </div>
              <div className="flex items-start gap-6 mb-8">
                <div className="bg-[#25D366]/10 p-4 rounded-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-[48px] text-[#25D366]">chat</span>
                </div>
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-navy-accent font-bold text-2xl mb-2">
                    Official WhatsApp Community
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                    Get instant access to department announcements, class links, and resource alerts directly on your phone.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 mb-10 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Exclusive Study Notes &amp; Guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Previous Year Question Papers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Real-time Internship Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Peer Support Groups</span>
                </div>
              </div>
              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-navy-accent text-white px-8 py-4 rounded-xl font-button text-button inline-flex items-center gap-2 hover:bg-primary transition-colors group font-semibold shadow-md"
              >
                Join WhatsApp Community
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </a>
            </section>

            {/* Telegram Channel Section */}
            <section className="premium-card bg-white border border-orange-100/50 rounded-2xl p-10 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-8 hidden sm:block">
                <span className="bg-[#E7F3EF] text-[#059669] px-4 py-1 rounded-full font-label-lg text-label-lg font-semibold text-xs">
                  Status: Active
                </span>
              </div>
              <div className="flex items-start gap-6 mb-8">
                <div className="bg-[#0088CC]/10 p-4 rounded-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-[48px] text-[#0088CC]">send</span>
                </div>
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-navy-accent font-bold text-2xl mb-2">
                    Official Telegram Channel
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                    Subscribe to our main broadcast channel for full resource packages, PDF archives, and scholarship details.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 mb-10 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Daily Resource Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Placement &amp; Career News</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Seminar &amp; Event Alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-sm">Downloadable PDF Archives</span>
                </div>
              </div>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary text-white px-8 py-4 rounded-xl font-button text-button inline-flex items-center gap-2 hover:opacity-90 transition-all group font-semibold shadow-md"
              >
                Join Telegram Channel
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </a>
            </section>

            {/* Bottom CTA Banner */}
            <section className="bg-navy-accent rounded-2xl p-12 text-center text-white mt-8 shadow-lg space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-2xl">
                Stay Connected With Our Student Community
              </h2>
              <p className="text-surface-variant mb-10 max-w-xl mx-auto opacity-90 leading-relaxed text-sm">
                Don't miss out on important updates, study materials, and career opportunities shared daily across our official platforms.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="bg-white text-navy-accent px-8 py-3 rounded-lg font-button text-button hover:bg-surface-variant transition-colors font-semibold shadow-md inline-block">
                  Join WhatsApp
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-8 py-3 rounded-lg font-button text-button hover:bg-white hover:text-navy-accent transition-all font-semibold inline-block">
                  Join Telegram
                </a>
              </div>
            </section>
          </div>

          {/* Sticky Right Sidebar (25%) */}
          <aside className="md:w-1/4">
            <div className="sticky-sidebar space-y-6">
              {/* Guidelines Widget */}
              <div className="premium-card rounded-[20px] bg-white p-6 border border-orange-100/50 shadow-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-lg mb-6 border-b border-gray-100 pb-3">
                  Community Guidelines
                </h3>
                <ul className="space-y-4">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#059669] text-[20px]">
                        task_alt
                      </span>
                      <span className="font-body-md text-sm font-medium">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help Widget */}
              <div className="bg-primary text-on-primary rounded-[20px] text-center p-6 shadow-md space-y-4">
                <span className="material-symbols-outlined text-[48px] block">help_outline</span>
                <h3 className="font-headline-md font-bold text-md leading-tight">Need Help Joining?</h3>
                <p className="text-on-primary/80 text-xs leading-relaxed">
                  Our community admins are here to assist you with any invite link or access issues.
                </p>
                <button className="w-full bg-white text-primary py-3 rounded-xl font-button text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm">
                  Contact Admin
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Community;
