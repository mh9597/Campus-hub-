// src/components/resources/UploadResourceModal.jsx
// Student file submission modal — sends FormData to POST /api/submissions/upload
import { useState, useRef, useCallback, useMemo } from 'react';
import { submitResourceUpload } from '../../services/uploads/uploadsApi';
import { useSemesters } from '../../hooks/useSemesters';

const RESOURCE_TYPES = [
  { value: 'Notes',                label: 'Notes',                icon: 'edit_note' },
  { value: 'Previous Year Papers', label: 'Previous Year Papers', icon: 'description' },
  { value: 'Practical Files',      label: 'Practical Files',      icon: 'biotech' },
  { value: 'Viva Questions',       label: 'Viva Questions',       icon: 'forum' },
  { value: 'Question Bank',        label: 'Question Bank',        icon: 'account_balance_wallet' },
  { value: 'Syllabus',             label: 'Syllabus',             icon: 'list_alt' },
];

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt,.zip';
const MAX_SIZE_MB = 50;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name) {
  const ext = name?.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'picture_as_pdf';
  if (['doc', 'docx'].includes(ext)) return 'description';
  if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
  if (['xls', 'xlsx'].includes(ext)) return 'grid_on';
  if (['zip'].includes(ext)) return 'folder_zip';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
  return 'draft';
}

export default function UploadResourceModal({ subjectCode: initialSubjectCode, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    resourceType: 'Notes',
    description: '',
    subjectCode: initialSubjectCode || '', // Use passed prop or empty
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Fetch subjects for dropdown if no subjectCode is pre-provided
  const { semesters } = useSemesters();
  const allSubjects = useMemo(() => {
    const subjects = [];
    if (semesters) {
      semesters.forEach(sem => {
        if (sem.subjects) {
          sem.subjects.forEach(sub => subjects.push(sub));
        }
      });
    }
    // Remove duplicates based on code
    return Array.from(new Map(subjects.map(s => [s.code, s])).values())
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [semesters]);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File exceeds the ${MAX_SIZE_MB} MB limit.`);
      return;
    }
    setFile(selectedFile);
    setErrorMsg('');
    // Pre-fill title from filename if empty
    if (!form.title) {
      const name = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setForm(f => ({ ...f, title: name }));
    }
  }, [form.title]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, [handleFileSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.title.trim()) { setErrorMsg('Please enter a title.'); return; }
    if (!form.resourceType) { setErrorMsg('Please select a resource type.'); return; }
    if (!form.subjectCode)  { setErrorMsg('Please select a subject.'); return; }
    if (!file)              { setErrorMsg('Please select a file to upload.'); return; }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('subjectCode', form.subjectCode);
    formData.append('resourceType', form.resourceType);
    if (form.description.trim()) {
      formData.append('description', form.description.trim());
    }
    formData.append('file', file);

    setStatus('uploading');
    const interval = setInterval(() => {
      setProgress(p => (p < 85 ? p + 5 : p));
    }, 120);

    try {
      await submitResourceUpload(formData);
      clearInterval(interval);
      setProgress(100);
      setStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1800);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatus('error');
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-poppins">
      <div className="bg-[#121212] rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.15)] w-full max-w-xl border border-[#333] max-h-[95vh] overflow-y-auto custom-scrollbar relative">

        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-6 border-b border-[#333]/60 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-[26px]">upload_file</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white tracking-wide">Contribute a Resource</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Help fellow students by sharing study materials
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center relative z-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-green-400 text-[40px]">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Submitted Successfully!</h3>
            <p className="text-base text-gray-400 max-w-sm leading-relaxed">
              Your resource has been sent for admin review. It will appear once approved — thank you! 🎉
            </p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-7 relative z-10">

            {/* Subject Dropdown - Hidden if already provided */}
            {!initialSubjectCode && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  Subject <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.subjectCode}
                    onChange={(e) => setForm(f => ({ ...f, subjectCode: e.target.value }))}
                    className="w-full px-5 py-3.5 rounded-xl bg-[#1A1A1A] border border-[#333] text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all appearance-none cursor-pointer"
                    disabled={status === 'uploading'}
                  >
                    <option value="" disabled>Select a subject...</option>
                    {allSubjects.map(sub => (
                      <option key={sub.code} value={sub.code}>
                        {sub.title} ({sub.code})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>
            )}

            {/* Resource Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">
                Resource Type <span className="text-amber-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {RESOURCE_TYPES.map(rt => {
                  const isSelected = form.resourceType === rt.value;
                  return (
                    <button
                      key={rt.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, resourceType: rt.value }))}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all duration-300 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-[#121212] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'border-[#333] bg-[#1A1A1A] text-gray-400 hover:border-amber-400/50 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{rt.icon}</span>
                      <span className="text-center leading-tight tracking-wide">{rt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Unit 3 Notes — Data Structures"
                maxLength={255}
                className="w-full px-5 py-3.5 rounded-xl bg-[#1A1A1A] border border-[#333] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                disabled={status === 'uploading'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Description <span className="opacity-50">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief note for reviewers..."
                className="w-full px-5 py-3.5 rounded-xl bg-[#1A1A1A] border border-[#333] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                disabled={status === 'uploading'}
              />
            </div>

            {/* File Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                File <span className="text-amber-500">*</span>
              </label>

              {!file ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 select-none ${
                    dragOver
                      ? 'border-amber-400 bg-amber-400/5 scale-[1.02]'
                      : 'border-[#444] hover:border-amber-400/50 hover:bg-[#1A1A1A]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[48px] transition-colors ${dragOver ? 'text-amber-400' : 'text-gray-600'}`}>cloud_upload</span>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white tracking-wide">
                      Drag &amp; drop or <span className="text-amber-400">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      PDF, DOC, PPT, XLS, Images, ZIP — up to {MAX_SIZE_MB} MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    onChange={e => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4 bg-[#1A1A1A] rounded-2xl border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">
                      {getFileIcon(file.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                    <p className="text-xs text-amber-500 font-medium mt-1">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setProgress(0); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333]">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">
                  <span>Uploading Data…</span>
                  <span className="text-amber-400">{progress}%</span>
                </div>
                <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {(errorMsg || status === 'error') && (
              <div className="flex items-start gap-3 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-medium text-red-400">
                <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">error</span>
                <p>{errorMsg || 'Something went wrong. Please try again.'}</p>
              </div>
            )}

            {/* Info banner */}
            <div className="flex items-start gap-3 px-5 py-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-medium text-blue-400 leading-relaxed">
              <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">info</span>
              <p>Your submission will be reviewed by our team before it appears publicly. This usually takes less than 24 hours.</p>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#333]/60">
              <button
                type="button"
                onClick={onClose}
                disabled={status === 'uploading'}
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#1A1A1A] border border-[#333] text-white hover:bg-[#222] hover:border-gray-500 disabled:opacity-50 transition-all w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'uploading' || !file}
                className="px-8 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-500 text-[#121212] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {status === 'uploading' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px] font-bold">rocket_launch</span>
                    Submit Resource
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
