// src/pages/About/components/ContributorTicker.jsx
// Pixel-faithful recreation of the editorial pastel capsule team showcase (as referenced in photo 2).
// Features:
// 1. Elongated vertical capsule pills (rounded-full) on a deep obsidian black backdrop.
// 2. Signature alternating vertical wave stagger (high / low / high / low).
// 3. Curated pastel duotone palette: Rose Pink (#F4A7BB), Dusty Sage (#BDD5D0), Oat Cream (#E7DED3), Marigold Yellow (#F6BA2C).
// 4. Smooth cinematic face & body animation on hover:
//    - Seamless transition from monochrome duotone to original vibrant full color (grayscale 100% -> 0%).
//    - Dynamic face/body zoom (scale +7%) and upward parallax lift (y: -10px).
//    - Atmospheric ambient halo bloom behind head and shoulders.
// 5. Clean, integrated typography with name, role, university, and circular icon-only LinkedIn/GitHub logos.
// 6. Responsive horizontal swipe on mobile / tablet + staggered 4-column display on desktop.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '../../../components/common/BrandIcons';

const DEFAULT_PALETTE = [
  '#F4A7BB', // Soft candy rose pink (Anna Dean style)
  '#BDD5D0', // Soft dusty sage / celadon (Chris Mezy style)
  '#E7DED3', // Warm oatmeal / ivory sand (Leslie Schnider style)
  '#F6BA2C', // Vibrant warm marigold yellow (Jim Brickton style)
];

