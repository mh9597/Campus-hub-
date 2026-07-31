import React from 'react';

function FeatureStrip() {
  const features = [
    {
      icon: 'workspace_premium',
      title: 'All Resources',
      desc: 'In One Place',
    },
    {
      icon: 'menu_book',
      title: 'Learn Smarter',
      desc: 'Not Harder',
    },
    {
      icon: 'rocket_launch',
      title: 'Achieve More',
      desc: 'Every Day',
    },
    {
      icon: 'verified_user',
      title: '100% Trusted',
      desc: 'By Students',
    },
  ];

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-amber-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-amber-100">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 ${
                  idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-bold">{feat.icon}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-hub-navy leading-tight">{feat.title}</h4>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureStrip;
