// ─── pages/Admin/AdminOpportunitiesView.jsx ──────────────────
// Manage opportunities and announcements: create, toggle active, delete.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminOpportunities, createOpportunity, toggleOpportunity, deleteOpportunity,
  getAdminAnnouncements, createAnnouncement, toggleAnnouncement, deleteAnnouncement,
} from '../../services/admin/adminApi';

const OPPORTUNITY_CATEGORIES = ['Internship', 'Hackathon', 'Scholarship', 'Workshop', 'Placement', 'Webinar', 'Certification', 'General'];
const BADGE_COLORS = ['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500'];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-[95%] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline-variant/10">
          <h2 className="text-base sm:text-lg font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

const PRESET_TAGS = ['Active', 'New', 'Urgent', 'Featured', 'Closing Soon'];

// ── Opportunity Form ──────────────────────────────────────────
function OpportunityForm({ onClose }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'Internship', tag: '', pinBg: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await createOpportunity(form);
      onClose(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <p className="text-xs sm:text-sm text-error bg-error/10 rounded-xl p-3">{err}</p>}
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-1">Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Google Summer of Code 2026"
          className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Brief description…"
          className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1">Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}
            className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30">
            {OPPORTUNITY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Tag</label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PRESET_TAGS.map(t => (
              <button 
                key={t}
                type="button"
                onClick={() => set('tag', t === form.tag ? '' : t)}
                className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  form.tag === t 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2.5 sm:gap-3 pt-2">
        <button type="button" onClick={() => onClose(false)} className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer">
          {saving && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          Publish
        </button>
      </div>
    </form>
  );
}

// ── Announcement Form ─────────────────────────────────────────
function AnnouncementForm({ onClose }) {
  const [form, setForm] = useState({ text: '', badge: 'New', color: 'bg-green-500', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await createAnnouncement({ ...form, deadline: form.deadline || null });
      onClose(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <p className="text-xs sm:text-sm text-error bg-error/10 rounded-xl p-3">{err}</p>}
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-1">Announcement Text *</label>
        <textarea value={form.text} onChange={(e) => set('text', e.target.value)} required rows={3} placeholder="e.g. Mid-semester exams start next week…"
          className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1">Badge</label>
          <input value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="New / Urgent"
            className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1">Deadline (optional)</label>
          <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)}
            className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-xs sm:text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-2">Badge Color</label>
        <div className="flex gap-2 flex-wrap">
          {BADGE_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => set('color', c)}
              className={`w-7 h-7 rounded-full ${c} transition-all cursor-pointer ${form.color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'}`} />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2.5 sm:gap-3 pt-2">
        <button type="button" onClick={() => onClose(false)} className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer">
          {saving && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          Post Announcement
        </button>
      </div>
    </form>
  );
}

// ── Row component ─────────────────────────────────────────────
function ItemRow({ item, onToggle, onDelete, labelField = 'title', toggling, deleting }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-3.5 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 transition-opacity ${!item.isActive ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-on-surface text-xs sm:text-sm line-clamp-2 break-words">{item[labelField] || item.title}</p>
        {item.category && <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">{item.category}{item.tag ? ` · ${item.tag}` : ''}</p>}
        {item.badge && <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">{item.badge}{item.deadline ? ` · Due: ${new Date(item.deadline).toLocaleDateString()}` : ''}</p>}
        <p className="text-[11px] sm:text-xs text-on-surface-variant/60 mt-0.5">{item.isActive ? '✅ Active' : '⏸ Inactive'}</p>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button onClick={() => onToggle(item.id)} disabled={toggling === item.id} title={item.isActive ? 'Deactivate' : 'Activate'}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${item.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'} disabled:opacity-40`}>
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{item.isActive ? 'toggle_on' : 'toggle_off'}</span>
        </button>
        <button onClick={() => onDelete(item.id)} disabled={deleting === item.id} title="Delete"
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all disabled:opacity-40 cursor-pointer">
          {deleting === item.id
            ? <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <span className="material-symbols-outlined text-[15px] sm:text-[16px]">delete</span>
          }
        </button>
      </div>
    </div>
  );
}

export default function AdminOpportunitiesView() {
  const [tab, setTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOppForm, setShowOppForm] = useState(false);
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [opps, anns] = await Promise.all([getAdminOpportunities(), getAdminAnnouncements()]);
      setOpportunities(Array.isArray(opps) ? opps : []);
      setAnnouncements(Array.isArray(anns) ? anns : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleToggleOpp(id) {
    setToggling(id);
    try { await toggleOpportunity(id); await load(); } finally { setToggling(null); }
  }
  async function handleDeleteOpp(id) {
    if (!confirm('Delete this opportunity? This is permanent.')) return;
    setDeleting(id);
    try { await deleteOpportunity(id); await load(); } finally { setDeleting(null); }
  }
  async function handleToggleAnn(id) {
    setToggling(id);
    try { await toggleAnnouncement(id); await load(); } finally { setToggling(null); }
  }
  async function handleDeleteAnn(id) {
    if (!confirm('Delete this announcement? This is permanent.')) return;
    setDeleting(id);
    try { await deleteAnnouncement(id); await load(); } finally { setDeleting(null); }
  }

  const isOpps = tab === 'opportunities';

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">Opportunities & Announcements</h1>
          <p className="text-on-surface-variant text-xs sm:text-sm">Publish and manage visible content for students.</p>
        </div>
        <button
          onClick={() => isOpps ? setShowOppForm(true) : setShowAnnForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          {isOpps ? 'Add Opportunity' : 'Post Announcement'}
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-surface-container p-1 rounded-xl w-full sm:w-fit mb-6">
        {[
          { key: 'opportunities', icon: 'work', label: 'Opportunities' },
          { key: 'announcements', icon: 'campaign', label: 'Announcements' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              tab === key ? 'bg-white shadow text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">{error}</div>}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-surface-container rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!loading && isOpps && (
        opportunities.length === 0
          ? <div className="text-center py-20 text-on-surface-variant"><span className="material-symbols-outlined text-5xl text-gray-300 block mb-2">work_off</span><p className="font-semibold">No opportunities yet</p></div>
          : <div className="space-y-3">{opportunities.map((o) => <ItemRow key={o.id} item={o} onToggle={handleToggleOpp} onDelete={handleDeleteOpp} toggling={toggling} deleting={deleting} />)}</div>
      )}

      {!loading && !isOpps && (
        announcements.length === 0
          ? <div className="text-center py-20 text-on-surface-variant"><span className="material-symbols-outlined text-5xl text-gray-300 block mb-2">campaign</span><p className="font-semibold">No announcements yet</p></div>
          : <div className="space-y-3">{announcements.map((a) => <ItemRow key={a.id} item={a} labelField="text" onToggle={handleToggleAnn} onDelete={handleDeleteAnn} toggling={toggling} deleting={deleting} />)}</div>
      )}

      {showOppForm && <Modal title="New Opportunity" onClose={() => setShowOppForm(false)}><OpportunityForm onClose={(saved) => { setShowOppForm(false); if (saved) load(); }} /></Modal>}
      {showAnnForm && <Modal title="New Announcement" onClose={() => setShowAnnForm(false)}><AnnouncementForm onClose={(saved) => { setShowAnnForm(false); if (saved) load(); }} /></Modal>}
    </div>
  );
}