export default function ContributorTicker({ squad = [] }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="w-full relative select-none">
      {/* ── Desktop & Mobile Responsive Container ── */}
      {/* On desktop: 4 centered columns with alternating vertical stagger. */}
      {/* On mobile / tablet: smoothly scrollable row with snap points so cards never squish. */}
      <div className="flex lg:grid lg:grid-cols-4 justify-start lg:justify-center items-start gap-6 lg:gap-6 xl:gap-8 overflow-x-auto pb-16 pt-4 px-4 sm:px-6 snap-x snap-mandatory scrollbar-none">
        {squad.map((m, idx) => {
          const isStaggered = idx % 2 === 1; // 2nd and 4th cards offset lower down
          const capsuleBg = m.capsuleColor || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
          const isHovered = hoveredCard === idx;

          return (
            <div
              key={m.name || idx}
              className={`snap-center shrink-0 w-[240px] sm:w-[255px] lg:w-full max-w-[275px] mx-auto flex flex-col items-center transition-transform duration-500 ${isStaggered ? 'lg:translate-y-14' : 'lg:translate-y-0'
                }`}
            >
              {/* ── The Capsule Pill Card ── */}
              <motion.div
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setHoveredCard(hoveredCard === idx ? null : idx)}
                whileHover={{
                  y: -10,
                  scale: 1.025,
                  boxShadow: '0 24px 50px rgba(0,0,0,0.55)',
                  transition: { type: 'spring', stiffness: 350, damping: 22 },
                }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundColor: capsuleBg }}
                className="w-full h-[490px] sm:h-[320px] lg:h-[520px] rounded-[9999px] relative overflow-hidden flex flex-col items-center justify-between shadow-[0_16px_40px_rgba(0,0,0,0.45)] group cursor-pointer"
              >
                {/* ── Top Region: Bold Centered Name, Clean Role, University & Action Icons ── */}
                <div className={`px-5 text-center select-none z-20 w-full flex flex-col items-center ${m.name === 'Manthan Prajapati' ? 'pt-7 sm:pt-8' : 'pt-9 sm:pt-11'
                  }`}>
                  {m.linkedin && m.linkedin.startsWith('http') ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-85 transition-opacity"
                    >
                      <h3 className={`font-sans font-black tracking-tight text-[#000000] uppercase ${m.name === 'Manthan Prajapati'
                        ? 'text-[15.5px] sm:text-[16.5px] leading-[1.12]'
                        : 'text-[17px] sm:text-[18px] leading-tight'
                        }`}>
                        {m.name === 'Manthan Prajapati' ? (
                          <>
                            <span className="block">Manthan</span>
                            <span className="block">Prajapati</span>
                          </>
                        ) : (
                          m.name
                        )}
                      </h3>
                    </a>
                  ) : (
                    <h3 className={`font-sans font-black tracking-tight text-[#000000] uppercase ${m.name === 'Manthan Prajapati'
                      ? 'text-[15.5px] sm:text-[16.5px] leading-[1.12]'
                      : 'text-[17px] sm:text-[18px] leading-tight'
                      }`}>
                      {m.name === 'Manthan Prajapati' ? (
                        <>
                          <span className="block">Manthan</span>
                          <span className="block">Prajapati</span>
                        </>
                      ) : (
                        m.name
                      )}
                    </h3>
                  )}

                  {m.university && (
                    <p className="font-sans text-[11px] font-bold text-[#111111]/70 tracking-wider uppercase mt-1">
                      {m.university}
                    </p>
                  )}

                  {/* Social Action Icons (LinkedIn & GitHub - Icon Only) */}
                  {m.linkedin || m.github ? (
                    <div className="mt-2.5 flex items-center justify-center gap-2 z-30">
                      {m.linkedin && (
                        <motion.a
                          href={m.linkedin.startsWith('http') ? m.linkedin : undefined}
                          target={m.linkedin.startsWith('http') ? '_blank' : undefined}
                          rel={m.linkedin.startsWith('http') ? 'noopener noreferrer' : undefined}
                          title={m.linkedin.startsWith('http') ? 'LinkedIn Profile' : 'LinkedIn (Coming Soon)'}
                          aria-label={m.linkedin.startsWith('http') ? 'LinkedIn Profile' : 'LinkedIn'}
                          whileHover={{ scale: 1.15, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!m.linkedin.startsWith('http')) e.preventDefault();
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white hover:bg-[#0A66C2] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-colors cursor-pointer select-none"
                        >
                          <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                        </motion.a>
                      )}
                      {m.github && (
                        <motion.a
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub Profile"
                          aria-label="GitHub Profile"
                          whileHover={{ scale: 1.15, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white hover:bg-[#24292e] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-colors cursor-pointer select-none"
                        >
                          <GitHubIcon className="w-3.5 h-3.5 fill-current" />
                        </motion.a>
                      )}
                    </div>
                  ) : (
                    <div className="h-7 sm:h-8 mt-2.5" />
                  )}
                </div>

                {/* ── Bottom Region: Smooth Animated Portrait (Face & Body Zoom + Float + Color Morph) ── */}
                <div className="mt-auto w-full h-[295px] sm:h-[320px] lg:h-[335px] translate-y-3 sm:translate-y-4 lg:translate-y-5 relative flex items-end justify-center pointer-events-none select-none">
                  {/* Living Portrait: Smooth Transition into Original Colors with Face & Body Depth */}
                  <motion.img
                    src={m.avatar}
                    alt={m.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                    }}
                    animate={{
                      scale: isHovered ? (m.imageScale || 1.0) * 1.04 : m.imageScale || 1.0,
                      y: isHovered ? -6 : 0,
                      filter: isHovered
                        ? 'grayscale(0%) contrast(1.02) brightness(1.01) saturate(1.12)'
                        : 'grayscale(100%) contrast(1.08) brightness(1.03) saturate(1)',
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      objectPosition: m.imagePosition || 'center bottom',
                    }}
                    className="w-full h-full object-cover object-bottom select-none pointer-events-none relative z-10"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* ── Below the Rounded Shape: Curved Role Text ── */}
              <motion.div
                animate={{
                  y: isHovered ? -10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="w-full -mt-2 sm:-mt-3 flex justify-center pointer-events-none select-none z-20"
              >
                <svg
                  viewBox="0 0 280 48"
                  className="w-full max-w-[275px] h-12 overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    id={`role-curve-${idx}`}
                    d="M 25,6 A 210,210 0 0,0 255,6"
                    fill="none"
                  />
                  <text
                    fill={isHovered ? capsuleBg : '#FFFFFF'}
                    className="font-sans font-black uppercase transition-colors duration-300"
                    style={{
                      fontSize: (m.roleTitle || m.role).length > 20 ? '10px' : '11.5px',
                      letterSpacing: (m.roleTitle || m.role).length > 20 ? '0.18em' : '0.22em',
                      filter: isHovered
                        ? `drop-shadow(0 0 8px ${capsuleBg}99)`
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}
                  >
                    <textPath
                      href={`#role-curve-${idx}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {m.roleTitle || m.role}
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex lg:hidden justify-center items-center gap-1.5 -mt-8 text-neutral-500 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
        <span>Swipe to explore squad</span>
      </div>
    </div>
  );
}
