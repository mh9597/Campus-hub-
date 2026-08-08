import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAllSubjects } from '../services/resources/resourcesApi';

const PLACEHOLDERS = [
  "Search 'DSA'...",
  "Search 'DBMS'...",
  "Search 'OS Notes'...",
  "Search 'CE0516'...",
  "Search 'Networks'...",
  "Search 'Maths-3'...",
  "Search 'Python'...",
  "Search 'OOP'..."
];

function HomeSearchBar({ size = 'large' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  // Animated sliding placeholder states
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Cycle placeholder with slide animation every 2.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // slide out
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setFade(true); // slide in
      }, 250);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query || query.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const matches = await searchAllSubjects(query);
        setResults(matches);
        setSelectedIndex(-1); // reset selection
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        // Auto-select first if none selected
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (subject) => {
    setIsOpen(false);
    setQuery('');

    // Navigate to subject page. Fallback to code if path doesn't exist
    if (subject.path) {
      navigate(subject.path);
    } else {
      navigate(`/subject/${subject.code.toLowerCase()}`);
    }
  };

  const inputClasses = size === 'large'
    ? "w-full bg-white/90 backdrop-blur-md border-2 border-amber-200/90 rounded-2xl py-4 pl-14 pr-4 text-sm sm:text-base focus:ring-4 focus:ring-amber-400/25 focus:border-amber-400 focus:bg-white outline-none transition-all duration-300 text-hub-navy font-semibold shadow-md hover:shadow-lg focus:shadow-xl"
    : "w-full bg-[#F3EFE6]/90 backdrop-blur-sm border border-amber-200/80 rounded-full py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white outline-none transition-all duration-300 text-hub-navy font-medium shadow-sm hover:shadow";

  const iconClasses = size === 'large'
    ? "material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 text-2xl font-bold z-10 transition-transform duration-300 group-hover:scale-110"
    : "material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10 transition-colors duration-200 group-hover:text-amber-500";

  return (
    <div className={`relative w-full ${size === 'large' ? 'max-w-2xl mx-auto' : ''} z-50`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative flex items-center group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          className={inputClasses}
        />

        {/* Animated Sliding Placeholder Text Overlay */}
        {!query && (
          <div
            className={`absolute pointer-events-none transition-all duration-300 ease-out flex items-center ${size === 'large' ? 'left-14 pr-6 text-sm sm:text-base' : 'left-10 pr-4 text-xs'
              } text-gray-400 font-medium ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
          >
            <span className="truncate">{PLACEHOLDERS[placeholderIndex]}</span>
          </div>
        )}

        <span className={iconClasses}>
          search
        </span>
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin z-10"></span>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-100 shadow-2xl overflow-hidden animate-fade-in max-h-96 overflow-y-auto custom-scrollbar flex flex-col z-50">
          {results.length === 0 && !isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 text-amber-300 animate-bounce">search_off</span>
              <p className="font-semibold text-hub-navy">No subjects found</p>
              <p className="text-sm mt-1 text-gray-500">Try searching by subject code (e.g., CE0516) or acronym (e.g., DAA)</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {results.map((subject, index) => (
                <div
                  key={`${subject.code}-${index}`}
                  onClick={() => handleSelect(subject)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 active-press ${selectedIndex === index ? 'bg-amber-50/90 border-amber-200/80 shadow-sm translate-x-1' : 'hover:bg-gray-50/80 border-transparent'
                    } border`}
                >
                  {/* Subject Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold leading-snug ${selectedIndex === index ? 'text-amber-700' : 'text-hub-navy'}`}>
                      {subject.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400 shrink-0">
                        Code: <span className="font-semibold text-gray-600">{subject.code}</span>
                      </p>
                      {/* Tag */}
                      {(subject.semester || subject.department) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-100/70 text-amber-800 border border-amber-200/50">
                          {subject.department?.code || ''} {subject.semester?.name || ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeSearchBar;
