import { useParams, Link, Navigate } from 'react-router-dom';
import { useSemesterById } from '../../hooks/useSemesterById';
import { SubjectCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';

function SemesterDetails() {
  const { id } = useParams();
  const semesterId = parseInt(id, 10);

  const { semester, loading, error, refetch } = useSemesterById(semesterId);

  // Check if it's Semester 5 (renders modern grid style instead of bulletin board)
  const isModernGrid = semesterId === 5;

  // Hard redirect for invalid numeric ids (not loading, not error, no semester found)
  if (!loading && !error && !semester) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className={`min-h-screen ${isModernGrid ? 'bg-background' : 'bulletin-board-bg'} text-on-surface font-body-md selection:bg-primary-container selection:text-white`}>
      <main className="relative py-12 max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        
        {/* Subtle Connector Lines SVG for Pin Boards */}
        {!isModernGrid && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" preserveAspectRatio="none" style={{ transform: 'translate(12px, 10px)' }}>
            <path className="connector-path" d="M 200,200 Q 400,100 600,300 T 1000,500" fill="none" stroke="#1E293B" strokeWidth="2"></path>
            <path className="connector-path" d="M 800,200 Q 600,400 400,200 T 100,600" fill="none" stroke="#1E293B" strokeWidth="2"></path>
            <path className="connector-path" d="M 1000,800 Q 800,1000 600,800 T 200,1000" fill="none" stroke="#1E293B" strokeWidth="2"></path>
          </svg>
        )}

        {/* Breadcrumb Navigation */}
        <div className="relative z-10 mb-12">
          <nav className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
            <Link to="/" className="hover:text-primary opacity-60">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/resources" className="hover:text-primary opacity-60">Resources</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/semesters" className="hover:text-primary opacity-60">Computer Engineering</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">
              {loading ? '...' : (semester?.name ?? `Semester ${semesterId}`)}
            </span>
          </nav>
          
          <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-on-surface mb-4 font-bold text-4xl">
            {loading ? <span className="inline-block w-48 h-9 rounded bg-gray-200 animate-pulse" /> : semester?.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {isModernGrid 
              ? 'Choose a subject to access notes, previous year papers, practical files, viva questions, question banks, and syllabus. Everything you need for academic excellence in one place.'
              : 'Choose a subject to access Notes, Previous Year Papers, Practical Files, Viva Questions, Question Banks, and Syllabus.'
            }
          </p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} className="my-8" />
        )}

        {/* Subjects Grid */}
        <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ${isModernGrid ? '' : 'max-w-7xl'}`}>
          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))}

          {/* Loaded subjects */}
          {!loading && !error && semester?.subjects.map((sub, index) => {
            // Check card type
            if (isModernGrid || sub.cardType === 'premium-card') {
              // Renders modern grid card (like Semester 5)
              const borderColors = {
                primary: 'group-hover:bg-primary text-primary bg-primary-container/10',
                tertiary: 'group-hover:bg-tertiary text-tertiary bg-tertiary-container/10',
                blue: 'group-hover:bg-blue-600 text-blue-600 bg-blue-500/10',
                emerald: 'group-hover:bg-emerald-600 text-emerald-600 bg-emerald-500/10',
              };

              const codeColors = {
                primary: 'text-primary',
                tertiary: 'text-tertiary',
                blue: 'text-blue-600',
                emerald: 'text-emerald-600',
              };

              // Map color scheme based on code/index
              let colorScheme = 'primary';
              if (index % 4 === 1) colorScheme = 'tertiary';
              if (index % 4 === 2) colorScheme = 'blue';
              if (index % 4 === 3) colorScheme = 'emerald';

              const iconClass = borderColors[colorScheme];
              const codeClass = codeColors[colorScheme];

              return (
                <div key={sub.code || index} className="premium-card p-8 rounded-[20px] bg-surface-container-lowest border border-outline-variant/20 flex flex-col h-full relative overflow-hidden group shadow-sm premium-card-hover hover:border-primary/20">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:text-white transition-colors duration-300 ${iconClass}`}>
                    <span className="material-symbols-outlined text-[32px]">
                      {sub.icon || 'book'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-label-lg text-label-lg tracking-widest uppercase font-semibold ${codeClass}`}>
                      {sub.code}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-4">
                    {sub.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow leading-relaxed">
                    {sub.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/10">
                    <span className="font-label-lg text-label-lg text-secondary px-3 py-1 bg-secondary-container/30 rounded-lg">
                      {sub.resourcesCount}
                    </span>
                    <Link to={`/subject/${sub.code.toLowerCase()}`} className="flex items-center gap-2 text-primary font-button text-button hover:gap-4 transition-all duration-300 font-semibold">
                      Open Subject <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            } else {
              // Renders pin board pinned-card (Semesters 1-4, 6-7)
              const pinColors = {
                green: 'text-green-600',
                blue: 'text-blue-500',
                yellow: 'text-yellow-600',
                purple: 'text-purple-500',
                orange: 'text-orange-500',
                pink: 'text-pink-500',
                rose: 'text-rose-500',
                cyan: 'text-cyan-500',
              };

              const codeColors = {
                green: 'text-green-700 bg-green-100',
                blue: 'text-blue-700 bg-blue-100',
                yellow: 'text-yellow-700 bg-yellow-100',
                purple: 'text-purple-700 bg-purple-100',
                orange: 'text-orange-700 bg-orange-100',
                pink: 'text-pink-700 bg-pink-100',
                rose: 'text-rose-700 bg-rose-100',
                cyan: 'text-cyan-700 bg-cyan-100',
              };

              const borderColors = {
                green: 'border-green-200',
                blue: 'border-blue-200',
                yellow: 'border-yellow-200',
                purple: 'border-purple-200',
                orange: 'border-orange-200',
                pink: 'border-pink-200',
                rose: 'border-rose-200',
                cyan: 'border-cyan-200',
              };

              const pinColor = pinColors[sub.pinColor] || 'text-red-500';
              const codeClass = codeColors[sub.pinColor] || 'text-red-700 bg-red-100';
              const borderClass = borderColors[sub.pinColor] || 'border-gray-200';

              return (
                <div
                  key={sub.code || index}
                  className="pinned-card bg-white p-8 rounded-[20px] shadow-sm relative flex flex-col items-center text-center group h-full"
                  style={{
                    transform: `rotate(${sub.rotate || '0deg'})`,
                    backgroundColor: sub.bgColor || '#ffffff',
                  }}
                >
                  {/* Push Pin */}
                  <div className="push-pin absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className={`material-symbols-outlined text-4xl ${pinColor}`} style={{ fontVariationSettings: '"FILL" 1' }}>
                      push_pin
                    </span>
                  </div>
                  
                  {/* Subject Code */}
                  <span className={`font-label-lg text-label-lg px-3 py-1 rounded-full mb-6 font-semibold ${codeClass}`}>
                    {sub.code}
                  </span>

                  {/* Content */}
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-3">
                    {sub.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                    {sub.description}
                  </p>

                  {/* Open Link */}
                  <div className={`mt-auto pt-6 border-t ${borderClass} w-full flex justify-between items-center`}>
                    <span className="text-xs font-semibold text-gray-400">
                      {sub.resourcesCount}
                    </span>
                    <Link to={`/subject/${sub.code.toLowerCase()}`} className="flex items-center gap-2 font-button text-button text-primary hover:gap-3 transition-all font-semibold">
                      Open Subject <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </main>
    </div>
  );
}

export default SemesterDetails;
