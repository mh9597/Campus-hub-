import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSemesterById } from '../../hooks/useSemesterById';
import { SubjectCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import FolderSubjectCard from '../../components/subjects/FolderSubjectCard';

function SemesterDetails() {
  const { id } = useParams();
  const semesterId = parseInt(id || '5', 10);
  const navigate = useNavigate();

  const { semester, loading, error, refetch } = useSemesterById(semesterId);

  // Hard redirect for invalid numeric ids (not loading, not error, no semester found)
  if (!loading && !error && !semester) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="pt-20 min-h-screen bulletin-board-bg text-on-surface font-body-md selection:bg-primary-container selection:text-white">
      <main>
        {/* Header Section */}
        <section className="relative pt-12 pb-6 max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          {/* Breadcrumb Navigation */}
          <div className="relative z-10 mb-8">
          <nav className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
            <Link to="/" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/resources" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Resources</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/semesters" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Computer Engineering</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-black font-extrabold">
              {loading ? '...' : (semester?.name ?? `Semester ${semesterId}`)}
            </span>
          </nav>
          
          <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-black mb-4 font-black text-4xl">
            {loading ? <span className="inline-block w-48 h-9 rounded bg-gray-200 animate-pulse" /> : semester?.name}
          </h1>
          <p className="font-body-lg text-body-lg text-gray-600 max-w-2xl leading-relaxed font-medium">
            Choose a subject to access Notes, Previous Year Papers, Practical Files, Viva Questions, Question Banks, and Syllabus.
          </p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} className="my-8" />
        )}

        </section>

        {/* The "Bulletin Board" Grid Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 relative">

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 relative z-10 max-w-7xl mx-auto justify-items-center">
          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))}

          {/* Loaded subjects */}
          {!loading && !error && semester?.subjects.map((sub, index) => (
            <FolderSubjectCard
              key={sub.code || index}
              subject={sub}
              index={index}
              semesterNumber={semester?.semesterNumber || semesterId || 5}
            />
          ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SemesterDetails;
