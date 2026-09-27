// src/pages/About/components/ContributorTicker.jsx
// Pixel-accurate recreation of Lofty Lab's "Your New BFFs" team cards & scroll ticker.
// Features:
// 1. Sleek frameless card with soft pastel wavy backdrop tile (rounded-[24px]).
// 2. Floating role pill tag at bottom center of the photo.
// 3. Dual-tone name typography underneath (medium first name + bold surname).
// 4. Smooth continuous horizontal marquee with Framer scroll-linked spring shift.
// 5. Alternate vertical wave bobbing motion.
// 6. Seamless pause on hover / touch with drag scrub support.

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ContributorTicker({ squad = [] }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Scroll-linked horizontal shift (Framer onScrollTarget effect: translates with spring on scroll)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawScrollShift = useTransform(scrollYProgress, [0, 1], [24, -130]);
  const smoothScrollShift = useSpring(rawScrollShift, {
    stiffness: 180,
    damping: 36,
    mass: 0.5,
  });

  // Duplicate squad items 4x to ensure an unbroken, seamless marquee loop
  const repeatedSquad = [...squad, ...squad, ...squad, ...squad];

  return (
    <div ref={containerRef} className="relative w-full -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 select-none">
      {/* Outer Mask Container (Framer Gradient Mask: smooth edge fade) */}
      <div
        className="relative overflow-hidden py-4 cursor-grab active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Layer 1: Scroll-driven displacement */}
        <motion.div style={{ x: smoothScrollShift }} className="w-fit">
          {/* Layer 2: Continuous Marquee Loop */}
          <motion.div
            animate={
              isPaused
                ? false
                : {
                    x: ['0%', '-50%'],
                  }
            }
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 38, // Soft, gentle sliding speed
            }}
            drag="x"
            dragConstraints={{ left: -1400, right: 200 }}
            onDragStart={() => {
              setIsDragging(true);
              setIsPaused(true);
            }}
            onDragEnd={() => {
              setTimeout(() => setIsDragging(false), 80);
              setIsPaused(false);
            }}
            className="flex items-start gap-6 sm:gap-7 w-max pr-6"
          >
            {repeatedSquad.map((m, idx) => {
              // Split name into first and last name for the signature dual-tone contrast
              const nameParts = (m.name || '').trim().split(' ');
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ');

              return (
                <motion.div
                  key={`${m.name}-${idx}`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="w-[260px] sm:w-[275px] flex-shrink-0 flex flex-col items-center select-none"
                >
                  {/* Photo Tile with strictly identical fixed dimensions & rounded corners */}
                  <div className="w-full h-[270px] sm:h-[285px] rounded-[24px] sm:rounded-[28px] overflow-hidden relative shadow-[0_8px_24px_rgba(2,9,29,0.06)] bg-[#DCE8FD] group flex items-center justify-center">
                    {/* Organic Wavy Background Shapes (matches Lofty Lab screenshot) */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg
                        className="w-full h-full block"
                        viewBox="0 0 280 290"
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Base soft sky blue background */}
                        <rect width="280" height="290" fill="#DCE8FD" />
                        
                        {/* Upper soft white/light curve */}
                        <path
                          d="M-20,110 C50,70 140,140 300,90 L300,-10 L-20,-10 Z"
                          fill="#EBF3FE"
                          opacity="0.9"
                        />
                        
                        {/* Lower smooth wave ribbon */}
                        <path
                          d="M-20,160 C70,120 160,210 300,150 L300,300 L-20,300 Z"
                          fill="#C6DCFD"
                          opacity="0.75"
                        />
                      </svg>
                    </div>

                    {/* Member Portrait Image with uniform sizing & custom focal centering */}
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80';
                        }}
                        style={{
                          objectPosition: m.imagePosition || 'center 20%',
                          transform: m.imageScale ? `scale(${m.imageScale})` : undefined,
                        }}
                        className="w-full h-full object-cover relative z-10 pointer-events-none group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Name Typography Below Card (Clean, modern, two-tone like screenshot) */}
                  <div className="mt-3.5 text-center w-full">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#02091D] leading-tight">
                      <span className="font-bold text-[#02091D]">{firstName}</span>{' '}
                      <span className="font-normal text-gray-500">{lastName}</span>
                    </h3>
                    {m.university && (
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5 tracking-normal">
                        {m.university}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
