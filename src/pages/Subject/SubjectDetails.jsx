import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSubjectResources } from '../../hooks/useResources';
import { getSubjectByCode } from '../../services/resources/resourcesApi';
import { ErrorState } from '../../components/ui/ErrorState';
import UploadResourceModal from '../../components/resources/UploadResourceModal';

// Resolve fileUrl — handles both absolute URLs and relative /uploads/ paths
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

function resolveFileUrl(resource) {
  const raw = resource.fileUrl || resource.url || '';
  if (!raw) return '#';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  // Relative path like /uploads/abc.pdf → prepend server origin
  return `${API_ORIGIN}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

// Detect file type from URL for icon display
function getFileIcon(url) {
  if (!url) return 'draft';
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'picture_as_pdf';
  if (lower.includes('.doc') || lower.includes('.docx')) return 'description';
  if (lower.includes('.ppt') || lower.includes('.pptx')) return 'slideshow';
  if (lower.includes('.xls') || lower.includes('.xlsx')) return 'grid_on';
  if (lower.includes('.zip') || lower.includes('.rar')) return 'folder_zip';
  if (lower.includes('.jpg') || lower.includes('.png') || lower.includes('.jpeg')) return 'image';
  return 'draft';
}

function SubjectDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Notes');
  const [subject, setSubject] = useState(null);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const resourcesPanelRef = useRef(null);

  function selectCategory(dbType) {
    setSelectedCategory(dbType);
    // Smooth scroll to the resources panel so users can immediately see results
    setTimeout(() => {
      resourcesPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  // useSubjectResources will fetch based on the actual subject code
  const { resources, loading: resourcesLoading, error, refetch } = useSubjectResources(subject?.code || '');

  useEffect(() => {
    async function fetchSubject() {
      if (!code) return;
      setSubjectLoading(true);
      const data = await getSubjectByCode(code);
      if (data) {
        setSubject(data);
      } else {
        // If subject not found, navigate to 404 or go back
        navigate('/404', { replace: true });
      }
      setSubjectLoading(false);
    }
    fetchSubject();
  }, [code, navigate]);

  const categories = [
    { icon: 'edit_note', title: 'Notes', dbType: 'Notes', desc: 'Handwritten & Typed notes' },
    { icon: 'description', title: 'Previous Year Papers', dbType: 'Previous Year Papers', desc: 'Past university exam papers' },
    { icon: 'biotech', title: 'Practical Files', dbType: 'Practical Files', desc: 'Complete lab records and files' },
    { icon: 'forum', title: 'Viva Questions', dbType: 'Viva Questions', desc: 'Important viva QA for lab' },
    { icon: 'account_balance_wallet', title: 'Question Bank', dbType: 'Question Bank', desc: 'Unit-wise questions' },
    { icon: 'list_alt', title: 'Syllabus', dbType: 'Syllabus', desc: 'Official GTU syllabus document' },
  ];

  const filteredResources = resources.filter(
    (res) => res.resourceType === selectedCategory
  );

  const loading = subjectLoading || resourcesLoading;

  if (subjectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-white">
      <main className="relative py-12 max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        
        {/* Breadcrumb Navigation */}
        <div className="relative z-10 mb-12">
          <nav className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary opacity-60">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/resources" className="hover:text-primary opacity-60">Resources</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/semesters" className="hover:text-primary opacity-60">
              {subject.department?.code || 'CE'}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to={`/semesters/${subject.semester?.id || ''}`} className="hover:text-primary opacity-60">
              Semester {subject.semester?.semesterNumber || ''}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">{subject.title}</span>
          </nav>
          
          <div className="flex items-center gap-6 mb-4">
             <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary-container/10 text-primary shrink-0">
                <span className="material-symbols-outlined text-[36px]">{subject.icon || 'folder'}</span>
             </div>
             <div>
                <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-on-surface mb-2 font-bold text-4xl">
                  {subject.title} {subject.code ? `(${subject.code})` : ''}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                  Select a resource category below to explore study materials for this subject.
                </p>
             </div>
          </div>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.dbType;
            // Count resources per category from live data
            const catCount = resources.filter(r => r.resourceType === cat.dbType).length;
            return (
              <button
                key={idx}
                onClick={() => selectCategory(cat.dbType)}
                className={`premium-card p-6 rounded-[20px] bg-surface-container-lowest border text-left flex flex-col relative overflow-hidden group shadow-sm hover-lift transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/10 shadow-md'
                    : 'border-outline-variant/20 hover:border-primary/20'
                }`}
              >
                <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <h3 className="font-bold text-xl text-on-surface mb-2">{cat.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6 flex-grow">{cat.desc}</p>
                <div className={`flex items-center justify-between font-button text-sm transition-all font-semibold mt-auto w-full pt-4 border-t border-outline-variant/10 ${
                  isSelected ? 'text-primary' : 'text-primary opacity-80 group-hover:opacity-100'
                }`}>
                  <span>View Materials</span>
                  <div className="flex items-center gap-2">
                    {catCount > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {catCount}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Resources Subsection */}
        <div ref={resourcesPanelRef} className="scroll-mt-6 bg-white rounded-[24px] p-8 md:p-10 border border-outline-variant/20 shadow-sm min-h-[300px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <h2 className="text-2xl font-bold text-navy-accent flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_open</span>
              {selectedCategory}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Contribute
              </button>
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                {resourcesLoading ? '...' : filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {resourcesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-outline-variant/20 p-6 rounded-2xl animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-1/3 mt-4"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !resourcesLoading && (
            <ErrorState message={error} onRetry={refetch} className="my-8" />
          )}

          {/* Loaded Resources Grid */}
          {!resourcesLoading && !error && filteredResources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((res) => {
                const href = resolveFileUrl(res);
                const fileIcon = getFileIcon(res.fileUrl || res.url);
                return (
                  <div
                    key={res.id}
                    className="border border-outline-variant/20 p-6 rounded-2xl bg-surface-container-lowest hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-on-surface mb-2 flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">{fileIcon}</span>
                        {res.title}
                      </h3>
                      {res.description && (
                        <p className="text-on-surface-variant text-sm mb-3 leading-relaxed">
                          {res.description}
                        </p>
                      )}
                      <div className="flex items-center flex-wrap gap-2 mb-4">
                        {res.source && (
                          <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium bg-secondary-container/20 px-2 py-1 rounded-lg">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                            {res.source}
                          </span>
                        )}
                        {res.createdAt && (
                          <span className="text-xs text-on-surface-variant">
                            {new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/resource/${res.id}`}
                        state={{ resource: res }}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/95 px-5 py-2.5 rounded-xl text-sm font-button font-semibold transition-all shadow-sm hover:scale-[1.01]"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Material
                      </Link>
                      <a
                        href={href}
                        download
                        className="inline-flex items-center justify-center gap-1.5 bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!resourcesLoading && !error && filteredResources.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant space-y-4">
              <span className="material-symbols-outlined text-6xl text-gray-300 block">folder_off</span>
              <p className="font-bold text-lg">No {selectedCategory} uploaded yet</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Be the first to share study material! Upload your own or request it from the community.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-button text-sm hover:scale-105 transition-transform font-semibold shadow"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  Upload Resource
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/30 text-on-surface px-6 py-2.5 rounded-full font-button text-sm hover:scale-105 transition-transform font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Request Material
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Upload Resource Modal */}
      {showUpload && (
        <UploadResourceModal
          subjectCode={subject?.code}
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default SubjectDetails;
