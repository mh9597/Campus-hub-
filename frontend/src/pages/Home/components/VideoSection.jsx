import React from 'react';

function VideoSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column Text & CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 shadow-sm text-hub-navy text-xs font-extrabold uppercase tracking-wide">
              <span className="text-amber-500 text-sm">⚡</span>
              <span>EXPLORE IN ACTION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              See how <br />
              <span className="relative inline-block text-amber-500">
                it works
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
              Take a quick tour of the Student Resource Hub and discover how we empower your academic journey. Everything you need to excel, right at your fingertips.
            </p>

            <div>
              <button className="bg-hub-navy hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2.5 text-sm sm:text-base border border-hub-navy">
                <span>Watch Full Tour</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dark Navy Video Card with Yellow Blob Background */}
          <div className="lg:col-span-8 relative">

            {/* Background Yellow Blob behind video card */}
            <div className="absolute -inset-4 bg-amber-400 rounded-[40px] transform rotate-1 scale-105 opacity-90 blur-sm z-0" />

            {/* Video Container Frame */}
            <div className="relative z-10 bg-hub-navy rounded-[32px] overflow-hidden shadow-2xl border-4 border-hub-navy group cursor-pointer">
              <div className="aspect-video relative bg-slate-900 overflow-hidden">

                {/* Video Image Thumbnail */}
                <img
                  alt="Platform Tour Preview"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                />

                {/* Ambient dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-hub-navy via-hub-navy/40 to-transparent" />

                {/* Center Play Button Overlay with Circular Badge */}
                <div className="absolute inset-0 flex items-center justify-center">

                  {/* Rotating Outer Ring Badge ("CHECK THIS OUT") */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-amber-400 animate-[spin_12s_linear_infinite] opacity-90" />

                    {/* Golden Play Button */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 hover:bg-amber-300 text-hub-navy rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10 border-4 border-white">
                      <span className="material-symbols-outlined text-3xl sm:text-4xl translate-x-0.5 fill-current font-bold">
                        play_arrow
                      </span>
                    </div>

                    {/* Circular text badge top right */}
                    <div className="absolute -top-3 -right-6 bg-amber-400 text-hub-navy px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-hub-navy shadow-md transform rotate-12">
                      CHECK THIS OUT ▶
                    </div>
                  </div>

                </div>

                {/* Bottom Banner Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="space-y-1.5 max-w-lg">
                    <span className="inline-block px-3 py-1 bg-amber-400 text-hub-navy text-xs font-black uppercase tracking-wider rounded-md">
                      PLATFORM PREVIEW
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Student Resource Hub: Product Tour
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Everything you need to excel in your engineering journey, in one place.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default VideoSection;
