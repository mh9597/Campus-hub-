import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSemesterById } from '../../hooks/useSemesterById';
import { SubjectCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { motion } from 'framer-motion';


function SemesterDetails() {
  const { id } = useParams();
  const semesterId = parseInt(id, 10);
  const navigate = useNavigate();

  const { semester, loading, error, refetch } = useSemesterById(semesterId);

  // Hard redirect for invalid numeric ids (not loading, not error, no semester found)
  if (!loading && !error && !semester) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="pt-20 min-h-screen bulletin-board-bg text-on-surface font-body-md selection:bg-primary-container selection:text-white">
      <main>
        {/* Header Section */}
        <section className="relative pt-12 pb-6 max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          {/* Breadcrumb Navigation */}
          <div className="relative z-10 mb-8">
          <nav className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
            <Link to="/" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/resources" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Resources</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/semesters" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Computer Engineering</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-black font-extrabold">
              {loading ? '...' : (semester?.name ?? `Semester ${semesterId}`)}
            </span>
          </nav>
          
          <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-black mb-4 font-black text-4xl">
            {loading ? <span className="inline-block w-48 h-9 rounded bg-gray-200 animate-pulse" /> : semester?.name}
          </h1>
          <p className="font-body-lg text-body-lg text-gray-600 max-w-2xl leading-relaxed font-medium">
            Choose a subject to access Notes, Previous Year Papers, Practical Files, Viva Questions, Question Banks, and Syllabus.
          </p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} className="my-8" />
        )}

        </section>

        {/* The "Bulletin Board" Grid Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 relative">


          {/* Subjects Grid */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 lg:gap-x-16 lg:gap-y-24 relative z-10 max-w-7xl mx-auto">
          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))}

          {/* Loaded subjects */}
          {!loading && !error && semester?.subjects.map((sub, index) => {
                const folderColors = {
                  green: { frontBg: 'bg-[#00c07f]', badgeBg: 'bg-[#009b66]', btnText: '#00c07f' },
                  blue: { frontBg: 'bg-[#2b7cff]', badgeBg: 'bg-[#185adb]', btnText: '#2b7cff' },
                  yellow: { frontBg: 'bg-[#f78b00]', badgeBg: 'bg-[#cf7400]', btnText: '#f78b00' }, 
                  purple: { frontBg: 'bg-[#a335ff]', badgeBg: 'bg-[#811bd6]', btnText: '#a335ff' },
                  orange: { frontBg: 'bg-[#f78b00]', badgeBg: 'bg-[#cf7400]', btnText: '#f78b00' },
                  pink: { frontBg: 'bg-[#f4268a]', badgeBg: 'bg-[#cd106d]', btnText: '#f4268a' },
                  rose: { frontBg: 'bg-[#f4268a]', badgeBg: 'bg-[#cd106d]', btnText: '#f4268a' },
                  cyan: { frontBg: 'bg-[#00c07f]', badgeBg: 'bg-[#009b66]', btnText: '#00c07f' },
                };
                
                const c = folderColors[sub.pinColor] || folderColors['blue'];
                
                const countStr = sub.resourcesCount || '0+ Resources';
                const countParts = countStr.split(' ');
                const resNum = countParts[0] || '0+';
                const resText = countParts.slice(1).join(' ') || 'Resources';

                return (
                  <motion.div
                    key={sub.code || index}
                    drag
                    dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                    dragElastic={0.2}
                    whileHover={{ scale: 1.02, y: -4, zIndex: 30 }}
                    whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: 'grabbing' }}
                    onClick={(e) => {
                      if (!e.defaultPrevented) navigate(`/subject/${sub.code.toLowerCase()}`);
                    }}
                    className="group relative w-full sm:w-[calc(50%-16px)] lg:w-[32%] max-w-[420px] h-[240px] cursor-grab active:cursor-grabbing flex flex-col items-center justify-end mt-12 mb-4"
                  >
                    <div className="file relative w-full h-full cursor-pointer origin-bottom [perspective:1500px] z-50">
                      
                      {/* BACK FOLDER (work-5) */}
                      <div className={`work-5 absolute inset-0 ${c.frontBg} rounded-[20px] rounded-tl-none origin-bottom transition-all ease duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]`}>
                        {/* Tab */}
                        <div className={`absolute bottom-[99%] left-0 w-[35%] h-[28px] ${c.frontBg} rounded-t-xl`} />
                      </div>

                      {/* LEFT PAPER (work-4) */}
                      <div className="work-4 absolute top-[6%] bottom-[15%] left-[4%] w-[34%] bg-[#f8f9fa] rounded-t-xl transition-all ease duration-300 origin-bottom group-hover:-translate-y-8 flex flex-col pt-3 pl-4 pr-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border border-gray-200 border-b-0">
                         <span className="text-[10px] text-gray-800 font-extrabold tracking-wide mb-0.5">Code</span>
                         <span className="text-[17px] text-gray-900 font-black tracking-tighter leading-none">{sub.code}</span>
                      </div>
                      
                      {/* RIGHT PAPER (work-3) */}
                      <div className="work-3 absolute top-[6%] bottom-[15%] right-[4%] w-[56%] bg-[#f8f9fa] rounded-t-xl transition-all ease duration-300 origin-bottom group-hover:-translate-y-12 flex flex-col pt-3 pl-4 pr-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border border-gray-200 border-b-0">
                         <span className="text-[10px] text-gray-800 font-extrabold tracking-wide mb-0.5">Details</span>
                         <span className="text-[14px] text-gray-900 font-black tracking-tight leading-[1.1] line-clamp-2 pr-2">{sub.title}</span>
                      </div>

                      {/* FRONT COVER (work-1) */}
                      <div className={`work-1 absolute bottom-0 left-0 w-full h-[80%] ${c.frontBg} rounded-[20px] transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-46deg)_translateY(2px)] flex flex-col pt-3 pb-3 px-4 overflow-hidden shadow-[0_-4px_12px_rgba(0,0,0,0.15)]`}>
                        
                        {/* Resource Badge (Top Right) */}
                        <div className={`absolute top-0 right-0 w-[90px] h-[65px] ${c.badgeBg} rounded-bl-[24px] flex flex-col items-center justify-center pt-1 z-30`}>
                           <span className="text-white font-black text-[22px] leading-none drop-shadow-sm">{resNum}</span>
                           <span className="text-white font-black text-[11px] leading-tight tracking-wide mt-0.5 drop-shadow-sm">{resText}</span>
                           <span className="text-white/90 font-black text-[7px] uppercase tracking-widest mt-0.5 drop-shadow-sm">ITEMS</span>
                        </div>

                        {/* Content */}
                        <h3 className="text-white font-black text-[20px] mb-1 pr-20 line-clamp-2 tracking-tight drop-shadow-sm leading-tight shrink-0">
                          {sub.title}
                        </h3>
                        
                        <div className="flex gap-2 flex-wrap mt-1">
                          {/* Default "Badge" Style (White background) */}
                          <span className={`px-2.5 py-[3px] rounded-full text-[10px] font-bold bg-white shadow-sm tracking-wide`} style={{ color: c.btnText }}>
                            {sub.code}
                          </span>
                          {/* "Secondary" Style (Translucent dark background) */}
                          <span className={`px-2.5 py-[3px] rounded-full text-[10px] font-bold text-white bg-black/20 shadow-sm tracking-wide line-clamp-1 max-w-[200px] border border-white/10 backdrop-blur-sm`}>
                            {sub.description}
                          </span>
                        </div>

                        {/* Resource Badges */}
                        <div className="flex gap-1 mt-auto mb-1 overflow-x-auto w-full pb-1 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                           {[
                             { label: "Notes", icon: "📄" },
                             { label: "PYQs", icon: "🔗" },
                             { label: "Practicals", icon: "⚗" },
                             { label: "Viva", icon: "💬" },
                             { label: "Syllabus", icon: "▣" },
                           ].map((item) => (
                             <span key={item.label} className="shrink-0 bg-white/20 border border-white/10 backdrop-blur-md text-white rounded-full flex items-center px-2 py-[3px] text-[9px] font-bold gap-[3px] shadow-sm">
                               <span className="text-[10px] opacity-90">{item.icon}</span>
                               <span className="opacity-90 tracking-wide">{item.label}</span>
                             </span>
                           ))}
                         </div>

                        {/* Open Subject Button */}
                        <div className="w-full bg-white font-black text-[13px] py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-center mt-2 shrink-0 tracking-wide transition-transform active:scale-[0.98]" style={{ color: c.btnText }}>
                          Open Subject
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
          })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SemesterDetails;
