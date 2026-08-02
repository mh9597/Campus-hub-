import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAllSubjects } from '../services/resources/resourcesApi';

function HomeSearchBar({ size = 'large' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
    ? "w-full bg-white border-2 border-amber-200/80 rounded-2xl py-3.5 pl-14 pr-4 text-sm sm:text-base focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all text-hub-navy placeholder:text-gray-400 font-medium shadow-sm hover:shadow-md"
    : "w-full bg-[#F3EFE6] border border-amber-200/80 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white outline-none transition-all text-hub-navy placeholder:text-gray-400 font-medium";

  const iconClasses = size === 'large'
    ? "material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 text-2xl font-bold"
    : "material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg";

  return (
    <div className={`relative w-full ${size === 'large' ? 'max-w-2xl mx-auto' : ''} z-50`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search subjects by name, code, or alias (e.g. DAA)..."
          className={inputClasses}
        />
        <span className={iconClasses}>
          search
        </span>
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></span>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-fade-in max-h-96 overflow-y-auto custom-scrollbar flex flex-col">
          {results.length === 0 && !isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">search_off</span>
              <p className="font-semibold text-hub-navy">No subjects found</p>
              <p className="text-sm mt-1">Try searching by subject code (e.g., CE0516) or acronym (e.g., DAA)</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((subject, index) => (
                <div
                  key={`${subject.code}-${index}`}
                  onClick={() => handleSelect(subject)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-150 ${
                    selectedIndex === index ? 'bg-amber-50 border-transparent' : 'hover:bg-gray-50 border-transparent'
                  } border`}
                >
                  {/* Subject Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold leading-snug ${selectedIndex === index ? 'text-amber-600' : 'text-hub-navy'}`}>
                      {subject.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400 shrink-0">
                        Code: <span className="font-semibold text-gray-500">{subject.code}</span>
                      </p>
                      {/* Tag */}
                      {(subject.semester || subject.department) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
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
