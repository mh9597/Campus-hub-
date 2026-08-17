import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import UploadResourceModal from '../../components/resources/UploadResourceModal';

function Resources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const departments = [
    {
      code: 'CE',
      name: 'Computer Engineering (CE)',
      description: 'Semester-wise resources for Computer Engineering students including notes, papers, and lab manuals.',
      icon: 'memory',
      isAvailable: true,
      path: '/semesters',
    },
    {
      code: 'CSE',
      name: 'Computer Science & Engineering (CSE)',
      description: 'Academic resources for CSE students covering software engineering, algorithms, and theory of computation.',
      icon: 'laptop_mac',
      isAvailable: false,
    },
    {
      code: 'IT',
      name: 'Information Technology (IT)',
      description: 'Specialized study materials for Information Technology subjects, database systems, and web technologies.',
      icon: 'dns',
      isAvailable: false,
    },
  ];

  const features = [
    {
      image: '/images/verified-content.png',
      title: 'Verified Content',
      desc: 'All resources are reviewed by subject matter experts and top-performing alumni.',
    },
    {
      image: '/images/organized.png',
      title: 'Organized',
      desc: 'Structure by semester and category for zero-friction navigation through your degree.',
    },
    {
      image: '/images/fast-downloads.png',
      title: 'Fast Downloads',
      desc: 'Optimized PDF sizes and high-speed servers for instant access even on mobile data.',
    },
    {
      image: '/images/updated-regularly.png',
      title: 'Updated Regularly',
      desc: 'New syllabus changes and the latest session papers are added within 24 hours of release.',
    },
  ];

  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">
      {/* ─── Background Decor (Exact Match to Reference Image) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left Side Organic Warm Cream Blob (Subtle, Compact & Soft) */}
        <div className="absolute top-[220px] -left-28 w-[240px] sm:w-[280px] h-[340px] sm:h-[400px] bg-[#F7EEDC]/60 rounded-tr-[160px] rounded-br-[140px] blur-sm opacity-60" />

        {/* Far-Left Yellow Dots Grid (Subtle, compact) */}
        <svg className="absolute top-14 left-2 sm:left-4 w-12 h-28 opacity-40" viewBox="0 0 60 140" fill="#F59E0B">
          <pattern id="r-dots-left" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" />
          </pattern>
          <rect width="60" height="140" fill="url(#r-dots-left)" />
        </svg>

        {/* Top-Right Dark Navy Dots Grid (5x5) */}
        <svg className="absolute top-6 right-6 sm:right-12 w-24 h-24 opacity-35" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="r-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#r-dots-tr)" />
        </svg>

        {/* Right Side Yellow Dots Grid in Department Section (4x6) */}
        <svg className="absolute top-[480px] right-3 sm:right-6 w-16 h-36 opacity-75 hidden sm:block" viewBox="0 0 60 140" fill="#F59E0B">
          <pattern id="r-dots-dept-r" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="60" height="140" fill="url(#r-dots-dept-r)" />
        </svg>

        {/* Bottom Left Yellow Dots Grid in Department Section (4x6) */}
        <svg className="absolute top-[780px] left-3 sm:left-6 w-16 h-36 opacity-75 hidden sm:block" viewBox="0 0 60 140" fill="#F59E0B">
          <pattern id="r-dots-dept-l" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="60" height="140" fill="url(#r-dots-dept-l)" />
        </svg>

        {/* Hollow Yellow Circles matching reference image (Desktop/Tablet display) */}
        <div className="hidden md:block absolute top-[18%] left-[49%] w-5 h-5 rounded-full border-2 border-amber-400 opacity-80 pointer-events-none" />
        <div className="hidden md:block absolute top-[16%] right-[8%] w-5 h-5 rounded-full border-2 border-amber-400 opacity-80 pointer-events-none" />
        <div className="hidden md:block absolute top-[46%] left-6 sm:left-10 w-6 h-6 rounded-full border-2 border-amber-400 opacity-85 pointer-events-none" />
        <div className="hidden md:block absolute top-[38%] right-[4%] w-6 h-6 rounded-full border-2 border-amber-400 opacity-85 pointer-events-none" />
        <div className="hidden md:block absolute top-[68%] left-4 sm:left-8 w-6 h-6 rounded-full border-2 border-amber-400 opacity-85 pointer-events-none" />
        <div className="hidden md:block absolute top-[78%] right-4 sm:right-8 w-6 h-6 rounded-full border-2 border-amber-400 opacity-85 pointer-events-none" />

        {/* Tiny Navy Wave Decoration (bottom right of hero) */}
        <div className="absolute top-[440px] right-14 flex gap-1 opacity-70 hidden lg:flex">
          <svg className="w-12 h-3" viewBox="0 0 48 10" fill="none" stroke="#0D1B40" strokeWidth="2">
            <path d="M0,5 Q6,0 12,5 T24,5 T36,5 T48,5" />
          </svg>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-8 lg:pb-24 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-gray-500 mb-7">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-black font-bold">Resources</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* LEFT: Text Content */}
            <div className="lg:col-span-5 space-y-6 max-w-[560px]">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/70 text-hub-navy text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                <span>📚</span>
                <span>Academic Resources</span>
              </div>

              {/* Headline */}
              <h1 className="text-[40px] sm:text-5xl lg:text-[50px] xl:text-[54px] font-black text-hub-navy leading-[1.14] tracking-tight">
                Access All Your Academic
                <br />
                <span className="relative inline-block text-amber-500">
                  Resources
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}in{' '}
                <span className="relative inline-block text-amber-500">
                  One Place
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed font-medium">
                Browse semester-wise notes, previous year papers, practical files, viva questions, question banks, syllabus, and other academic materials organized for easy access.
              </p>

              {/* CTA Button */}
              <a
                href="#departments"
                className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                <span>Explore Departments</span>
                <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
              </a>
            </div>

            {/* RIGHT: Illustration (Slid & Shifted Right for Web Display) */}
            <div className="lg:col-span-7 relative flex justify-center items-center lg:justify-end lg:pl-6">
              <div className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[720px] xl:max-w-[800px] lg:translate-x-8 xl:translate-x-12 transition-transform duration-500 hover:scale-[1.02]">
                <img
                  alt="Academic Resources Center Illustration"
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-2xl"
                  src="/images/resource-hero-section.png"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CHOOSE YOUR DEPARTMENT SECTION ─── */}
      <section id="departments" className="py-16 md:py-24 relative scroll-mt-24 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Section heading */}
          <div className="text-center mb-14 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
              Choose Your{' '}
              <span className="relative inline-block text-hub-navy">
                Department
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-400"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto pt-2">
              Select your engineering branch to access specialized academic resources.
            </p>
          </div>

          {/* Department cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.code}
                className="glass-card rounded-[28px] p-8 sm:p-10 border border-gray-100/80 shadow-[0_10px_35px_rgba(0,0,0,0.035)] hover:shadow-2xl hover:-translate-y-2 hover:border-amber-300/50 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden active-press"
              >
                {!dept.isAvailable && (
                  <div className="absolute top-4 right-4 bg-amber-100/90 backdrop-blur-sm text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300/80 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <span>🚀</span> Coming Soon
                  </div>
                )}

                {/* Amber Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-[#FEF3D6] text-hub-navy border border-amber-300/70 flex items-center justify-center mb-6 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-hub-navy">{dept.icon}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-hub-navy mb-3 tracking-tight leading-snug">{dept.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium mb-8 max-w-[280px] mx-auto flex-1">{dept.description}</p>

                {/* Action button */}
                {dept.isAvailable ? (
                  <Link
                    to={dept.path}
                    className="w-full sm:w-[85%] font-bold py-3.5 rounded-full bg-hub-navy hover:bg-black text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-auto active-press"
                  >
                    <span>Explore</span>
                    <span className="material-symbols-outlined text-base leading-none transition-transform duration-200 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="w-full sm:w-[85%] font-bold py-3.5 rounded-full bg-hub-navy text-white shadow-md flex items-center justify-center gap-2 text-sm mt-auto opacity-90 cursor-not-allowed"
                  >
                    <span>Coming Soon</span>
                    <span className="material-symbols-outlined text-base leading-none">
                      lock
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── WHY USE OUR RESOURCES ─── */}
      <section className="py-14 md:py-20 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
              Why Use{' '}
              <span className="relative inline-block text-hub-navy">
                Our Resources?
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-400"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="glass-card rounded-2xl p-7 border border-gray-100/90 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 active-press"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-sm hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base font-extrabold text-hub-navy">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CTA BANNER: "Can't find your resource?" ─── */}
      <section className="py-8 sm:py-12 md:py-16 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Dark CTA Box */}
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-[#0B132B] border border-white/10">
            
            {/* Top Left Yellow Ring Accent */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-[3px] border-[#FBBF24] opacity-90 pointer-events-none" />

            {/* Paper Airplane Trail Image (Left Side) - Responsive scaling & opacity */}
            <div className="absolute bottom-0 left-0 h-28 sm:h-44 md:h-[88%] max-h-full w-auto pointer-events-none z-0 sm:z-10 flex items-end opacity-40 sm:opacity-75 md:opacity-90">
              <img src="/images/paper-airplane-trail.png" alt="Paper Airplane Trail" className="h-full w-auto object-contain object-bottom" />
            </div>

            {/* Top Right Royal Blue Circle - Responsive Sizing */}
            <div className="absolute -top-16 -right-16 sm:-top-28 sm:-right-20 w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#1D4ED8] pointer-events-none opacity-80 sm:opacity-100" />

            {/* Top Right Yellow Dots Grid - Hidden on mobile */}
            <div className="absolute top-6 right-8 sm:top-8 sm:right-12 pointer-events-none hidden sm:block z-10">
              <svg className="w-20 h-14 md:w-24 md:h-16" viewBox="0 0 100 80">
                <pattern id="cta-yellow-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="2.5" fill="#FBBF24" />
                </pattern>
                <rect width="100" height="80" fill="url(#cta-yellow-dots)" />
              </svg>
            </div>

            {/* Bottom Right Orange Circle - Responsive Sizing */}
            <div className="absolute -bottom-20 -right-10 sm:-bottom-28 sm:-right-12 w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#F59E0B] shadow-xl pointer-events-none opacity-80 sm:opacity-100" />

            {/* Content Container - Responsive Padding & Layout */}
            <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-14 md:px-14 md:py-20 text-center max-w-2xl mx-auto space-y-4 sm:space-y-5">
              <h2 className="text-2xl sm:text-3xl md:text-[38px] font-black text-white leading-tight tracking-tight flex flex-col items-center">
                <span>Can't find</span>
                <span className="relative inline-block mt-1">
                  what you're looking for?
                  <div className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-[2.5px] sm:h-[3px] bg-white rounded-full"></div>
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium max-w-lg mx-auto leading-relaxed">
                Our community is constantly updating the resource library. If a specific paper or note is missing, let us know and we'll track it down for you.
              </p>

              {/* Responsive Buttons Container */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-hub-navy font-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer active-press"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">upload</span>
                  <span>Upload Resource</span>
                </button>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-hub-navy font-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2 active-press"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">assignment_add</span>
                  <span>Request Resource</span>
                </Link>
                <a
                  href="/community"
                  className="w-full sm:w-auto border-2 border-white/50 hover:border-white text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer active-press"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">groups</span>
                  <span>Join Whatsapp Community</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* ─── UPLOAD MODAL ─── */}
      {isModalOpen && (
        <UploadResourceModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { 
            setIsModalOpen(false); 
            addToast({ message: '✅ Resource submitted for review.', type: 'success', duration: 5000 }); 
          }} 
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Resources;
