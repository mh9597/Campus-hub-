import { Link } from 'react-router-dom';
import { useSemesters } from '../../hooks/useSemesters';
import { SemesterCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';

function Semesters() {
  const { semesters, loading, error, refetch } = useSemesters();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      {/* Header / Breadcrumb Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-12 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
          <Link to="/" className="hover:text-primary opacity-60">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/resources" className="hover:text-primary opacity-60">Resources</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Computer Engineering</span>
        </nav>
        <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-on-surface mb-4 font-bold text-4xl">
          Computer Engineering Semesters
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Explore study resources for Computer Engineering across all semesters. Access hand-picked notes, papers, and lab manuals.
        </p>
      </section>

      {/* The "Bulletin Board" Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 relative">
        {/* SVG Connectors */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <svg height="100%" preserveAspectRatio="none" viewBox="0 0 1280 800" width="100%">
            <path className="dashed-path opacity-30" d="M250,250 C400,250 400,250 550,250 S850,250 1000,250"></path>
            <path className="dashed-path opacity-30" d="M400,650 C550,650 550,650 700,650 S850,650 1000,650"></path>
            <path className="dashed-path opacity-10" d="M320,300 L320,600"></path>
            <path className="dashed-path opacity-10" d="M960,300 L960,600"></path>
          </svg>
        </div>

        {/* Error state */}
        {error && !loading && (
          <ErrorState
            message={error}
            onRetry={refetch}
            className="max-w-xl mx-auto"
          />
        )}

        {/* Bento Grid */}
        <div className="flex flex-wrap justify-center gap-8 relative z-10">
          {/* Loading: show skeleton placeholders */}
          {loading && Array.from({ length: 7 }).map((_, i) => (
            <SemesterCardSkeleton key={i} />
          ))}

          {/* Loaded: render semester cards */}
          {!loading && !error && semesters.map((sem) => {
            const pinColorClasses = {
              emerald: 'text-emerald-500',
              sky: 'text-sky-500',
              yellow: 'text-yellow-500',
              purple: 'text-purple-500',
              orange: 'text-orange-400',
              cyan: 'text-cyan-500',
              rose: 'text-rose-400',
            };

            const numBgClasses = {
              emerald: 'text-emerald-600',
              sky: 'text-sky-600',
              yellow: 'text-yellow-600',
              purple: 'text-purple-600',
              orange: 'text-orange-600',
              cyan: 'text-cyan-600',
              rose: 'text-rose-600',
            };

            const textClasses = {
              emerald: 'text-emerald-700 bg-emerald-100/50',
              sky: 'text-sky-700 bg-sky-100/50',
              yellow: 'text-yellow-700 bg-yellow-100/50',
              purple: 'text-purple-700 bg-purple-100/50',
              orange: 'text-orange-700 bg-orange-100/50',
              cyan: 'text-cyan-700 bg-cyan-100/50',
              rose: 'text-rose-700 bg-rose-100/50',
            };

            const pinColor = pinColorClasses[sem.pinColor] || 'text-red-500';
            const numColor = numBgClasses[sem.pinColor] || 'text-red-600';
            const badgeColor = textClasses[sem.pinColor] || 'text-red-700 bg-red-100/50';

            return (
              <div
                key={sem.id}
                className="note-card p-8 rounded-[20px] shadow-[0_15px_35px_rgba(30,41,59,0.06)] flex flex-col items-center text-center relative w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] min-h-[420px]"
                style={{
                  backgroundColor: sem.bgColor,
                  transform: `rotate(${sem.rotate})`,
                  animation: `float 3.5s ease-in-out ${sem.id * 0.15}s infinite alternate`,
                  '--rot': sem.rotate,
                }}
              >
                {/* Push Pin */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 push-pin">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    push_pin
                  </span>
                  <span className={`material-symbols-outlined text-4xl absolute inset-0 ${pinColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    push_pin
                  </span>
                </div>

                {/* Number Circle */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm flex-shrink-0">
                  <span className={`font-headline-md text-headline-md font-bold ${numColor}`}>
                    {String(sem.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-headline-md text-headline-md font-bold text-xl mb-2 text-on-surface">
                  {sem.name}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant opacity-80 mb-6 flex-grow">
                  {sem.description}
                </p>
                <span className={`px-4 py-1 rounded-full text-label-lg font-label-lg mb-6 mt-auto block ${badgeColor}`}>
                  {sem.resourcesCount}
                </span>

                {/* Action Link */}
                <Link
                  to={`/semesters/${sem.id}`}
                  className="w-full py-3 bg-on-surface text-white rounded-[16px] font-button text-button hover:bg-primary transition-all duration-200 text-center block font-semibold hover:shadow-md"
                >
                  Explore Semester &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pb-section-gap-lg">
        <div className="bg-primary-container rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-headline-lg text-headline-lg text-on-primary font-bold text-3xl">Can't find what you're looking for?</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 leading-relaxed">
              Our community is constantly updating the resource library. If a specific paper or note is missing, let us know and we'll track it down for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/contact"
                className="font-button text-button bg-on-surface text-white px-10 py-4 rounded-[20px] hover:translate-y-[-4px] transition-all font-semibold shadow-md inline-block text-center"
              >
                Request Resource
              </Link>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-button text-button bg-white text-primary px-10 py-4 rounded-[20px] hover:translate-y-[-4px] transition-all font-semibold shadow-md inline-block text-center"
              >
                Join Whatsapp Community
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}

export default Semesters;
