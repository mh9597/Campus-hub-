import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeSearchBar from '../HomeSearchBar';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Community', path: '/community' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm border-amber-200/50' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Left Section: Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-hub-navy text-amber-400 font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border-2 border-amber-400">
              CH
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-hub-navy leading-none tracking-tight">
                Campus<span className="text-amber-500">Hub</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                Your Learning Companion
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Nav Links - Apple Dock Hover Effect */}
        <div 
          className="hidden lg:flex items-center gap-8"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onMouseEnter={() => setHoveredPath(link.path)}
              className={({ isActive }) =>
                `text-sm relative py-1 font-bold transition-colors duration-200 select-none ${
                  isActive ? 'text-hub-navy' : 'text-gray-600 hover:text-hub-navy'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  className="flex flex-col items-center justify-center relative"
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                >
                  <span>{link.name}</span>

                  {/* Apple Dock Hover Sliding Underline */}
                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="dock-hover-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-amber-400 rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* macOS Dock Active Dot Indicator when not hovering */}
                  {isActive && hoveredPath !== link.path && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-xs"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Section: Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-52 lg:w-64">
            <HomeSearchBar size="small" />
          </div>

          {/* Search Mobile Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden w-9 h-9 rounded-full bg-[#F3EFE6] border border-amber-200 flex items-center justify-center text-hub-navy shadow-xs active-press cursor-pointer"
            aria-label="Toggle search"
          >
            <span className="material-symbols-outlined text-lg">
              {isSearchOpen ? 'close' : 'search'}
            </span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) setIsSearchOpen(false);
            }}
            className="lg:hidden p-2 text-hub-navy focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </nav>

      {/* Mobile Inline Search Bar */}
      {isSearchOpen && (
        <div className="sm:hidden bg-[#FDFBF7] border-b border-amber-200/80 px-4 py-3 shadow-md animate-fade-in z-50">
          <HomeSearchBar size="small" />
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-amber-200 px-4 py-4 shadow-lg animate-fade-in z-40">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive
                    ? 'bg-amber-100 text-hub-navy font-bold'
                    : 'text-gray-600 hover:bg-amber-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-2">
              <HomeSearchBar size="small" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
