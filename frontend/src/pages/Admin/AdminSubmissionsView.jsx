// ─── pages/Admin/AdminSubmissionsView.jsx ─────────────────────
// Approval queue: pending student upload submissions & resource requests.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminUploads, reviewUpload,
  getAdminRequests, reviewRequest,
} from '../../services/admin/adminApi';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');
// Admin can view submissions via the backend proxy (no Drive URL exposed)
const buildViewUrl = (id) => `${API_BASE}/resources/${id}/view`;

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
function UploadCard({ item, onAction }) {
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

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
        <p className="text-xs text-on-surface-variant">
          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <div className="flex gap-2">
          {(item.fileUrl || item.driveFileId) && (
            <a href={buildViewUrl(item.id)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              <span className="material-symbols-outlined text-[13px]">open_in_new</span> View File
            </a>
          )}
          {isPending && (
            <>
              <ActionButton label="Approve" icon="check_circle" onClick={() => handle('APPROVED')} loading={busy} />
              <ActionButton label="Reject" icon="cancel" onClick={() => handle('REJECTED')} variant="danger" loading={busy} />
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
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
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface mb-1">Submissions Queue</h1>
        <p className="text-on-surface-variant text-sm">Review and approve student resource contributions.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-surface-container p-1 rounded-xl w-fit mb-6">
        {[
          { key: 'uploads', icon: 'upload_file', label: 'Resource Uploads' },
          { key: 'requests', icon: 'help_outline', label: 'Resource Requests' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => { setTab(key); setStatusFilter('PENDING'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-white shadow text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === s
                ? 'bg-primary text-on-primary border-primary'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
            }`}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
        <button onClick={load} className="ml-auto flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface-container rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && items.length === 0 && !error && (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl text-gray-300 block mb-3">inbox</span>
          <p className="font-semibold">No {statusFilter.toLowerCase()} {tab} found</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tab === 'uploads'
            ? uploads.map((item) => <UploadCard key={item.id} item={item} onAction={handleUploadAction} />)
            : requests.map((item) => <RequestCard key={item.id} item={item} onAction={handleRequestAction} />)
          }
        </div>
      )}
    </div>
  );
}
