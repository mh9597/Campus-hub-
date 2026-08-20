import React, { useState } from 'react';

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sneha Mehta',
      role: 'CSE, 2nd Year',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      comment: 'PYQs and practicals are super helpful. It made my exam prep so much easier!',
      rating: 5,
    },
    {
      name: 'Niharika',
      role: 'CSE, 2nd Year',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: 'Accessing structured notes and question banks saved me so much time before end-sems.',
      rating: 5,
    },
    {
      name: 'Vraj Mehta',
      role: 'CSE, 4th Year',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      comment: 'CampusHub has all the resources I need. From notes to internships – everything in one place!',
      rating: 5,
    },
    {
      name: 'Astha Adesara',
      role: 'CSE, 3rd Year',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      comment: 'The organized semester resources and free platforms make self-study super efficient!',
      rating: 5,
    },
    {
      name: 'Astha Kachhadiya',
      role: 'B.Pharm, 3rd Year',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      comment: 'The free courses and opportunities section is a game changer for students!',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Maximum scroll index depending on screen size (showing up to 3 cards visible)
  const maxIndex = Math.max(0, testimonials.length - 3);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              What <span className="relative inline-block text-amber-500">
                Students
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span> Say
            </h2>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white border border-amber-200 text-hub-navy flex items-center justify-center shadow-md hover:bg-amber-400 hover:border-amber-400 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white border border-amber-200 text-hub-navy flex items-center justify-center shadow-md hover:bg-amber-400 hover:border-amber-400 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="overflow-hidden py-2 -my-2">
          <div
            className="flex transition-transform duration-500 ease-out gap-6 lg:gap-8"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
            }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)] shrink-0 bg-white rounded-[28px] p-6 sm:p-8 border border-amber-100/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
              >
                {/* Gold Quote Mark Top Right */}
                <div className="absolute top-6 right-6 text-amber-400 text-4xl font-serif font-black opacity-80 leading-none select-none">
                  ‟
                </div>

                <div>
                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-hub-navy">{t.name}</h4>
                      <p className="text-xs font-semibold text-gray-400">{t.role}</p>

                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm fill-current">
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mt-2">
                    "{t.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default TestimonialsSection;
