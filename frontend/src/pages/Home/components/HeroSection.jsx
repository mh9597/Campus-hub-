import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 z-10">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/80 shadow-xs text-hub-navy text-xs font-extrabold uppercase tracking-wide">
              <span className="text-amber-500 text-sm">★</span>
              <span>YOUR LEARNING HUB</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-hub-navy leading-[1.12] tracking-tight">
              Everything a <br className="hidden sm:inline" />
              Student Needs in <br />
              <span className="relative inline-block text-amber-500 mt-1">
                One Platform
                <svg
                  className="absolute -bottom-3 left-0 w-full h-4 text-amber-400 opacity-90 drop-shadow-xs"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M 0 5 Q 50 0 100 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-medium">
              Access Notes, PYQs, Practical Files, Free Courses, Question Banks, Internships, and much more — All in one place. Everything you need to learn, grow, and succeed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/resources"
                className="bg-hub-navy hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2.5 text-sm sm:text-base border border-hub-navy"
              >
                <span>Explore Resources</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                to="/semesters"
                className="bg-white hover:bg-amber-50 text-hub-navy font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow-md border-2 border-amber-300 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Explore Semesters
              </Link>
            </div>

            {/* Hero Stats Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <span className="material-symbols-outlined text-xl">bookmark</span>
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">10K+</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Resources</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <span className="material-symbols-outlined text-xl">group</span>
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">2500+</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Students</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <span className="material-symbols-outlined text-xl">menu_book</span>
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">500+</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Courses</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <span className="material-symbols-outlined text-xl">work</span>
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">100+</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Opportunities</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[620px] lg:max-w-[720px] scale-100 lg:scale-110 transition-transform duration-500">
              <img
                src="/images/hero-student.png"
                alt="Student pointing to resources"
                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
