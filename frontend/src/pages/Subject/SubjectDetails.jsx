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
    <div className="pt-20 min-h-screen bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-white">
      <main className="relative py-12 max-w-container-max mx-auto px-margin-mobile md:px-gutter">

        {/* Breadcrumb Navigation */}
        <div className="relative z-10 mb-12">
          <nav className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary overflow-x-auto whitespace-nowrap no-scrollbar">
            <Link to="/" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/resources" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Resources</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/semesters" className="hover:text-amber-600 opacity-70 transition-colors font-medium">
              {subject.department?.code || 'CE'}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to={`/semesters/${subject.semester?.id || ''}`} className="hover:text-amber-600 opacity-70 transition-colors font-medium">
              Semester {subject.semester?.semesterNumber || ''}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-black font-extrabold">{subject.title}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#FEF3D6] text-black border-2 border-amber-400 shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[36px] text-black">{subject.icon || 'folder'}</span>
            </div>
            <div>
              <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-black mb-2 font-black text-3xl sm:text-4xl">
                {subject.title} {subject.code ? `(${subject.code})` : ''}
              </h1>
              <p className="font-body-lg text-body-lg text-gray-600 max-w-3xl leading-relaxed font-medium">
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
                className={`glass-card p-6 rounded-[24px] border-2 text-left flex flex-col relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer active-press ${isSelected
                    ? 'border-black ring-4 ring-amber-400/30 shadow-md bg-black text-white'
                    : 'border-amber-300/80 hover:border-black bg-white'
                  }`}
              >
                <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xs border ${isSelected
                    ? 'bg-amber-400 text-black border-black scale-105'
                    : 'bg-[#FEF3D6] text-black border-amber-300 group-hover:bg-amber-400 group-hover:scale-105'
                  }`}>
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <h3 className={`font-bold text-xl mb-2 tracking-tight ${isSelected ? 'text-white' : 'text-black'}`}>{cat.title}</h3>
                <p className={`text-sm mb-6 flex-grow leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>{cat.desc}</p>
                <div className={`flex items-center justify-between font-button text-sm transition-all font-bold mt-auto w-full pt-4 border-t ${isSelected ? 'border-white/15 text-amber-400' : 'border-amber-200/80 text-black group-hover:text-amber-600'
                  }`}>
                  <span>View Materials</span>
                  <div className="flex items-center gap-2">
                    {catCount > 0 && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-2xs border ${isSelected ? 'bg-amber-400 text-black border-amber-400' : 'bg-[#FEF3D6] text-black border-amber-300'
                        }`}>
                        {catCount}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Resources Subsection */}
        <div ref={resourcesPanelRef} className="scroll-mt-6 glass-card rounded-[28px] p-6 sm:p-10 border-2 border-amber-300/80 shadow-md min-h-[300px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-200">
            <h2 className="text-2xl font-black text-black flex items-center gap-2 tracking-tight">
              <span className="material-symbols-outlined text-amber-500 text-3xl">folder_open</span>
              {selectedCategory}
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setShowUpload(true)}
                className="btn-black-yellow px-4 py-2 rounded-xl text-sm font-extrabold cursor-pointer active-press"
              >
                <span className="material-symbols-outlined text-[16px] mr-1">upload_file</span>
                Contribute
              </button>
              <span className="text-sm bg-black text-amber-400 border border-amber-400 px-3.5 py-1 rounded-full font-extrabold shadow-2xs">
                {resourcesLoading ? '...' : filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {resourcesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border-2 border-amber-200 p-6 rounded-2xl animate-pulse space-y-4">
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
                    className="border-2 border-amber-300/80 hover:border-black p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group active-press"
                  >
                    <div>
                      <h3 className="font-black text-lg text-black mb-2 flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-500 text-[20px] mt-0.5">{fileIcon}</span>
                        {res.title}
                      </h3>
                      {res.description && (
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed font-medium">
                          {res.description}
                        </p>
                      )}
                      <div className="flex items-center flex-wrap gap-2 mb-4">
                        {res.source && (
                          <span className="inline-flex items-center gap-1 text-xs text-black font-semibold bg-[#FEF3D6] border border-amber-300 px-2.5 py-1 rounded-lg">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                            {res.source}
                          </span>
                        )}
                        {res.createdAt && (
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/resource/${res.id}`}
                        state={{ resource: res }}
                        className="btn-black-yellow px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 active-press"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Material
                      </Link>
                      <a
                        href={href}
                        download
                        className="inline-flex items-center justify-center gap-1.5 bg-[#FEF3D6] border-2 border-amber-400 text-black hover:bg-amber-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active-press"
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
