import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import UploadResourceModal from '../../components/resources/UploadResourceModal';
import { WordReveal, TextGradientSheen, BlurText, BlurCategoryScroller } from '../../components/ui/TextAnimations';
import { semestersData } from '../../data/semestersData';

const DEPARTMENTS = [
  {
    code: 'CE',
    name: 'Computer Engineering (CE)',
    description: 'Semester-wise resources for Computer Engineering students including notes, previous year question papers, syllabus, and lab manuals.',
    icon: 'memory',
    isAvailable: true,
    path: '/semesters',
    badge: 'Available',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderColor: 'border-amber-400',
    iconBg: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    code: 'CSE',
    name: 'Computer Science & Engineering (CSE)',
    description: 'Specialized study materials for software engineering, algorithms, cloud computing, and theory of computation.',
    icon: 'laptop_mac',
    isAvailable: false,
    badge: 'Coming Soon',
    gradient: 'from-sky-500/15 via-indigo-500/5 to-transparent',
    borderColor: 'border-sky-300',
    iconBg: 'bg-sky-100 text-sky-900 border-sky-300',
  },
  {
    code: 'IT',
    name: 'Information Technology (IT)',
    description: 'Specialized study materials for Information Technology subjects, database systems, and web technologies.',
    icon: 'dns',
    isAvailable: false,
    badge: 'Coming Soon',
    gradient: 'from-purple-500/15 via-pink-500/5 to-transparent',
    borderColor: 'border-purple-300',
    iconBg: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

const RESOURCE_CATEGORIES = [
  {
    id: 'notes',
    title: 'Handwritten Notes',
    desc: 'Unit-wise digitized notes written by top scorers with clean diagrams.',
    icon: 'edit_note',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    badge: 'High Demand',
  },
  {
    id: 'pyqs',
    title: 'Previous Year Papers',
    desc: 'Mid-sem & end-sem university question papers with solution keys.',
    icon: 'history_edu',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
    badge: 'Exam Prep',
  },
  {
    id: 'practicals',
    title: 'Lab Manuals & Codes',
    desc: 'Fully written experiment files, test outputs, and runnable source code.',
    icon: 'science',
    color: 'bg-sky-50 text-sky-800 border-sky-200',
    badge: 'Verified Code',
  },
  {
    id: 'viva',
    title: 'Viva & Oral Banks',
    desc: 'Most frequently asked external examiner viva questions with answers.',
    icon: 'quiz',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badge: 'Scoring Key',
  },
  {
    id: 'syllabus',
    title: 'Official Syllabus',
    desc: 'Updated unit weightages, paper patterns, and recommended reading.',
    icon: 'menu_book',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    badge: '2026 Batch',
  },
  {
    id: 'textbooks',
    title: 'Reference Books',
    desc: 'Standard university prescribed e-books and author reference guides.',
    icon: 'auto_stories',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badge: 'Full PDFs',
  },
];

const FEATURES = [
  {
    image: '/images/verified-content.png',
    title: 'Verified Content',
    desc: 'All notes and question papers are reviewed for accuracy by subject rankers and senior coordinators.',
  },
  {
    image: '/images/organized.png',
    title: 'Zero-Friction Hierarchy',
    desc: 'Structured by Department → Semester → Subject → Category for instant 1-click navigation.',
  },
  {
    image: '/images/fast-downloads.png',
    title: 'Instant Previews & Download',
    desc: 'Optimized high-speed cloud CDN with embedded PDF viewers and zero paywalls or ad-blockers.',
  },
  {
    image: '/images/updated-regularly.png',
    title: 'Continuous Updates',
    desc: 'New semester examination papers and syllabus revisions are uploaded within 24 hours of release.',
  },
];

function Resources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleNotifyComingSoon = (deptName) => {
    addToast({
      message: `🔔 Thanks for your interest! ${deptName} resources are being scanned and will drop soon.`,
      type: 'info',
      duration: 3500,
    });
  };

  return (
    <div className="pt-20 bg-[#f8fafc] text-slate-800 font-sans min-h-screen pb-24 relative overflow-x-clip selection:bg-amber-300 selection:text-slate-900">
      {/* ─── Ambient Canvas & Subtle Grid Pattern ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 -left-20 w-[650px] h-[650px] bg-gradient-to-br from-amber-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[25%] -right-24 w-[600px] h-[600px] bg-gradient-to-bl from-sky-300/25 via-indigo-300/15 to-transparent rounded-full blur-3xl opacity-65" />
        <div className="absolute top-[60%] -left-20 w-[550px] h-[550px] bg-gradient-to-tr from-purple-300/20 via-pink-300/10 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── BREADCRUMB ─── */}
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <ol className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 flex-wrap">
            <li>
              <Link to="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-500">home</span>
                <span>Home</span>
              </Link>
            </li>
            <li className="text-slate-300 select-none">/</li>
            <li className="text-slate-900 font-bold">Academic Resources</li>
          </ol>
        </nav>

        {/* ─── HERO SECTION ─── */}
        <section className="pt-6 pb-12 lg:pt-8 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* LEFT: Text & Instant Search */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 max-w-xl">
              {/* Editorial Smooth Word-Reveal Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
                <WordReveal
                  text="Access All Your Academic"
                  className="text-slate-900"
                  wordClassName="hover:text-amber-600 transition-colors"
                  delay={0.05}
                  stagger={0.04}
                />
                <br />
                <span className="relative inline-flex items-baseline pb-1">
                  <TextGradientSheen
                    className="drop-shadow-xs"
                    fromColor="#f59e0b"
                    viaColor="#ea580c"
                    toColor="#d97706"
                  >
                    Resources in One Place
                  </TextGradientSheen>
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-amber-400/80 pointer-events-none"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 6 Q 50 0 100 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Browse semester-wise notes, previous year question papers, practical files, viva questions, question banks, and syllabus organized with zero friction.
              </p>

              {/* CTA Action Button */}
              <div className="pt-2">
                <a
                  href="#departments"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-amber-400 text-white hover:text-slate-950 font-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Explore Departments</span>
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">arrow_forward</span>
                </a>
              </div>

              {/* Live Metric Ribbon */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">school</span>
                  <span>{semestersData.length} Full Semesters</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
                  <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                  <span>100% Free &amp; Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
                  <span className="material-symbols-outlined text-sky-500 text-[18px]">bolt</span>
                  <span>Instant PDF Viewer</span>
                </div>
              </div>
            </div>

            {/* RIGHT: 3D Illustration Layer */}
            <div className="lg:col-span-6 relative flex justify-center items-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-[500px] lg:max-w-[580px] group"
              >
                <div className="relative rounded-3xl overflow-hidden p-2 sm:p-4">
                  <img
                    alt="Academic Resources Hub"
                    src="/images/resource-hero-section.png"
                    className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── CHOOSE YOUR DEPARTMENT SECTION ─── */}
        <section id="departments" className="py-10 sm:py-16 md:py-20 relative scroll-mt-24">
          <div className="text-center mb-8 sm:mb-12 space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold uppercase tracking-wider border border-slate-200">
              <span>ENGINEERING BRANCHES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Choose Your{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                Department
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-amber-400"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              Select your academic branch to access specialized subjects, semester curriculum, and exam materials.
            </p>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {DEPARTMENTS.map((dept) => (
              <motion.div
                key={dept.code}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[20px] sm:rounded-3xl p-3.5 sm:p-5 md:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between relative overflow-hidden transition-all group min-h-[220px] sm:min-h-[260px]"
              >
                {/* Background Gradient Subtle Accent */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${dept.gradient} pointer-events-none`} />

                <div>
                  {/* Top Status & Icon */}
                  <div className="flex items-start justify-between mb-3.5 sm:mb-5 relative z-10">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl ${dept.iconBg} border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110`}>
                      <span className="material-symbols-outlined text-[22px] sm:text-[28px]">{dept.icon}</span>
                    </div>

                    <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border shadow-2xs ${dept.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                      {dept.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 mb-1 sm:mb-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 break-words">
                    {dept.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4 sm:mb-8 line-clamp-3 sm:line-clamp-none">
                    {dept.description}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  {dept.isAvailable ? (
                    <Link
                      to={dept.path}
                      className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
                    >
                      <span>Explore Resources</span>
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNotifyComingSoon(dept.name)}
                      className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer transition-colors"
                    >
                      <span>Coming Soon (Notify Me)</span>
                      <span className="material-symbols-outlined text-[16px] text-amber-500">notifications</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── RESOURCE MATRIX: BLUR TEXT SCROLLER ─── */}
        <section className="py-12 sm:py-16 relative">
          <div className="text-center mb-8 max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold uppercase tracking-wider border border-slate-200">
              <span>EXPLORE BY STUDY FORMAT</span>
            </div>
            <BlurText
              text="Everything You Need to Ace Your Exams"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
            />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Curated notes, question papers, code solutions, and viva banks.
            </p>
          </div>

          {/* Interactive Infinite Blur Scroller Track */}
          <BlurCategoryScroller categories={RESOURCE_CATEGORIES} />
        </section>

        {/* ─── WHY USE OUR RESOURCES (FEATURES) ─── */}
        <section className="py-14 sm:py-20 relative">
          <div className="text-center mb-12 max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-mono font-bold uppercase tracking-wider border border-amber-300/40">
              <span>THE CAMPUSHUB DIFFERENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Why Students Trust Our{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                Resource Library
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-amber-400"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-2 sm:space-y-3"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-1">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA BANNER ─── */}
        <section className="py-10 sm:py-16 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0B132B] border border-white/10 text-white">
            {/* Paper Airplane Trail Decor */}
            <div className="absolute bottom-0 -left-10 sm:left-0 md:-left-12 lg:left-0 h-28 sm:h-44 md:h-[75%] lg:h-[85%] max-h-full w-auto pointer-events-none z-0 flex items-end opacity-40 sm:opacity-50 md:opacity-60">
              <img src="/images/paper-airplane-trail.png" alt="Paper Airplane Trail" className="h-full w-auto object-contain object-bottom" />
            </div>

            {/* Glowing Radial Circles */}
            <div className="absolute -top-16 -right-16 sm:-top-28 sm:-right-20 w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#1D4ED8] pointer-events-none opacity-80" />
            <div className="absolute -bottom-20 -right-10 sm:-bottom-28 sm:-right-12 w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#F59E0B] shadow-xl pointer-events-none opacity-80" />

            <div className="relative z-10 p-4 sm:p-8 md:p-12 text-center max-w-2xl mx-auto space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-white/15">
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                <span>COMMUNITY-POWERED PLATFORM</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                Can't find what you're looking for?
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
                Our community is constantly updating the resource library. If a specific paper or note is missing, let us know and we'll track it down for you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black px-7 py-3.5 rounded-full shadow-lg hover:shadow-yellow-400/20 hover:-translate-y-0.5 transition-all text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>Upload Resource</span>
                </button>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-black px-7 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-xs sm:text-sm inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                  <span>Request Resource</span>
                </Link>

                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border-2 border-white/40 hover:border-white text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                  <span>Join WhatsApp Community</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── UPLOAD MODAL ─── */}
      {isModalOpen && (
        <UploadResourceModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            addToast({ message: '🎉 Resource submitted! It will appear once reviewed by admin.', type: 'success', duration: 5000 });
          }}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Resources;
