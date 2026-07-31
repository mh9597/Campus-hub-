// src/components/resources/UploadResourceModal.jsx
// Student file submission modal — sends FormData to POST /api/submissions/upload
import { useState, useRef, useCallback } from 'react';
import { submitResourceUpload } from '../../services/uploads/uploadsApi';

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

export default function UploadResourceModal({ subjectCode, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    resourceType: 'Notes',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

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
    if (!file)              { setErrorMsg('Please select a file to upload.'); return; }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('subjectCode', subjectCode);
    formData.append('resourceType', form.resourceType);
    if (form.description.trim()) {
      formData.append('description', form.description.trim());
    }
    formData.append('file', file);

    setStatus('uploading');
    // Simulate progress (XHR would give real progress; fetch doesn't)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-outline-variant/15 max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/10">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[22px]">upload_file</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-on-surface">Contribute a Resource</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Help fellow students — submit study material for review
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container transition text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-600 text-[36px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Submitted Successfully!</h3>
            <p className="text-sm text-on-surface-variant max-w-xs">
              Your resource has been sent for admin review. It will appear once approved — thank you! 🎉
            </p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

            {/* Resource Type */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Resource Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RESOURCE_TYPES.map(rt => (
                  <button
                    key={rt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, resourceType: rt.value }))}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-semibold transition-all ${
                      form.resourceType === rt.value
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{rt.icon}</span>
                    <span className="text-center leading-tight">{rt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Unit 3 Notes — Data Structures"
                maxLength={255}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
                Description <span className="opacity-50">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief note for reviewers — topics covered, year, etc."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition resize-none"
              />
            </div>

            {/* File Drop Zone */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
                File <span className="text-red-400">*</span>
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
                  className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all select-none ${
                    dragOver
                      ? 'border-primary bg-primary/5 scale-[1.01]'
                      : 'border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[40px] text-primary/60">cloud_upload</span>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-on-surface">
                      Drag &amp; drop or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
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
                <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[28px] shrink-0">
                    {getFileIcon(file.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                    <p className="text-xs text-on-surface-variant">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setProgress(0); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 text-red-400 transition shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {status === 'uploading' && (
              <div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {(errorMsg || status === 'error') && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                <p>{errorMsg || 'Something went wrong. Please try again.'}</p>
              </div>
            )}

            {/* Info banner */}
            <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">info</span>
              <p>Your submission will be reviewed by our team before it appears publicly. This usually takes less than 24 hours.</p>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={status === 'uploading'}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'uploading' || !file}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
              >
                {status === 'uploading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">upload</span>
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
