import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSemesters } from '../../hooks/useSemesters';
import { SemesterCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import pinIcon from './thumb tack 2 plain.svg';
import hackerIcon from './hacker-icon.png';
import sparklesIcon from './sparkles-icon.png';
import databaseIcon from './database-icon.png';
import computerIcon from './computer-icon.png';
import exceptionIcon from './exception-icon.png';
import dataScienceIcon from './data-science-icon.png';
import dnaIcon from './dna-icon.png';

function Semesters() {
  const navigate = useNavigate();
  const { semesters, loading, error, refetch } = useSemesters();

  return (
    <div
      className="pt-20 text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container relative"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '32px 32px'
      }}
    >
      {/* Header / Breadcrumb Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-12 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
          <Link to="/" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/resources" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Resources</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-black font-extrabold">Computer Engineering</span>
        </nav>
        <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-on-surface mb-4 font-bold text-4xl">
          Computer Engineering Semesters
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Explore study resources for Computer Engineering across all semesters. Access hand-picked notes, papers, and lab manuals.
        </p>
      </section>

      {/* The "Bulletin Board" Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 relative">
        {/* SVG Connectors */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <style>
            {`
              @keyframes thread-flow {
                to {
                  stroke-dashoffset: -180;
                }
              }
              .animate-thread {
                animation: thread-flow 8s linear infinite;
              }
            `}
          </style>
          <svg height="100%" preserveAspectRatio="none" viewBox="0 0 1000 1000" width="100%" className="opacity-60">
            <path
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="8 10"
              className="animate-thread"
              d="M 184 50 Q 342 80, 500 50 Q 657 80, 815 50 C 1050 50, 1050 385, 815 385 Q 657 415, 500 385 Q 342 415, 184 385 C -50 385, -50 720, 342 720"
            />
          </svg>
        </div>

        {/* Error state */}
        {error && !loading && (
          <ErrorState
            message={error}
            onRetry={refetch}
            className="max-w-xl mx-auto"
          />
        )}

        {/* Bento Grid */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 lg:gap-x-16 lg:gap-y-24 relative z-10">
          {/* Loading: show skeleton placeholders */}
          {loading && Array.from({ length: 7 }).map((_, i) => (
            <SemesterCardSkeleton key={i} />
          ))}

          {/* Loaded: render semester cards */}
          {!loading && !error && semesters.map((sem, index) => {
            const getLayoutStyles = (i) => {
              const styles = [
                'lg:-rotate-3 lg:mt-0',    // 1
                'lg:rotate-1 lg:mt-8',     // 2
                'lg:rotate-3 lg:mt-2',     // 3
                'lg:rotate-2 lg:mt-4',     // 4
                'lg:-rotate-2 lg:mt-12',   // 5
                'lg:-rotate-3 lg:mt-6',    // 6
                'lg:rotate-1 lg:mt-4',     // 7
                'lg:-rotate-2 lg:mt-8',    // 8
              ];
              return styles[i % styles.length];
            };
            const cardColors = {
              emerald: {
                pinFilter: 'hue-rotate-[140deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#e5fad5]',
                numText: 'text-[#1e5c00]',
              },
              sky: {
                pinFilter: 'hue-rotate-[240deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#d5f3fa]',
                numText: 'text-[#004e5c]',
              },
              yellow: {
                pinFilter: 'hue-rotate-[60deg] brightness-125 drop-shadow-md',
                innerBg: 'bg-[#fdf2d5]',
                numText: 'text-[#5c4a00]',
              },
              purple: {
                pinFilter: 'hue-rotate-[280deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#e5d5fa]',
                numText: 'text-[#3a005c]',
              },
              orange: {
                pinFilter: 'hue-rotate-[30deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#fae5d5]',
                numText: 'text-[#5c2a00]',
              },
              cyan: {
                pinFilter: 'hue-rotate-[200deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#d5faf0]',
                numText: 'text-[#005c48]',
              },
              rose: {
                pinFilter: 'hue-rotate-[330deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#fad5e0]',
                numText: 'text-[#5c0022]',
              },
            };

            const colors = cardColors[sem.pinColor] || cardColors['emerald'];

            return (
              <motion.div
                key={sem.id}
                drag
                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                dragElastic={0.2}
                whileHover={{ scale: 1.03, y: -8, zIndex: 30 }}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: 'grabbing' }}
                onClick={(e) => {
                  // Only navigate if it wasn't a drag event
                  if (!e.defaultPrevented) {
                    navigate(`/semesters/${sem.id}`);
                  }
                }}
                className={`group relative w-full sm:w-[calc(50%-16px)] lg:w-[30%] max-w-[340px] rounded-[32px] bg-white p-3 sm:p-4 pt-10 sm:pt-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-shadow duration-300 min-h-[340px] cursor-grab ${getLayoutStyles(index)}`}
              >
                {/* Pin */}
                <div className="absolute left-1/2 -top-2 sm:top-[-4px] -translate-x-1/2 z-20 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={pinIcon}
                    alt="Pin"
                    className={`w-14 h-14 sm:w-16 sm:h-16 object-contain ${colors.pinFilter}`}
                  />
                </div>

                {/* Card Body */}
                <div className={`relative h-full overflow-hidden rounded-[24px] ${colors.innerBg} p-6 flex flex-col`}>

                  {/* Decorative Logo / Emoji */}
                  <div className="absolute right-5 top-5">
                    {sem.semesterNumber === 1 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={sparklesIcon} alt="Sparkles" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 2 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={dnaIcon} alt="DNA" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 3 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={databaseIcon} alt="Database" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 4 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={computerIcon} alt="Computer" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 5 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={exceptionIcon} alt="Exception" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 6 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={dataScienceIcon} alt="Data Science" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 7 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={hackerIcon} alt="Hacker" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 opacity-90 transition-transform group-hover:scale-105 group-hover:rotate-[2deg]">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#F24E1E]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#A259FF]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FF7262]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1ABCFE]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0ACF83]" />
                      </div>
                    )}
                  </div>

                  <p className={`text-4xl sm:text-5xl font-black ${colors.numText} mb-1 tracking-tighter font-display-lg`}>
                    {String(sem.semesterNumber).padStart(2, '0')}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 font-display-lg tracking-tight">
                    {sem.name}
                  </h3>

                  <p className="mt-2 text-sm sm:text-[15px] leading-6 text-gray-800 font-medium flex-grow pr-4">
                    {sem.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-white/70 text-gray-900 shadow-sm border border-white tracking-wide">
                      {sem.resourcesCount}
                    </span>
                    <div className={`bg-white/80 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-sm`}>
                      <span className={`material-symbols-outlined ${colors.numText} text-[20px] leading-none m-0 p-0`}>
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section — matching Resources page CTA box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="relative rounded-[32px] overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #050E2B 0%, #091742 50%, #0F2D8A 100%)' }}
        >
          {/* Top-Left Amber Ring */}
          <div className="absolute top-6 left-6 w-7 h-7 rounded-full border-[3.5px] border-amber-400 opacity-90 pointer-events-none" />

          {/* Bottom-Left Blue Glow Circle */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-600/30 blur-xl pointer-events-none" />

          {/* Paper Airplane + S-Curve Dashed Trail */}
          <div className="absolute bottom-0 left-0 h-[88%] max-h-full w-auto pointer-events-none z-0 sm:z-10 flex items-end opacity-20 sm:opacity-95">
            <img
              src="/images/paper-airplane-trail.png"
              alt="Paper Airplane Trail"
              className="h-full w-auto object-contain object-bottom"
            />
          </div>

          {/* Top-Right Royal Blue Circle */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#1350E8] opacity-90 pointer-events-none" />

          {/* Top-Right Yellow Dot Matrix Grid (5x5) */}
          <div className="absolute top-7 right-8 pointer-events-none hidden sm:block z-10">
            <svg className="w-32 h-24" viewBox="0 0 100 80">
              <pattern id="cta-yellow-dots-sem" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="2.2" fill="#FBBF24" />
              </pattern>
              <rect width="100" height="80" fill="url(#cta-yellow-dots-sem)" />
            </svg>
          </div>

          {/* Bottom-Right Amber/Yellow Burst Circle */}
          <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-14 md:py-20 text-center max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-[38px] font-black text-white leading-tight tracking-tight">
              Can&apos;t find{' '}
              <span className="relative inline-block">
                what you&apos;re looking for?
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
              Our community is constantly updating the resource library. If a specific paper or note is missing, let us know and we&apos;ll track it down for you.
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

              {/* Whatsapp Community button */}
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border-2 border-white/40 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg leading-none">groups</span>
                <span>Join Whatsapp Community</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Semesters;
