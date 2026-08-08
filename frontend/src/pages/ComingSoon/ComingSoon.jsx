import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function ComingSoon() {
  const [searchParams] = useSearchParams();
  const deptCode = searchParams.get('dept')?.toUpperCase() || 'DEPARTMENT';

  const DEPT_NAMES = {
    CSE: 'Computer Science & Engineering (CSE)',
    IT: 'Information Technology (IT)',
  };

  const deptName = DEPT_NAMES[deptCode] || `${deptCode} Department`;

  return (
    <div className="bg-[#FDFBF7] text-hub-navy font-poppins min-h-[80vh] relative overflow-hidden flex items-center justify-center py-16 px-4 selection:bg-amber-300 selection:text-hub-navy">
      {/* Background Decor SVG Vector Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right dots matrix */}
        <svg className="absolute top-8 right-6 w-32 h-28 opacity-20" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="cs-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#cs-dots-tr)" />
        </svg>

        {/* Floating amber rings */}
        <div className="absolute top-[20%] left-[10%] w-6 h-6 rounded-full border-2 border-amber-400 opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-8 h-8 rounded-full border-2 border-amber-400 opacity-50" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto text-center space-y-8">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3D6] border border-amber-300/80 text-hub-navy text-xs font-extrabold uppercase tracking-widest shadow-sm animate-bounce">
          <span>🚀</span>
          <span>Coming Soon</span>
        </div>

        {/* Icon & Department Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-2 border-amber-200 shadow-xl flex items-center justify-center mx-auto text-amber-500 transform hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-5xl sm:text-6xl">
              {deptCode === 'IT' ? 'dns' : 'laptop_mac'}
            </span>
          </div>
          <span className="absolute -bottom-2 right-0 bg-hub-navy text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-300 uppercase">
            Closed
          </span>
        </div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy tracking-tight leading-tight">
            {deptName}
          </h1>
          <p className="text-amber-600 font-bold text-lg sm:text-xl">
            Study Materials Under Preparation
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
          We are currently organizing and verifying high-quality notes, previous year question papers (PYQs), and lab manuals for <span className="font-semibold text-hub-navy">{deptName}</span>. This department will be unlocked soon!
        </p>

        {/* Action Cards / Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/semesters"
            className="w-full sm:w-auto bg-hub-navy hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg leading-none">memory</span>
            <span>Explore Computer Engineering (CE)</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto border-2 border-hub-navy text-hub-navy hover:bg-hub-navy/5 font-bold px-7 py-3.5 rounded-full transition-all duration-300 text-sm inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg leading-none">mail</span>
            <span>Request Resource</span>
          </Link>
        </div>

        {/* Back to Home Link */}
        <div className="pt-2">
          <Link to="/resources" className="text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to All Resources
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
