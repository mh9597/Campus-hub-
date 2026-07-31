import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResourceUpload } from '../../hooks/useResourceRequest';
import { ToastContainer, useToast } from '../../components/ui/Toast';

function Resources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const {
    formData,
    handleChange,
    handleSubmit,
    status: submitStatus,
    errorMessage: submitError,
    reset: resetForm,
  } = useResourceUpload();

  useEffect(() => {
    if (submitStatus === 'success') {
      addToast({
        message: '✅ Resource submitted for review.',
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

  const RESOURCE_TYPES = [
    'Notes',
    'Previous Year Papers (PYQ)',
    'Practical File',
    'Viva Questions',
    'Question Bank',
    'Syllabus',
    'Lab Manual',
    'Other',
  ];

  const departments = [
    {
      code: 'CE',
      name: 'Computer Engineering (CE)',
      description: 'Semester-wise resources for Computer Engineering students including notes, papers, and lab manuals.',
      icon: 'memory',
    },
    {
      code: 'CSE',
      name: 'Computer Science & Engineering (CSE)',
      description: 'Academic resources for CSE students covering software engineering, algorithms, and theory of computation.',
      icon: 'laptop_mac',
    },
    {
      code: 'IT',
      name: 'Information Technology (IT)',
      description: 'Specialized study materials for Information Technology subjects, database systems, and web technologies.',
      icon: 'dns',
    },
  ];

  const features = [
    {
      icon: 'workspace_premium',
      title: 'Verified Content',
      desc: 'All resources are reviewed by subject matter experts and top-performing alumni.',
    },
    {
      icon: 'folder',
      title: 'Organized',
      desc: 'Structure by semester and category for zero-friction navigation through your degree.',
    },
    {
      icon: 'bolt',
      title: 'Fast Downloads',
      desc: 'Optimized PDF sizes and high-speed servers for instant access even on mobile data.',
    },
    {
      icon: 'sync',
      title: 'Updated Regularly',
      desc: 'New syllabus changes and the latest session papers are added within 24 hours of release.',
    },
  ];

  return (
    <div className="bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">

      {/* ─── Background Decor (matches reference image) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right navy dots matrix */}
        <svg className="absolute top-8 right-6 w-32 h-28 opacity-20" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="r-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#r-dots-tr)" />
        </svg>

        {/* Mid-right amber dots (beside department cards) */}
        <svg className="absolute top-[44%] right-2 w-24 h-44 opacity-50" viewBox="0 0 80 140" fill="#F59E0B">
          <pattern id="r-dots-mr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="80" height="140" fill="url(#r-dots-mr)" />
        </svg>

        {/* Mid-left amber dots */}
        <svg className="absolute top-[53%] left-2 w-20 h-36 opacity-50" viewBox="0 0 70 120" fill="#F59E0B">
          <pattern id="r-dots-ml" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="70" height="120" fill="url(#r-dots-ml)" />
        </svg>

        {/* Hollow amber rings matching reference */}
        <div className="absolute top-[19%] left-[7%] w-5 h-5 rounded-full border-2 border-amber-400 opacity-70" />
        <div className="absolute top-[30%] right-[5%] w-6 h-6 rounded-full border-2 border-amber-400 opacity-60" />
        <div className="absolute top-[50%] left-[3%] w-5 h-5 rounded-full border-2 border-amber-400 opacity-60" />
        <div className="absolute top-[58%] right-[4%] w-6 h-6 rounded-full border-2 border-amber-400 opacity-60" />
        <div className="absolute bottom-[25%] left-[2%] w-4 h-4 rounded-full border-2 border-amber-400 opacity-50" />
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-6 pb-14 lg:pt-10 lg:pb-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-gray-500 mb-7">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-blue-600 font-bold">Resources</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* LEFT: Text Content */}
            <div className="lg:col-span-6 space-y-6">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/70 text-hub-navy text-[11px] font-extrabold uppercase tracking-widest">
                <span>📚</span>
                <span>Academic Resources</span>
              </div>

              {/* Headline — matches reference: "Access All Your Academic" line 1, "Resources in One Place" line 2 */}
              <h1 className="text-[40px] sm:text-5xl lg:text-[52px] font-black text-hub-navy leading-[1.15] tracking-tight">
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
              <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed font-medium">
                Browse semester-wise notes, previous year papers, practical files, viva questions, question banks, syllabus, and other academic materials organized for easy access.
              </p>

              {/* CTA Button */}
              <a
                href="#departments"
                className="inline-flex items-center gap-2 bg-hub-navy hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                <span>Explore Departments</span>
                <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
              </a>
            </div>

            {/* RIGHT: Illustration */}
            <div className="lg:col-span-6 relative flex justify-center items-center">

              {/* Paper airplane + dashed path (top of illustration) */}
              <div className="absolute -top-8 left-[10%] w-40 h-36 pointer-events-none z-20 hidden lg:block">
                <svg className="w-full h-full" viewBox="0 0 160 140" fill="none">
                  <path
                    d="M20,130 C60,80 100,40 150,20"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="5,5"
                  />
                </svg>
                {/* Paper airplane icon at end of path */}
                <div className="absolute top-3 right-1 transform rotate-[-30deg] text-hub-navy/70">
                  <span className="material-symbols-outlined text-2xl">near_me</span>
                </div>
              </div>

              {/* Wavy lines — bottom right of illustration */}
              <div className="absolute -bottom-4 right-4 z-20 flex flex-col gap-1.5 opacity-60 hidden lg:flex">
                {[0, 1, 2].map((i) => (
                  <svg key={i} className="w-14 h-2.5" viewBox="0 0 56 10" fill="none" stroke="#64748B" strokeWidth="2">
                    <path d="M0,5 Q7,0 14,5 T28,5 T42,5 T56,5" />
                  </svg>
                ))}
              </div>

              {/* Main illustration */}
              <div className="relative w-full max-w-[500px]">
                <img
                  alt="Academic Resources Center Illustration"
                  className="w-full h-auto drop-shadow-[0_25px_60px_rgba(0,0,0,0.10)] transition-transform duration-500 hover:scale-[1.02]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS09K5UuqZ23IMKLLfuIv4mDPs8P0dtelMiIcw_v20vYpxe_6RyFqO-COsH6wVKjKEGgCIQKPX46490lyX-8ON5UyRp1qaBj79W5C5H5RuNy6l7Gg5DJrKG149NwdMiQ2itM09-HEjlDv0lr3PLfakOyLTbqAHrCv7tUQYG8Jklafl5NvitdfWCmqSii9U3PXvV7oL4rwUDglOPt_jxePErspvZ7Mt6gVY6Sh-YNvBdmvW8gJKX48-5CoZIL26rTIy8Hls7E9zs-I"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CHOOSE YOUR DEPARTMENT ─── */}
      <section id="departments" className="py-14 md:py-20 relative scroll-mt-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
              Choose Your{' '}
              <span className="relative inline-block text-hub-navy">
                Department
                {/* Amber underline squiggle */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {departments.map((dept) => (
              <div
                key={dept.code}
                className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Icon badge — amber square, centered */}
                <div className="w-16 h-16 rounded-xl bg-[#FEF3D6] border border-amber-300/60 text-amber-600 flex items-center justify-center mb-5 mx-auto group-hover:bg-amber-400 group-hover:text-hub-navy transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">{dept.icon}</span>
                </div>

                <h3 className="text-lg font-extrabold text-hub-navy mb-2.5 tracking-tight">{dept.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8 flex-1">{dept.description}</p>

                {/* Explore button — dark navy brand pill */}
                <Link
                  to="/semesters"
                  className="w-full bg-hub-navy hover:bg-slate-800 text-white font-bold py-3 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 text-sm border border-hub-navy"
                >
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── WHY USE OUR RESOURCES ─── */}
      <section className="py-14 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

          {/* Feature cards — NO outer card background, icons are filled yellow circles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow duration-300"
              >
                {/* Filled amber circle icon — exactly matches reference */}
                <div className="w-16 h-16 rounded-full bg-amber-400 text-hub-navy flex items-center justify-center shadow-md mb-1">
                  <span className="material-symbols-outlined text-2xl font-bold">{feat.icon}</span>
                </div>
                <h3 className="text-base font-extrabold text-hub-navy">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CTA BANNER: "Can't find your resource?" ─── */}
      <section className="py-10 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Dark card with blue-right gradient and amber circle bottom-right */}
          <div className="relative rounded-[24px] overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #0B1840 60%, #1B3A8C 100%)' }}>

            {/* Amber circle bursting bottom-right */}
            <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-amber-400 rounded-full pointer-events-none" />

            {/* Blue glow top-right */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Dots top-right overlay */}
            <svg className="absolute top-5 right-5 w-32 h-32 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="white">
              <pattern id="cta-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#cta-dots)" />
            </svg>

            {/* Small amber ring top-left */}
            <div className="absolute top-8 left-8 w-6 h-6 rounded-full border-2 border-amber-400/60 pointer-events-none" />

            {/* Paper airplane + dashed curve, bottom-left */}
            <div className="absolute bottom-5 left-8 w-36 h-20 pointer-events-none hidden sm:block">
              <svg className="w-full h-full" viewBox="0 0 140 80" fill="none">
                <path d="M10,70 C50,30 90,55 130,10" stroke="white" strokeWidth="1.8" strokeDasharray="4,4" opacity="0.5" />
              </svg>
              <div className="absolute -top-1 right-0 transform rotate-[-30deg] text-white/60">
                <span className="material-symbols-outlined text-xl">near_me</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-14 md:px-14 text-center max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl sm:text-[38px] font-black text-white leading-tight tracking-tight">
                Can&apos;t find{' '}
                <span className="relative inline-block">
                  your resource?
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2 text-white/70"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 6 Q 50 0 100 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                Don&apos;t worry! We are constantly expanding. Request a specific subject or contribute your own notes to help the community.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                {/* White pill button */}
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-hub-navy font-bold px-7 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg leading-none">assignment_add</span>
                  <span>Request Resource</span>
                </Link>

                {/* Outlined pill button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto border-2 border-white/40 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg leading-none">cloud_upload</span>
                  <span>Upload Resource</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── UPLOAD MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-amber-200 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="font-bold text-2xl text-hub-navy mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">upload</span>
              Upload Resource
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Help the community by sharing notes, past papers, or other academic resources. All submissions are reviewed by admins before going live.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="res-subject" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                    Subject Code <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="res-subject"
                    type="text"
                    value={formData.subjectCode}
                    onChange={(e) => handleChange('subjectCode', e.target.value)}
                    placeholder="e.g. CE0516"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm"
                    disabled={submitStatus === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="res-type" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="res-type"
                      value={formData.resourceType}
                      onChange={(e) => handleChange('resourceType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm appearance-none cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      {RESOURCE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="res-title" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="res-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Unit 3 Trees and Graphs Notes"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div>
                <label htmlFor="res-url" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                  Link / URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="res-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div>
                <label htmlFor="res-desc" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="res-desc"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Briefly describe what this resource contains..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm resize-none"
                  disabled={submitStatus === 'loading'}
                  required
                />
              </div>

              <div>
                <label htmlFor="res-email" className="block font-semibold text-sm mb-1.5 text-hub-navy">
                  Your Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="res-email"
                  type="email"
                  value={formData.contributorEmail}
                  onChange={(e) => handleChange('contributorEmail', e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm"
                  disabled={submitStatus === 'loading'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-hub-navy transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-hub-navy/30 border-t-hub-navy rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      Upload
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

export default Resources;
