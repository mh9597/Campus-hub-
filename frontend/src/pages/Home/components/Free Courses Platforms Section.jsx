import React from 'react';

function LearningPlatformsSection() {
  // 8 brand cards matching reference Image 1 in a 4x2 grid layout
  const platforms = [
    {
      title: 'Deloitte',
      subtitle: 'Professional Learning',
      logo: '/images/logos/deloitte.svg',
      link: 'https://www2.deloitte.com/us/en/careers/students.html',
      bgClass: 'bg-[#1E293B]',
      textClass: 'text-white',
      badgeClass: 'text-[#FBBF24]',
      isLight: false,
    },
    {
      title: 'Cisco',
      subtitle: 'Networking Academy',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg',
      link: 'https://www.netacad.com/',
      bgClass: 'bg-[#0072C6]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
    {
      title: 'Google',
      subtitle: 'Career Certificates',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      link: 'https://grow.google/certificates/',
      bgClass: 'bg-white border-2 border-slate-100 shadow-md',
      textClass: 'text-slate-900',
      badgeClass: 'text-gray-500',
      isLight: true,
    },
    {
      title: 'Microsoft',
      subtitle: 'Learn',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      link: 'https://learn.microsoft.com/',
      bgClass: 'bg-[#4F46E5]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
    {
      title: 'AWS',
      subtitle: 'Training & Certification',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      link: 'https://aws.amazon.com/training/',
      bgClass: 'bg-[#F97316]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
    {
      title: 'IBM',
      subtitle: 'SkillsBuild',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
      link: 'https://skillsbuild.org/',
      bgClass: 'bg-[#1E293B]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
    {
      title: 'Oracle',
      subtitle: 'Academy',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
      link: 'https://academy.oracle.com/',
      bgClass: 'bg-[#991B1B]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
    {
      title: 'TCS iON',
      subtitle: 'Career Edge',
      logo: '/images/logos/tcs-ion.png',
      link: 'https://learning.tcsionhub.in/courses/career-edge/',
      bgClass: 'bg-[#1E3BB3]',
      textClass: 'text-white',
      badgeClass: 'text-white/90',
      isLight: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header matching Image 1 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/80 shadow-xs text-hub-navy text-xs font-extrabold uppercase tracking-wide">
              <span className="text-amber-500 text-sm">★</span>
              <span>POPULAR</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              Discover Free <br className="hidden sm:inline" />
              <span className="relative inline-block text-amber-500">
                Learning Platforms
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-medium pt-1">
              Explore free certifications, industry-recognized courses, career opportunities and trusted learning resources.
            </p>
          </div>

          <div>
            <button className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-hub-navy font-bold px-6 py-3 rounded-full border-2 border-amber-300 shadow-md hover:shadow-lg transition-all text-sm group">
              <span>Explore All Platforms</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 8 Brand Cards Grid (4 columns desktop, 2 columns mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              className={`${p.bgClass} rounded-[24px] p-6 flex flex-col justify-between items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[220px] relative group overflow-hidden`}
            >
              {/* Brand Logo Container */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2.5 shadow-md mb-4 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                <img src={p.logo} alt={p.title} className="w-full h-full object-contain" />
              </div>

              {/* Brand Info */}
              <div className="mb-5">
                <h3 className={`text-xl font-bold ${p.textClass} tracking-tight`}>{p.title}</h3>
                <p className={`text-xs font-semibold mt-1 ${p.badgeClass}`}>{p.subtitle}</p>
              </div>

              {/* Explore Button inside Card */}
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${p.isLight
                  ? 'bg-amber-400 text-hub-navy hover:bg-amber-500 shadow-xs'
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30'
                  }`}
              >
                <span>Explore</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default LearningPlatformsSection;
