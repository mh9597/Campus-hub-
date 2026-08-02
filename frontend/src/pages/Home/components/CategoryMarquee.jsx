import React from 'react';
import { Link } from 'react-router-dom';

function CategoryMarquee() {
  const displayItems = [
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

  const renderCards = (keyPrefix) => (
    <div className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
      {displayItems.map((cat, idx) => (
        <Link
          key={`${keyPrefix}-${cat.id}-${idx}`}
          to={`/resources?category=${encodeURIComponent(cat.title.toLowerCase())}`}
          className="w-48 sm:w-56 shrink-0 bg-white p-5 sm:p-6 rounded-[24px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl flex flex-col items-center justify-between border-2 border-amber-100/80 hover:border-hub-navy group"
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
  );

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="w-full relative pause-marquee-on-hover">
        {/* Gradients to fade out the edges for a smoother look */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-hub-cream to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-hub-cream to-transparent z-10 pointer-events-none"></div>

        {/* Infinite Marquee Wrapper */}
        <div className="flex w-max animate-marquee" style={{ animationDuration: '90s' }}>
          {renderCards('set1')}
          {renderCards('set2')}
          {renderCards('set3')}
          {renderCards('set4')}
          {renderCards('set5')}
          {renderCards('set6')}
        </div>
      </div>
    </section>
  );
}

export default CategoryMarquee;
