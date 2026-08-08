import { Link } from 'react-router-dom';

function Community() {
  const stats = [
    { label: 'Active Members', value: '5,000+', icon: 'groups' },
    { label: 'Study Resources Shared', value: '1,200+', icon: 'folder_shared' },
    { label: 'Peer Support', value: '24/7', icon: 'support_agent' },
    { label: 'Free Certifications', value: '100%', icon: 'workspace_premium' },
  ];

  const benefits = [
    {
      title: 'Request Missing Resources',
      icon: 'description',
      description: 'Request missing materials and request reviews.',
    },
    {
      title: 'Exclusive Free Courses',
      icon: 'school',
      description: 'Gain access to exclusive free courses.',
    },
    {
      title: 'Student Resource Sharing',
      icon: 'share',
      description: 'Share and access amazing resources.',
    },
    {
      title: 'Instant Exam Alerts',
      icon: 'notifications_active',
      description: 'Instant exam news and important alerts.',
    },
    {
      title: 'Ask Seniors & Mentors',
      icon: 'group',
      description: 'Recommendations from seniors & mentors.',
    },
    {
      title: 'Curated Question Banks',
      icon: 'auto_stories',
      description: 'Curated question banks & solution guides.',
    },
  ];

  const guidelines = [
    { title: 'Be Respectful', desc: 'Maintain academic decorum and respect all peers.' },
    { title: 'No Spam or Ads', desc: 'Strictly no promotional links, referral codes, or spam.' },
    { title: 'Verified Content Only', desc: 'Share genuine notes, accurate timetables, and verified papers.' },
    { title: 'Help Peers Grow', desc: 'Answer questions, clarify doubts, and support fellow students.' },
  ];

  const whatsappFeatures = [
    'Request Missing Resources',
    'Exclusive Free Courses',
    'Student Resource Sharing',
    'Instant Exam Alerts',
  ];

  const telegramFeatures = [
    'Free Info Channel',
    'Official Telegram Channel',
    'Ask Seniors & Mentors',
    'Curated Question Banks',
  ];

  return (
    <div
      className="pt-20 min-h-screen text-[#0F172A] font-body-md pb-16 relative bg-no-repeat bg-top"
      style={{
        backgroundImage: `url('/images/community-bg-new.svg')`,
        backgroundSize: '100% auto',
        backgroundColor: '#ffffff',
      }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-10">
        {/* HERO HEADER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8 relative z-10">
          
          {/* Left Dark Navy Card */}
          <div className="lg:col-span-7 bg-[#0B132B] text-white rounded-[28px] p-8 sm:p-10 lg:p-12 border-2 border-[#FACC15]/80 shadow-2xl relative overflow-hidden flex flex-col justify-center">
            {/* Subtle Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FACC15]/15 blur-3xl pointer-events-none floating-icon" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none floating-icon" style={{ animationDelay: '-6s' }} />

            <div className="relative z-10 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Learn, Connect &amp; <br />
                <span className="text-[#FACC15]">Excel</span> Together.
              </h1>

              <p className="text-gray-300 text-base sm:text-lg font-medium max-w-xl leading-relaxed">
                Join a modern, high-end redesign using the CampusHub Community page.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FACC15] hover:bg-amber-400 text-[#0F172A] border-2 border-[#0F172A] font-extrabold px-6 py-3.5 rounded-xl inline-flex items-center gap-2.5 shadow-lg transition-all duration-200 active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-current text-[#0F172A]" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Join WhatsApp</span>
                </a>

                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B132B] hover:bg-[#152244] text-[#FACC15] border-2 border-[#FACC15] font-extrabold px-6 py-3.5 rounded-xl inline-flex items-center gap-2.5 shadow-md transition-all duration-200 active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-current text-[#FACC15]" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.197 1.005.128.832.941z"/>
                  </svg>
                  <span>Join Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Live Community Pulse Widget */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white/95 backdrop-blur-md text-[#0F172A] rounded-[28px] p-6 lg:p-8 shadow-xl space-y-5 border border-gray-100 flex-grow">
              <div className="pb-2">
                <h3 className="font-extrabold text-base lg:text-lg text-[#0F172A] tracking-tight">
                  Live Community Pulse
                </h3>
              </div>

              <div className="space-y-4">
                {/* WhatsApp Study Group */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-extrabold text-[#0F172A] text-xs">WhatsApp Study Group</p>
                      <p className="text-[11px] text-gray-500 font-medium">Active</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>

                {/* CSE/CA Unit-3 Notes PDF */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-black text-xs">
                      PDF
                    </div>
                    <div>
                      <p className="font-extrabold text-[#0F172A] text-xs">CSE/CA Unit-3 Notes PDF</p>
                      <p className="text-[11px] text-gray-500 font-medium">Shared 15 mins ago</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>

                {/* Join GTU Students */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-[#FACC15] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">shield</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-[#0F172A] text-xs">Join GTU Students</p>
                      <p className="text-[11px] text-gray-500 font-medium">Shared 18 mins ago</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/95 backdrop-blur-sm border border-amber-300/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0F172A] transition-all duration-300 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF3D6] border border-amber-400 text-[#0F172A] flex items-center justify-center shrink-0 group-hover:bg-[#FACC15] transition-colors">
                <span className="material-symbols-outlined text-2xl font-bold">{stat.icon}</span>
              </div>
              <div>
                <p className="font-black text-2xl text-[#0F172A] leading-tight">{stat.value}</p>
                <p className="text-xs text-gray-600 font-semibold mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* EXCLUSIVE COMMUNITY BENEFITS & RULES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Benefits */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Exclusive Community Benefits
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Optimize your potential on the CampusHub Community.
              </p>
            </div>

            {/* 6 Cards Grid (3 cols x 2 rows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-300 space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] border border-amber-400 text-[#0F172A] flex items-center justify-center group-hover:bg-[#FACC15] transition-colors">
                    <span className="material-symbols-outlined text-xl font-bold">{benefit.icon}</span>
                  </div>
                  <h3 className="font-extrabold text-[#0F172A] text-sm group-hover:text-amber-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Community Rules Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#FAF8F5]/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-xs h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] mb-5 pb-3 border-b border-gray-200">
                  Community Rules
                </h3>
                <ul className="space-y-4">
                  {guidelines.map((g, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0F172A] text-[#FACC15] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#0F172A]">{g.title}</p>
                        <p className="text-xs text-gray-500 font-medium leading-snug mt-0.5">{g.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <Link
                  to="/contact"
                  className="text-xs font-black text-[#0F172A] hover:text-amber-600 underline inline-flex items-center gap-1"
                >
                  <span>Need Help? Contact Admin Support</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DUAL PLATFORMS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Official WhatsApp Community Card */}
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-[#0F172A] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-[#0F172A]">
                Official WhatsApp Community
              </h3>

              <ul className="space-y-3.5">
                {whatsappFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-[#0F172A] font-semibold">
                    <span className="material-symbols-outlined text-amber-500 text-lg">chat_bubble</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FACC15] hover:bg-amber-400 text-[#0F172A] border-2 border-[#0F172A] font-extrabold py-3.5 rounded-xl block text-center shadow-md transition-all duration-200 active:scale-98"
              >
                Join WhatsApp Community
              </a>
            </div>
          </div>

          {/* Official Telegram Channel Card */}
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-[#0F172A] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-[#0F172A]">
                Official Telegram Channel
              </h3>

              <ul className="space-y-3.5">
                {telegramFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-[#0F172A] font-semibold">
                    <span className="material-symbols-outlined text-sky-500 text-lg">send</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FACC15] hover:bg-amber-400 text-[#0F172A] border-2 border-[#0F172A] font-extrabold py-3.5 rounded-xl block text-center shadow-md transition-all duration-200 active:scale-98"
              >
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>


      </main>
    </div>
  );
}

export default Community;


