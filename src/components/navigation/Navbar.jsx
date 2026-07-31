import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const phrases = ["Search notes...", "Search subjects...", "Find PYQs...", "Explore resources..."];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(phrases[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPlaceholder(phrases[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Community', path: '/community' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-100/60 shadow-xs transition-all duration-300">
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

        {/* Center: Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 hover:text-amber-500 relative py-1 ${
                  isActive
                    ? 'text-hub-navy font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:rounded-full'
                    : 'text-gray-600'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Section: Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-52 lg:w-64">
            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-[#F3EFE6] border border-amber-200/80 rounded-full py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white outline-none transition-all text-hub-navy placeholder:text-gray-400 font-medium"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
          </div>

          {/* Search Mobile Toggle */}
          <button className="sm:hidden w-9 h-9 rounded-full bg-[#F3EFE6] border border-amber-200 flex items-center justify-center text-hub-navy shadow-xs">
            <span className="material-symbols-outlined text-lg">search</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-hub-navy focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-amber-200 px-4 py-4 shadow-lg animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-hub-navy font-bold'
                      : 'text-gray-600 hover:bg-amber-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-2">
              <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-white border border-amber-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
