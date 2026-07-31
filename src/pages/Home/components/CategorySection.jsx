import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CategorySection() {
  const categories = [
    {
      id: 'notes',
      icon: 'edit_note',
      title: 'Notes',
      desc: 'Over 2500 Files',
    },
    {
      id: 'pyqs',
      icon: 'description',
      title: 'PYQs',
      desc: 'Previous Year Papers',
    },
    {
      id: 'practicals',
      icon: 'science',
      title: 'Practicals',
      desc: 'Lab Manuals',
    },
    {
      id: 'viva',
      icon: 'forum',
      title: 'Viva',
      desc: 'Imp Questions',
    },
    {
      id: 'qbank',
      icon: 'quiz',
      title: 'Q-Bank',
      desc: 'Bank of questions',
    },
  ];

  // Tripled categories array to guarantee seamless infinite wrapping in both directions
  const displayItems = [...categories, ...categories, ...categories];
  const count = categories.length;

  const [currentIndex, setCurrentIndex] = useState(count);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const handleNext = () => {
    if (!isTransitioning) setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= count * 2) {
      setIsTransitioning(false);
      setCurrentIndex(count);
    } else if (currentIndex < count) {
      setIsTransitioning(false);
      setCurrentIndex(count * 2 - 1);
    }
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous category"
            className="absolute left-0 -ml-4 lg:-ml-6 bg-white border border-amber-200 text-hub-navy p-2.5 rounded-full shadow-lg z-20 flex items-center justify-center hover:bg-amber-400 hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>

          {/* Infinite Wrapping Carousel Track Container */}
          <div className="w-full overflow-hidden py-4 -my-4">
            <div
              onTransitionEnd={handleTransitionEnd}
              className={`flex gap-4 sm:gap-6 ${
                isTransitioning ? 'transition-transform duration-500 ease-out' : ''
              }`}
              style={{
                transform: `translateX(calc(-${currentIndex} * (100% / 5 + 1.2rem)))`,
              }}
            >
              {displayItems.map((cat, idx) => (
                <Link
                  key={`${cat.id}-${idx}`}
                  to={`/resources?category=${encodeURIComponent(cat.title.toLowerCase())}`}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] shrink-0 bg-white p-5 sm:p-6 rounded-[24px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl flex flex-col items-center justify-between border-2 border-amber-100/80 hover:border-hub-navy group"
                >
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 bg-amber-100 text-amber-600 group-hover:bg-amber-400 group-hover:text-hub-navy">
                      <span className="material-symbols-outlined text-2xl font-bold">{cat.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-hub-navy group-hover:text-amber-600 transition-colors">{cat.title}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next category"
            className="absolute right-0 -mr-4 lg:-mr-6 bg-white border border-amber-200 text-hub-navy p-2.5 rounded-full shadow-lg z-20 flex items-center justify-center hover:bg-amber-400 hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>

        </div>
      </div>
    </section>
  );
}

export default CategorySection;
