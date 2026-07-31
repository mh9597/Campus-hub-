import React from 'react';

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Warm Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />

      {/* Top Right Warm Ambient Light */}
      <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-3xl" />

      {/* Middle Soft Glow */}
      <div className="absolute top-[40%] -left-32 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-3xl" />

      {/* Top Left Dots Matrix */}
      <svg className="absolute top-12 left-6 w-28 h-28 text-amber-400 opacity-60" viewBox="0 0 100 100" fill="currentColor">
        <pattern id="dots-tl" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2.5" />
        </pattern>
        <rect x="0" y="0" width="100" height="100" fill="url(#dots-tl)" />
      </svg>

      {/* Top Right Dots Matrix */}
      <svg className="absolute top-16 right-10 w-32 h-24 text-hub-navy opacity-30" viewBox="0 0 100 100" fill="currentColor">
        <pattern id="dots-tr" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" />
        </pattern>
        <rect x="0" y="0" width="100" height="100" fill="url(#dots-tr)" />
      </svg>

      {/* Paper Airplane with looping dashed trail */}
      <div className="absolute top-[180px] sm:top-[210px] lg:top-[230px] -left-10 sm:-left-12 lg:-left-16 w-44 sm:w-60 md:w-72 lg:w-[290px] z-10 pointer-events-none hidden sm:block">
        <img
          src="/images/left-airplane-loop.png"
          alt="Paper Airplane Looping Path"
          className="w-full h-auto opacity-95 drop-shadow-xs"
        />
      </div>

      {/* Wavy lines decorative */}
      <svg className="absolute top-[32%] right-[8%] w-28 h-10 text-amber-500 opacity-70" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M0,15 Q12,2 25,15 T50,15 T75,15 T100,15" />
      </svg>

      <svg className="absolute top-[52%] left-[4%] w-24 h-10 text-amber-400 opacity-60" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M0,15 Q12,2 25,15 T50,15 T75,15 T100,15" />
      </svg>

      {/* Floating Hollow Rings */}
      <div className="absolute top-[18%] left-[12%] w-5 h-5 rounded-full border-[2.5px] border-amber-400 opacity-70 animate-pulse" />
      <div className="absolute top-[28%] right-[18%] w-6 h-6 rounded-full border-[2.5px] border-amber-500 opacity-60" />
      <div className="absolute top-[48%] left-[8%] w-7 h-7 rounded-full border-[2.5px] border-hub-navy opacity-30" />
      <div className="absolute bottom-[30%] right-[12%] w-5 h-5 rounded-full border-[2.5px] border-amber-500 opacity-60" />
      <div className="absolute bottom-[12%] left-[16%] w-6 h-6 rounded-full border-[2.5px] border-amber-400 opacity-70" />

      {/* Crosses (+) */}
      <div className="absolute top-[14%] right-[28%] text-amber-500 opacity-40 font-bold text-xl">×</div>
      <div className="absolute top-[45%] right-[25%] text-amber-400 opacity-50 font-bold text-2xl">×</div>
      <div className="absolute bottom-[28%] left-[22%] text-hub-navy opacity-30 font-bold text-2xl">×</div>

      {/* Dotted pattern near categories */}
      <svg className="absolute top-[42%] right-[4%] w-24 h-24 text-amber-400 opacity-50" viewBox="0 0 100 100" fill="currentColor">
        <pattern id="dots-mid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" />
        </pattern>
        <rect x="0" y="0" width="100" height="100" fill="url(#dots-mid)" />
      </svg>

      {/* Bottom Dotted matrix */}
      <svg className="absolute bottom-[8%] right-[5%] w-28 h-28 text-amber-400 opacity-60" viewBox="0 0 100 100" fill="currentColor">
        <pattern id="dots-btm" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2.5" />
        </pattern>
        <rect x="0" y="0" width="100" height="100" fill="url(#dots-btm)" />
      </svg>
    </div>
  );
}

export default BackgroundDecorations;
