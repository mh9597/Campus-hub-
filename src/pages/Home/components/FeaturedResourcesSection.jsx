import { Link } from 'react-router-dom';

function FeaturedResourcesSection() {
  const resources = [
    {
      university: 'Nirma University',
      uniColor: 'text-red-600',
      stars: 5,
      title: 'Operating Systems Complete Hand-written Notes',
      desc: 'Comprehensive notes covering CPU scheduling, memory management, and file systems by Semester 4 toppers.',
      views: '1.2K+ Views',
    },
    {
      university: 'GTU',
      uniColor: 'text-blue-700',
      stars: 4,
      title: 'Previous Year Papers: Data Structures (2018-2023)',
      desc: 'A collection of solved and unsolved previous year question papers for Data Structures and Algorithms.',
      views: '850+ Views',
    },
    {
      university: 'IIT Bombay',
      uniColor: 'text-orange-600',
      stars: 5,
      title: 'Advanced Computer Networks Practical Manual',
      desc: 'Verified lab assignments on TCP/UDP, packet sniffing, and network security protocols.',
      views: '2.4K+ Views',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-hub-green/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-hub-navy">Featured Resources</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Access our most downloaded and highest-rated resources curated by top-performing students and educators.
            </p>
          </div>
          <div className="flex gap-2 mt-6 md:mt-0 flex-wrap">
            <button className="px-4 py-2 bg-hub-navy text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer">
              General
            </button>
            <button className="px-4 py-2 bg-white text-hub-navy text-xs font-semibold rounded-lg border border-gray-200 hover:bg-slate-50 transition-all cursor-pointer">
              Featured
            </button>
            <button className="px-4 py-2 bg-white text-hub-navy text-xs font-semibold rounded-lg border border-gray-200 hover:bg-slate-50 transition-all cursor-pointer">
              Verified
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res, index) => (
            <div
              key={index}
              className="bg-hub-cream border-2 border-hub-navy p-5 md:p-6 rounded-custom hover-lift flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-sm font-bold ${res.uniColor}`}>{res.university}</span>
                  <div className="flex text-hub-yellow">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="material-symbols-outlined text-[16px]"
                        style={{
                          fontVariationSettings: `"FILL" ${idx < res.stars ? 1 : 0}`,
                          color: idx < res.stars ? '#FBBF24' : '#D1D5DB',
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-hub-navy leading-snug">{res.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 leading-relaxed">{res.desc}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                <Link
                  to="/resources"
                  className="border-2 border-hub-navy text-hub-navy px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-hub-navy hover:text-white transition-all"
                >
                  View
                </Link>
                <span className="text-xs font-semibold text-gray-400">{res.views}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <Link
            to="/resources"
            className="inline-block bg-hub-navy text-white px-6 py-2.5 rounded-xl text-sm sm:text-base font-semibold hover:bg-opacity-90 transition-all"
          >
            Explore all Resources
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedResourcesSection;
