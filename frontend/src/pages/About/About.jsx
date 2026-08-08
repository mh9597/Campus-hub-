import { Link } from 'react-router-dom';

function About() {
  const stats = [
    { label: 'Study Notes & PYQs', value: '1,200+', icon: 'library_books' },
    { label: 'Engineering Students', value: '5,000+', icon: 'school' },
    { label: 'Semesters Covered', value: 'Sem 1 - 8', icon: 'auto_stories' },
    { label: 'Open Source', value: '100%', icon: 'code' },
  ];

  const platformExcellence = [
    {
      title: 'Academic Resources',
      icon: 'menu_book',
      description: 'Curated lecture notes, GTU study guides, PYQ solution keys, and practical lab manuals.',
    },
    {
      title: 'Career & Opportunities',
      icon: 'work',
      description: 'Direct access to tech internships, hackathons, open-source programs, and career updates.',
    },
    {
      title: 'Peer Support Network',
      icon: 'groups',
      description: 'Active WhatsApp and Telegram student groups for instant doubt solving and guidance.',
    },
    {
      title: 'Open Source & Free',
      icon: 'code',
      description: 'A platform built by students, for students. Completely free, open-source, and transparent.',
    },
    {
      title: 'Smart Categorization',
      icon: 'search_insights',
      description: 'Find subject notes in seconds organized by Department, Semester, and GTU Subject Code.',
    },
    {
      title: 'Regular Content Updates',
      icon: 'update',
      description: 'Fresh notes, syllabus updates, and lab guides added regularly by top student contributors.',
    },
  ];

  const contributors = [
    {
      name: 'Manan Gohil',
      role: 'Project Lead',
      badge: 'Lead',
      badgeClass: 'bg-black text-amber-400 border border-amber-400 font-black',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_X_o4f0hXOLkW8GFyS_99Wd-27mxjyc4Mkqby9idLKqmK1_lmpRdWzy0oMZtO2kdV_3hQWsDO1lSHgZfM6y_0hO-EQJg8_Zgrczv4PkA8nJ_mFucfDNLZA19T-LSFdQJUHiTa0R8MSXuTSup7os3xdEGi3xqa3JO_FyDLBp9vckatx7iWaX02Rypurh_nynVhFTeyxY9DewWS_AtZEZwruBWEPMD6juzu5DOYkE4wavx3DYkuQmTnogBcILFWkp9HvOSgxU4xiM',
      university: 'Indus University · CE',
      bulletPoints: ['Architecture Design', 'Roadmap Planning', 'Resource Curation'],
    },
    {
      name: 'Krish Patel',
      role: 'Frontend Developer',
      badge: 'Frontend',
      badgeClass: 'bg-[#FEF3D6] text-black border border-amber-400 font-extrabold',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1oB7febShFcsKAnTYIXP_T0HYgEoD69brUFelyDnZjsAdajt4siCu1jqwgLsw9GTm5oVFWAWBXo4fF95FNhqwi7KPEsgCJVBzkx5utFdtCLDiqPltlJqXj9usXg2kDugbXNq75b4kMzD7oFJ2m2fzt2InwOfhvR7Nj_FDuyHV4yn1rUM7EjkxOgkor9RENdnAndgr3RH4o5zoBjjORBEJVy9iv58p41NlDfre-xmMyF_yUUgv3sAEGRCBFmfOxMuw3ndVT8hnol4',
      university: 'Indus University · CE',
      bulletPoints: ['React Integration', 'Dashboard UX', 'Responsive Layouts'],
    },
    {
      name: 'Akshat Khatri',
      role: 'Backend Developer',
      badge: 'Backend',
      badgeClass: 'bg-[#FEF3D6] text-black border border-amber-400 font-extrabold',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJdoXoH2mO-SWtcIlNOq823u1YxeVXZMm73gR2eOImOqtEXniRhHocHVFFxrYKwywX47IBxLwgXDu-hbFVFUNYOPwM0K1L1rRkFcHzGbU7u1ffzRvdFiILM1vLQc0PIks5BAkKyXvdIXswr1L9j1vNbC4EaRIA70MEsF8h1VmssFhYCwhVZVTqgPG2Wjoe5EiwKFmlvnv88ZWa3KyFoN_zhh_sG8ilafIApaaWccTv-3WU5NOzAyIE7O-ms6i_-w8FKWdLY1H2HY',
      university: 'Indus University · CE',
      bulletPoints: ['API Proxy Architecture', 'Database Sync', 'Auth Security'],
    },
    {
      name: 'Manthan Prajapati',
      role: 'UI & Testing',
      badge: 'UI & QA',
      badgeClass: 'bg-[#FEF3D6] text-black border border-amber-400 font-extrabold',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZFdmp7jD-2xVxlNZuWTtGVRObUG4El_gOLLjYcxAgE3wRs7AX9Ckm9brOPRuravtS9xL-_6O58LiqyHBmzf-ZIHVNih59hKRTOSjd8afrerRZXH_Y-UDc6KCQ_kggJ00u5jbmlxzVc6x3DrjDNXkVfxQJf5fK8z0cHHCJkKy9WozpuZoVfjD8x5g_X0_IQVUZ_ppUcB45LQCgdYmKowJzm6c4jVgqnvoLmlzgmwzKDV-xCc4CUX7npVcqGvxyGk_CUUX2HBD7AgA',
      university: 'Indus University · CE',
      bulletPoints: ['Visual Design System', 'Quality Assurance', 'Beta Testing'],
    },
  ];

  return (
    <div className="pt-20 bg-[#FFF8EC] text-black font-body-md min-h-screen pb-16">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-secondary font-label-lg text-label-lg">
          <Link className="hover:text-amber-600 transition-colors opacity-70 font-medium" to="/">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-black font-extrabold">About</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-black via-[#0F172A] to-amber-950/40 text-white rounded-[32px] p-8 md:p-12 mb-12 border-2 border-amber-400 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none text-amber-400 hidden lg:block">
            <span className="material-symbols-outlined text-9xl">school</span>
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] text-black text-xs font-black uppercase tracking-wider border border-amber-400 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Built by Students for Students</span>
            </div>
            
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg font-black text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
              About Student Resource Hub
            </h1>
            
            <p className="font-body-lg text-gray-300 text-base sm:text-lg leading-relaxed font-medium">
              A centralized academic ecosystem designed to empower Computer Engineering students with elite study tools, verified notes, exam preparation, and career insights.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-white/15">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 border border-amber-400/30 rounded-2xl p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-0.5">
                    <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                    <span className="font-black text-xl text-white">{stat.value}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <section className="mb-14">
          <div className="bg-white p-8 md:p-12 rounded-[28px] border-2 border-amber-300/80 hover:border-black transition-all shadow-md flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#FEF3D6] border-2 border-amber-400 text-black flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-black text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                target
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Our Purpose
                </span>
              </div>
              <h2 className="font-headline-lg text-black font-black text-2xl md:text-3xl">
                Democratizing Academic Excellence
              </h2>
              <p className="font-body-lg text-gray-600 leading-relaxed text-sm sm:text-base font-medium">
                We believe academic success should never be hindered by fragmented notes or hard-to-find question papers. Our mission is to simplify the engineering lifecycle by providing a single, reliable hub where verified handwritten notes, solved GTU PYQs, and career opportunities are accessible to all students 100% free.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Excellence Section */}
        <section className="mb-16">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-headline-lg text-black font-black text-3xl">Platform Features &amp; Values</h2>
            <div className="w-16 h-1.5 bg-amber-400 mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-medium">
              Everything built into Student Resource Hub is tailored specifically for academic convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformExcellence.map((item, index) => (
              <div
                key={index}
                className="outlined-card bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-300/80 hover:border-black shadow-sm transition-all duration-300 active-press group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3D6] border border-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-400 transition-colors shadow-2xs">
                    <span className="material-symbols-outlined text-black text-2xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-black font-extrabold text-xl mb-2 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Contributors Section */}
        <section className="mb-16">
          <div className="text-center mb-12 space-y-2">
            <span className="bg-black text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-400 shadow-2xs inline-block mb-2">
              Engineering Student Leads
            </span>
            <h2 className="font-headline-lg text-black font-black text-3xl sm:text-4xl">Project Contributors</h2>
            <p className="font-body-lg text-gray-600 max-w-xl mx-auto text-xs sm:text-sm font-medium">
              Designed, built, and curated by Computer Engineering students at Indus University.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((contrib, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-[28px] border-2 border-amber-300/80 hover:border-black shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group active-press"
              >
                <div className="relative mb-5">
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-amber-400 shadow-sm bg-[#FEF3D6]">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                      <img 
                        className="w-full h-full object-cover" 
                        src={contrib.avatar} 
                        alt={contrib.name} 
                      />
                    </div>
                  </div>
                  {contrib.badge && (
                    <span className={`absolute -top-2 -right-2 text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${contrib.badgeClass}`}>
                      {contrib.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="font-black text-black text-lg mb-1 group-hover:text-amber-600 transition-colors">
                  {contrib.name}
                </h3>
                <p className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 mb-3">
                  {contrib.role}
                </p>
                <div className="flex items-center gap-1.5 mb-5 text-gray-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">school</span>
                  <span>{contrib.university}</span>
                </div>
                
                <ul className="text-xs text-gray-600 text-left w-full space-y-2 mb-6 flex-grow border-t border-amber-200 pt-4 font-medium">
                  {contrib.bulletPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[14px] font-bold shrink-0 mt-0.5">check_circle</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-2 w-full justify-center pt-3 border-t border-amber-100">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FEF3D6] border border-amber-400 flex items-center justify-center text-black hover:bg-black hover:text-amber-400 transition-colors shadow-2xs"
                    aria-label={`${contrib.name}'s GitHub`}
                  >
                    <span className="material-symbols-outlined text-[18px]">code</span>
                  </a>
                  <a
                    href="mailto:hello@studenthub.com"
                    className="w-9 h-9 rounded-full bg-[#FEF3D6] border border-amber-400 flex items-center justify-center text-black hover:bg-black hover:text-amber-400 transition-colors shadow-2xs"
                    aria-label={`Email ${contrib.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-black text-white rounded-[32px] p-10 sm:p-14 text-center border-2 border-amber-400 shadow-2xl space-y-6">
          <h2 className="font-display-lg text-white font-black text-2xl sm:text-3xl">
            Want to Contribute Your Study Notes?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto leading-relaxed text-sm font-medium">
            Join our contributor network! Share your handwritten notes, PYQ solutions, or lab manuals to help engineering peers across all semesters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="btn-yellow-black px-8 py-3.5 rounded-full font-extrabold text-sm inline-block cursor-pointer active-press"
            >
              Submit Resource
            </Link>
            <Link
              to="/community"
              className="btn-black-yellow px-8 py-3.5 rounded-full font-extrabold text-sm inline-block cursor-pointer active-press"
            >
              Join Community Group
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

export default About;
