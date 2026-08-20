// ─── pages/Admin/AdminSubmissionsView.jsx ─────────────────────
// Approval queue: pending student upload submissions & resource requests.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminUploads, reviewUpload,
  getAdminRequests, reviewRequest,
  getAdminCatalog,
} from '../../services/admin/adminApi';

import { API_BASE_URL } from '../../lib/api';

// Admin can view submissions via the backend proxy (no Drive URL exposed)
const buildViewUrl = (id) => `${API_BASE_URL}/resources/${id}/view`;

const STATUS_TABS = ['PENDING', 'APPROVED', 'REJECTED'];

function StatusBadge({ status }) {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function ActionButton({ label, icon, onClick, variant = 'primary', loading }) {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90',
    danger: 'bg-error/10 text-error hover:bg-error hover:text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${variants[variant]}`}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </button>
  );
}

// ── Upload Card ───────────────────────────────────────────────
function UploadCard({ item, onAction, departments, semesters, subjects }) {
  const [busy, setBusy] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    title: item.title || '',
    subjectCode: item.subjectCode || '',
    resourceType: item.resourceType || '',
  });

  const isPending = item.status === 'PENDING';

  async function handle(action) {
    if (action === 'APPROVED' && !isEditing) {
      setIsEditing(true);
      return;
    }
    
    setBusy(true);
    try {
      const data = action === 'APPROVED' ? editForm : undefined;
      await onAction(item.id, action, data);
      setIsEditing(false);
    } finally {
      setBusy(false);
    }
  }

  // Derive selected department and semester from chosen subject
  const currentSubject = subjects.find(s => s.code === editForm.subjectCode);
  const currentSemester = semesters.find(s => s.id === currentSubject?.semesterId);
  
  const [selectedDepartment, setSelectedDepartment] = useState(currentSemester?.departmentId || '');
  const [selectedSemester, setSelectedSemester] = useState(currentSemester?.id || '');

  // Reset dropdowns when subject changes
  useEffect(() => {
    if (currentSubject && currentSemester) {
      setSelectedDepartment(currentSemester.departmentId);
      setSelectedSemester(currentSemester.id);
    }
  }, [currentSubject, currentSemester]);

  const filteredSemesters = semesters.filter(s => s.departmentId === selectedDepartment);
  const filteredSubjects = subjects.filter(s => s.semesterId === selectedSemester);

  const RESOURCE_TYPES = ['Notes', 'Previous Year Papers', 'Practical Files', 'Viva Questions', 'Question Bank', 'Syllabus', 'Other'];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex flex-col gap-3">
      {!isEditing ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface truncate">{item.title}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                <span className="font-medium">{item.subjectCode}</span> · {item.resourceType}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          {item.description && (
            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{item.description}</p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title</label>
            <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 bg-surface-container rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Branch</label>
              <select value={selectedDepartment} onChange={e => { setSelectedDepartment(e.target.value); setSelectedSemester(''); setEditForm(f => ({ ...f, subjectCode: '' })); }}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary">
                <option value="">Select Branch</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Semester</label>
              <select value={selectedSemester} onChange={e => { setSelectedSemester(e.target.value); setEditForm(f => ({ ...f, subjectCode: '' })); }} disabled={!selectedDepartment}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary disabled:opacity-50">
                <option value="">Select Sem</option>
                {filteredSemesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Subject</label>
              <select value={editForm.subjectCode} onChange={e => setEditForm(f => ({ ...f, subjectCode: e.target.value }))} disabled={!selectedSemester}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary disabled:opacity-50">
                <option value="">Select Subject</option>
                {filteredSubjects.map(s => <option key={s.code} value={s.code}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resource Type</label>
              <select value={editForm.resourceType} onChange={e => setEditForm(f => ({ ...f, resourceType: e.target.value }))}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border-0 text-sm focus:ring-2 focus:ring-primary">
                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
        <p className="text-xs text-on-surface-variant">
          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <div className="flex gap-2">
          {!isEditing && (item.fileUrl || item.driveFileId || item.webViewLink) && (
            <a href={item.webViewLink || item.fileUrl || buildViewUrl(item.id)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              <span className="material-symbols-outlined text-[13px]">open_in_new</span> View File
            </a>
          )}
          
          {isPending && !isEditing && (
            <>
              <ActionButton label="Approve" icon="edit_document" onClick={() => handle('APPROVED')} loading={busy} />
              <ActionButton label="Reject" icon="cancel" onClick={() => handle('REJECTED')} variant="danger" loading={busy} />
            </>
          )}

          {isEditing && (
            <>
              <button onClick={() => setIsEditing(false)} disabled={busy} className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={() => handle('APPROVED')} disabled={busy || !editForm.title || !editForm.subjectCode} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-black hover:bg-amber-500 transition-all disabled:opacity-50">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Confirm Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Request Card ──────────────────────────────────────────────
function RequestCard({ item, onAction }) {
  const [busy, setBusy] = useState(false);
  const isPending = item.status === 'PENDING';

  async function handle(action) {
    setBusy(true);
    try { await onAction(item.id, action); } finally { setBusy(false); }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface">
            {item.resourceType} request
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5 flex flex-wrap items-center gap-1.5">
            <span>Subject: <span className="font-medium">{item.subjectCode || 'N/A'}</span></span>
            {item.email && (
              <>
                <span>•</span>
                <span>By: <a href={`mailto:${item.email}`} className="font-medium text-primary hover:underline">{item.email}</a></span>
              </>
            )}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container rounded-xl p-3">
        "{item.message}"
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
        <p className="text-xs text-on-surface-variant">
          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
        {isPending && (
          <div className="flex gap-2">
            <ActionButton label="Approve" icon="check_circle" onClick={() => handle('APPROVED')} loading={busy} />
            <ActionButton label="Reject" icon="cancel" onClick={() => handle('REJECTED')} variant="danger" loading={busy} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────
export default function AdminSubmissionsView() {
  const [tab, setTab] = useState('uploads');       // 'uploads' | 'requests'
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [uploads, setUploads] = useState([]);
  const [requests, setRequests] = useState([]);
  
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const depts = await getAdminCatalog();
      const allDepts = [];
      const allSems = [];
      const allSubs = [];
      for (const d of depts) {
        allDepts.push({ id: d.id, code: d.code, name: d.name });
        for (const sem of d.semesters ?? []) {
          allSems.push({ id: sem.id, name: sem.name, semesterNumber: sem.semesterNumber, deptCode: d.code || d.name, departmentId: d.id });
          for (const sub of sem.subjects ?? []) {
            allSubs.push({ ...sub, semesterId: sem.id });
          }
        }
      }
      setDepartments(allDepts);
      setSemesters(allSems);
      setSubjects(allSubs);

      if (tab === 'uploads') {
        const data = await getAdminUploads(statusFilter);
        setUploads(Array.isArray(data) ? data : []);
      } else {
        const data = await getAdminRequests(statusFilter);
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleUploadAction(id, action) {
    await reviewUpload(id, action);
    await load();
  }

  async function handleRequestAction(id, action) {
    await reviewRequest(id, action);
    await load();
  }

  const items = tab === 'uploads' ? uploads : requests;

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">Submissions Queue</h1>
        <p className="text-on-surface-variant text-xs sm:text-sm">Review and approve student resource contributions.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex flex-wrap gap-1 bg-surface-container p-1 rounded-xl w-full sm:w-fit mb-6">
        {[
          { key: 'uploads', icon: 'upload_file', label: 'Resource Uploads' },
          { key: 'requests', icon: 'help_outline', label: 'Resource Requests' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => { setTab(key); setStatusFilter('PENDING'); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              tab === key ? 'bg-white shadow text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6 justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === s
                  ? 'bg-primary text-on-primary border-primary'
                  : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
              }`}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button onClick={load} className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[15px]">refresh</span> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface-container rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && items.length === 0 && !error && (
        <div className="text-center py-16 sm:py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 block mb-3">inbox</span>
          <p className="font-semibold text-sm sm:text-base">No {statusFilter.toLowerCase()} {tab} found</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {tab === 'uploads'
            ? uploads.map((item) => <UploadCard key={item.id} item={item} onAction={handleUploadAction} departments={departments} semesters={semesters} subjects={subjects} />)
            : requests.map((item) => <RequestCard key={item.id} item={item} onAction={handleRequestAction} />)
          }
        </div>
      )}
    </div>
  );
}
