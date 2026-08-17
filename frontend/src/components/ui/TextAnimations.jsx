import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Editorial Word-by-Word Slide Up Animation
 * Perfect for authoritative headlines (e.g. Academic Resources, Vaults)
 * Does NOT jump letter-by-letter; reveals whole words smoothly from a soft mask.
 */
export function WordReveal({
  text = '',
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.04,
  as: Component = 'span',
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 22,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 180,
      },
    },
  };

  return (
    <Component className={`inline-flex flex-wrap items-baseline ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex flex-wrap items-baseline gap-x-[0.28em]"
      >
        {words.map((word, index) => (
          <motion.span
            key={`w-${index}`}
            variants={wordVariants}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Blur In Text Reveal Animation (Scroll / In-View Triggered)
 * Words or letters transition from an ethereal atmospheric blur into razor-sharp focus.
 */
export function BlurText({
  text = '',
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
  as: Component = 'h2',
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em]"
      >
        {words.map((word, index) => (
          <motion.span
            key={`blur-w-${index}`}
            variants={wordVariants}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Smooth Phrase Fade & Gradient Sheen
 * Adds a glowing ambient light pass over highlighted words.
 */
export function TextGradientSheen({
  children,
  className = '',
  fromColor = '#f59e0b',
  viaColor = '#ea580c',
  toColor = '#d97706',
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative inline-block text-transparent bg-clip-text bg-gradient-to-r ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${fromColor} 0%, ${viaColor} 50%, ${toColor} 100%)`,
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Warm Conversational Fade-Scale
 * Designed for community/support/contact desk pages (e.g. "Can't Find What You Need?")
 * Gives a friendly, soft entrance with smooth ease-out.
 */
export function ConversationalHeading({
  prefix = '',
  highlight = '',
  className = '',
  highlightClassName = '',
}) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`font-black tracking-tight leading-tight ${className}`}
    >
      <span>{prefix} </span>
      <span className={`relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 ${highlightClassName}`}>
        {highlight}
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
          className="absolute -bottom-1.5 left-0 w-full h-2.5 sm:h-3 text-amber-400/80 pointer-events-none"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 6 Q 50 0 100 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.svg>
      </span>
    </motion.h1>
  );
}

/**
 * Interactive Blur Scroller Component
 * Smooth continuous infinite track with depth-of-field blur on periphery,
 * snap-focus on hover, pause-on-hover, and silky momentum.
 */
export function BlurCategoryScroller({ categories = [] }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Duplicate list to achieve continuous seamless loop
  const displayItems = [...categories, ...categories];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      {/* Left and Right Fade Edge Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-20 pointer-events-none" />

      {/* Infinite Marquee Track */}
      <motion.div
        className="flex items-center gap-5 w-max"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 32,
            ease: 'linear',
          },
        }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {displayItems.map((cat, index) => {
          const isHovered = hoveredId === `${cat.id}-${index}`;
          const isAnotherHovered = hoveredId !== null && !isHovered;

          return (
            <Link
              key={`${cat.id}-${index}`}
              to="/semesters"
              onMouseEnter={() => setHoveredId(`${cat.id}-${index}`)}
              onMouseLeave={() => setHoveredId(null)}
              className={`block w-[320px] sm:w-[360px] p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-300 transform-gpu cursor-pointer ${
                isHovered
                  ? 'border-amber-400 shadow-2xl scale-[1.04] z-30 ring-4 ring-amber-400/15'
                  : isAnotherHovered
                  ? 'border-slate-200/60 opacity-60 filter blur-[1.5px] scale-[0.98]'
                  : 'border-slate-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-13 h-13 rounded-2xl ${cat.color} border flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      {cat.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 mb-3">
                    {cat.desc}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 group">
                    <span>Browse All Semesters</span>
                    <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
