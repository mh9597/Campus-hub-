import { Link } from 'react-router-dom';

function About() {
  const platformExcellence = [
    {
      title: 'Academic Resources',
      icon: 'menu_book',
      description: 'Curated lecture notes, study guides, and past examination papers tailored for university curricula.',
    },
    {
      title: 'Career Opportunities',
      icon: 'work',
      description: 'Direct access to internships, job postings, and career mentorship from industry professionals.',
    },
    {
      title: 'Community Support',
      icon: 'groups',
      description: 'Peer-to-peer learning networks and discussion forums for every subject area.',
    },
    {
      title: 'Open Source',
      icon: 'code',
      description: 'A platform built by students, for students. Completely open-source and community-driven.',
    },
    {
      title: 'Smart Search',
      icon: 'search_insights',
      description: 'Find exactly what you need in seconds with our advanced categorization and search algorithms.',
    },
    {
      title: 'Regular Updates',
      icon: 'update',
      description: 'Fresh content added daily by our contributor network to stay ahead of academic trends.',
    },
  ];

  const contributors = [
    {
      name: 'Manan Gohil',
      role: 'Project Lead',
      badge: 'Lead',
      badgeClass: 'bg-primary text-white',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_X_o4f0hXOLkW8GFyS_99Wd-27mxjyc4Mkqby9idLKqmK1_lmpRdWzy0oMZtO2kdV_3hQWsDO1lSHgZfM6y_0hO-EQJg8_Zgrczv4PkA8nJ_mFucfDNLZA19T-LSFdQJUHiTa0R8MSXuTSup7os3xdEGi3xqa3JO_FyDLBp9vckatx7iWaX02Rypurh_nynVhFTeyxY9DewWS_AtZEZwruBWEPMD6juzu5DOYkE4wavx3DYkuQmTnogBcILFWkp9HvOSgxU4xiM',
      university: 'Indus University · CE',
      bulletPoints: ['Architecture Design', 'Roadmap Planning', 'Resource Curation'],
    },
    {
      name: 'Krish Patel',
      role: 'Frontend Developer',
      badge: 'Frontend',
      badgeClass: 'bg-secondary text-white',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1oB7febShFcsKAnTYIXP_T0HYgEoD69brUFelyDnZjsAdajt4siCu1jqwgLsw9GTm5oVFWAWBXo4fF95FNhqwi7KPEsgCJVBzkx5utFdtCLDiqPltlJqXj9usXg2kDugbXNq75b4kMzD7oFJ2m2fzt2InwOfhvR7Nj_FDuyHV4yn1rUM7EjkxOgkor9RENdnAndgr3RH4o5zoBjjORBEJVy9iv58p41NlDfre-xmMyF_yUUgv3sAEGRCBFmfOxMuw3ndVT8hnol4',
      university: 'Indus University · CE',
      bulletPoints: ['React Integration', 'Dashboard UX', 'Responsive Layouts'],
    },
    {
      name: 'Akshat Khatri',
      role: 'Backend Developer',
      badge: 'Backend',
      badgeClass: 'bg-secondary text-white',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJdoXoH2mO-SWtcIlNOq823u1YxeVXZMm73gR2eOImOqtEXniRhHocHVFFxrYKwywX47IBxLwgXDu-hbFVFUNYOPwM0K1L1rRkFcHzGbU7u1ffzRvdFiILM1vLQc0PIks5BAkKyXvdIXswr1L9j1vNbC4EaRIA70MEsF8h1VmssFhYCwhVZVTqgPG2Wjoe5EiwKFmlvnv88ZWa3KyFoN_zhh_sG8ilafIApaaWccTv-3WU5NOzAyIE7O-ms6i_-w8FKWdLY1H2HY',
      university: 'Indus University · CE',
      bulletPoints: ['API Development', 'Database Management', 'Auth Security'],
    },
    {
      name: 'Manthan Prajapati',
      role: 'UI & Testing',
      badge: 'UI & QA',
      badgeClass: 'bg-secondary text-white',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZFdmp7jD-2xVxlNZuWTtGVRObUG4El_gOLLjYcxAgE3wRs7AX9Ckm9brOPRuravtS9xL-_6O58LiqyHBmzf-ZIHVNih59hKRTOSjd8afrerRZXH_Y-UDc6KCQ_kggJ00u5jbmlxzVc6x3DrjDNXkVfxQJf5fK8z0cHHCJkKi9WozpuZoVfjD8x5g_X0_IQVUZ_ppUcB45LQCgdYmKowJzm6c4jVgqnvoLmlzgmwzKDV-xCc4CUX7npVcqGvxyGk_CUUX2HBD7AgA',
      university: 'Indus University · CE',
      bulletPoints: ['Visual Design System', 'Quality Assurance', 'Beta Testing'],
    },
  ];

  return (
    <div className="bg-[#FFF8EC] text-on-surface font-body-md min-h-screen pb-12">
      <main className="max-w-container-max mx-auto px-gutter py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-on-surface-variant font-label-lg text-label-lg">
          <Link className="hover:text-primary transition-colors opacity-60" to="/">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">About</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 max-w-3xl">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-navy-premium font-bold text-4xl mb-4">
            About Student Resource Hub
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            A centralized ecosystem designed to empower students with elite academic tools, career insights, and a thriving peer community.
          </p>
        </div>

        {/* Our Mission Section */}
        <section className="mb-section-gap-lg">
          <div className="bg-white p-8 md:p-12 rounded-[20px] premium-shadow flex flex-col md:flex-row items-center gap-10 border border-surface-container-high shadow-sm">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                target
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline-lg text-headline-lg text-navy-premium font-bold text-2xl">
                Our Mission
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-sm sm:text-base">
                We believe that academic success shouldn't be gated by fragmented information. Our mission is to simplify the student life cycle by providing a premium, unified platform where resources are curated, opportunities are accessible, and collaboration is seamless. Scholarly is built for the high-achiever in every student.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Excellence Section */}
        <section className="mb-section-gap-lg pt-12">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-headline-lg text-headline-lg text-navy-premium font-bold text-3xl">Platform Excellence</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformExcellence.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-[20px] border border-surface-container-high group premium-shadow-hover transition-all duration-300 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-6 block group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-navy-premium font-bold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-on-surface-variant font-body-md text-body-md text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Team Section */}
        <section className="mb-section-gap-lg pt-12">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-headline-lg text-headline-lg text-navy-premium font-bold text-3xl">Project Contributors</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto text-sm sm:text-base">
              Designed and developed by students of Indus University, Computer Engineering Department
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((contrib, index) => (
              <div key={index} className="bg-white p-6 rounded-[20px] premium-shadow border border-surface-container-high flex flex-col items-center text-center group shadow-sm">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full avatar-gradient p-1">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                      <img 
                        className="w-full h-full object-cover" 
                        src={contrib.avatar} 
                        alt={contrib.name} 
                      />
                    </div>
                  </div>
                  {contrib.badge && (
                    <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${contrib.badgeClass}`}>
                      {contrib.badge}
                    </span>
                  )}
                </div>
                
                <h4 className="font-headline-md text-[20px] text-navy-premium font-bold text-lg mb-1">
                  {contrib.name}
                </h4>
                <p className="text-primary font-label-lg text-label-lg font-semibold text-xs mb-4">
                  {contrib.role}
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">school</span>
                  <span className="text-[12px] font-medium text-on-surface-variant">
                    {contrib.university}
                  </span>
                </div>
                
                <ul className="text-[13px] text-on-surface-variant text-left w-full space-y-2 mb-8 flex-grow border-t border-gray-100 pt-4">
                  {contrib.bulletPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-3 w-full justify-center pt-4 border-t border-gray-50">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary-container hover:text-white hover:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary-container hover:text-white hover:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </a>
                  <a href="mailto:hello@studenthub.com" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary-container hover:text-white hover:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
