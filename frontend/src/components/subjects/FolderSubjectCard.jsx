import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FOLDER_THEMES = {
  lime: { bg: '#c6f62b', frontBg: '#c6f62b', rightTabBg: '#fef08a' },
  emerald: { bg: '#4ade80', frontBg: '#4ade80', rightTabBg: '#dcfce7' },
  sky: { bg: '#38bdf8', frontBg: '#38bdf8', rightTabBg: '#e0f2fe' },
  yellow: { bg: '#facc15', frontBg: '#facc15', rightTabBg: '#fef9c3' },
  orange: { bg: '#fb923c', frontBg: '#fb923c', rightTabBg: '#ffedd5' },
  purple: { bg: '#c084fc', frontBg: '#c084fc', rightTabBg: '#f3e8ff' },
  pink: { bg: '#f472b6', frontBg: '#f472b6', rightTabBg: '#fce7f3' },
  blue: { bg: '#3b82f6', frontBg: '#3b82f6', rightTabBg: '#dbeafe' },
  green: { bg: '#22c55e', frontBg: '#22c55e', rightTabBg: '#dcfce7' },
  rose: { bg: '#f43f5e', frontBg: '#f43f5e', rightTabBg: '#ffe4e6' },
  cyan: { bg: '#22d3ee', frontBg: '#22d3ee', rightTabBg: '#cffafe' },
};

function getFolderTheme(pinColor, bgColor, index) {
  if (pinColor) {
    const key = pinColor.toLowerCase();
    if (FOLDER_THEMES[key]) return FOLDER_THEMES[key];
    if (pinColor.startsWith('#')) {
      return { bg: pinColor, frontBg: pinColor, rightTabBg: '#fef9c3' };
    }
  }
  if (bgColor && bgColor.startsWith('#')) {
    return { bg: bgColor, frontBg: bgColor, rightTabBg: '#fef9c3' };
  }
  const keys = Object.keys(FOLDER_THEMES);
  return FOLDER_THEMES[keys[index % keys.length]] || FOLDER_THEMES.lime;
}

/**
 * FolderSubjectCard
 * Compact, pixel-perfect folder card matching the TikTok Ops Visual / TT Localization Guidelines reference image.
 * Scaled appropriately for multi-card grid layouts.
 */
export default function FolderSubjectCard({ subject, index, semesterNumber = 5 }) {
  const navigate = useNavigate();

  // Helper to extract acronym or prominent title
  const getShortTitle = (title, code) => {
    if (!title) return code || 'SUB';
    const words = title.split(' ').filter(w => !['and', 'of', '&', 'for', 'in', 'to'].includes(w.toLowerCase()));
    if (words.length >= 3 || title.length > 18) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
    return title;
  };

  const shortTitle = getShortTitle(subject.title, subject.code);
  const theme = getFolderTheme(subject.pinColor, subject.bgColor, index);

  // Dynamic resource count computation
  const getResourceCount = () => {
    if (typeof subject?._count?.resources === 'number') {
      return subject._count.resources;
    }
    if (Array.isArray(subject?.resources)) {
      return subject.resources.length;
    }
    if (subject?.resourcesCount) {
      const match = String(subject.resourcesCount).match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return index !== undefined ? index + 1 : 0;
  };

  const resourceCount = getResourceCount();
  const formattedCount = resourceCount < 10 ? `0${resourceCount}+` : `${resourceCount}+`;
  const resourceLabel = `${resourceCount}+ ${resourceCount === 1 ? 'Resource' : 'Resources'}`;

  const handleCardClick = (e) => {
    if (!e.defaultPrevented && subject?.code) {
      navigate(`/subject/${subject.code.toLowerCase()}`);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
      dragElastic={0.12}
      whileHover={{ scale: 1.03, y: -5, zIndex: 40 }}
      whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: 'grabbing' }}
      onClick={handleCardClick}
      className="group relative w-full max-w-[300px] sm:max-w-[330px] cursor-grab active:cursor-grabbing select-none my-4"
    >
      {/* ─── Top Brand Header ─── */}
      <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-black/50 uppercase mb-1.5 px-1">
        <span>{subject.code || 'CE0516'}</span>
        <span>SEM 0{semesterNumber}</span>
      </div>

      {/* ─── Folder Vector Container ─── */}
      <div className="relative w-full aspect-[400/280]">

        {/* SVG Vector Folder Shape */}
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_16px_28px_rgba(0,0,0,0.16)] transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. BACK FOLDER LAYER (Tab + Back body) */}
          <path
            d="M 28 0 
               H 150 
               C 175 0, 185 24, 210 24 
               H 372 
               C 387 24, 398 35, 398 50 
               V 252 
               C 398 267, 387 278, 372 278 
               H 28 
               C 13 278, 2 267, 2 252 
               V 26 
               C 2 11, 13 0, 28 0 Z"
            fill={theme.bg}
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 2. FRONT COVER FLAP LAYER (Front pocket overlapping bottom portion) */}
          <path
            d="M 28 50 
               H 372 
               C 387 50, 398 61, 398 76 
               V 252 
               C 398 267, 387 278, 372 278 
               H 28 
               C 13 278, 2 267, 2 252 
               V 76 
               C 2 61, 13 50, 28 50 Z"
            fill={theme.frontBg}
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* ─── Stacked Right-Side Vertical Tabs (Flush against folder cover edge) ─── */}
        <div className="absolute right-[1px] translate-x-full top-[56%] -translate-y-1/2 flex flex-col gap-1 z-20">
          {[
            { label: 'Syllabus', type: 'syllabus' },
            { label: 'Notes', type: 'notes' },
            { label: 'PYQs', type: 'pyqs' },
          ].map((tab, tIdx) => (
            <div
              key={tIdx}
              onClick={(e) => {
                e.stopPropagation();
                if (subject?.code) {
                  navigate(`/subject/${subject.code.toLowerCase()}?tab=${tab.type}`);
                }
              }}
              className="px-1 py-1.5 sm:py-2 flex items-center justify-center bg-[#fef9c3] hover:bg-amber-300 cursor-pointer border border-l-0 border-black rounded-r-[5px] shadow-[1px_1px_0px_rgba(0,0,0,0.8)] group-hover:translate-x-0.5 transition-all duration-200"
              style={{ writingMode: 'vertical-rl' }}
              title={`View ${tab.label}`}
            >
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-black transform rotate-180 leading-none">
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Center Typography & Content ─── */}
        <div className="absolute inset-x-0 top-[18%] bottom-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-10">
          {/* Main Title */}
          <h2 className="font-black italic text-2xl sm:text-3xl lg:text-[34px] text-black tracking-tight leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
            {shortTitle}
          </h2>

          {/* Subtitle */}
          <p className="font-medium text-[11px] sm:text-xs text-black/80 mt-1.5 max-w-[90%] leading-tight tracking-tight">
            {subject.title}
          </p>

          {/* Resource Count Pill */}
          <span className="inline-block mt-2 text-[9px] sm:text-[10px] font-black tracking-wider text-black/70 bg-black/10 px-2.5 py-0.5 rounded-full border border-black/10 uppercase">
            {resourceLabel}
          </span>
        </div>

        {/* ─── Bottom Left Glass Lens Ring Overlay ─── */}
        <div className="absolute left-[-8px] bottom-[-8px] z-30 pointer-events-none" title={resourceLabel}>
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-[2px] border-white/90 bg-white/20 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,0,0,0.15)] flex items-center justify-center transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-300">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/60 flex items-center justify-center">
              <span className="font-extrabold text-black/70 text-[9px] sm:text-[11px] tracking-tighter">
                {formattedCount}
              </span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
