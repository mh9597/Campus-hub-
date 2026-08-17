import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="pt-20 min-h-screen bulletin-board-bg relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center selection:bg-amber-300 selection:text-black overflow-hidden">
      
      {/* ─── Ambient Theme Background Glow & Decor ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl" />

        {/* Decorative Corner Dot Grids */}
        <svg className="absolute top-24 left-10 w-32 h-32 opacity-30" viewBox="0 0 100 100" fill="currentColor">
          <pattern id="dots-404-tl" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" />
          </pattern>
          <rect width="100" height="100" fill="url(#dots-404-tl)" />
        </svg>

        <svg className="absolute bottom-20 right-12 w-36 h-36 opacity-30" viewBox="0 0 100 100" fill="currentColor">
          <pattern id="dots-404-br" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" />
          </pattern>
          <rect width="100" height="100" fill="url(#dots-404-br)" />
        </svg>
      </div>

      {/* ─── Main 404 Glass Card ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 my-12 bg-white/85 backdrop-blur-md border-[2.5px] border-black rounded-3xl p-8 sm:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.12)] max-w-md w-full space-y-6"
      >
        {/* Animated Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-amber-100 border-[2.5px] border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-3">
            <span className="material-symbols-outlined text-6xl text-amber-600 font-extrabold animate-bounce">
              folder_off
            </span>
          </div>
          <span className="absolute -top-2 -right-3 bg-black text-amber-300 font-black text-xs px-2.5 py-1 rounded-full border border-black uppercase tracking-wider shadow-xs">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight italic font-display-lg">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-black/75 max-w-sm mx-auto font-medium leading-relaxed">
            The study resource or page you are looking for has been moved or doesn't exist. Let's get you back on track!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-black-yellow w-full sm:w-auto px-7 py-3 rounded-xl font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] inline-flex items-center justify-center gap-2 active-press text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Go Back Home
          </Link>
          
          <Link
            to="/semesters"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-white text-black border-2 border-black hover:bg-gray-50 shadow-[3px_3px_0px_rgba(0,0,0,0.2)] inline-flex items-center justify-center gap-2 active-press text-sm cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">folder</span>
            View Semesters
          </Link>
        </div>
      </motion.div>

    </div>
  );
}

export default NotFound;
