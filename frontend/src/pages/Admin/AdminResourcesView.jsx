// ─── pages/Admin/AdminResourcesView.jsx ──────────────────────
// Manage all published resources: search, add (URL or file), edit, soft-delete.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminResources, createResource, createResourceWithFile,
  updateResource, deleteResource, getAdminCatalog,
} from '../../services/admin/adminApi';

const RESOURCE_TYPES = ['Notes', 'Previous Year Papers', 'Practical Files', 'Viva Questions', 'Question Bank', 'Syllabus', 'Other'];

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');
const buildViewUrl = (id) => `${API_BASE}/resources/${id}/view`;

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ResourceForm({ departments = [], semesters = [], subjects = [], onSubmit, onClose, initial }) {
  const [form, setForm] = useState({
    subjectId: initial?.subjectId ?? '',
    title: initial?.title ?? '',
    resourceType: initial?.resourceType ?? 'Notes',
    fileUrl: initial?.fileUrl ?? '',
    description: initial?.description ?? '',
    source: initial?.source ?? 'admin',
    uploadMode: 'url', // 'url' | 'file'
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize and sync department/semester based on selected subject
  useEffect(() => {
    if (form.subjectId && subjects.length > 0) {
      const s = subjects.find(sub => sub.id === form.subjectId);
      if (s) {
        setSearchQuery(`[${s.code}] ${s.title}`);
        
        // Find the semester for this subject
        const sem = semesters.find(se => se.id === s.semesterId);
        if (sem) {
          if (!selectedSemester) setSelectedSemester(sem.id);
          if (!selectedDepartment) setSelectedDepartment(sem.departmentId);
        }
      }
    }
  }, [form.subjectId, subjects, semesters]);

  const allowedSemesters = selectedDepartment 
    ? semesters.filter(s => s.departmentId === Number(selectedDepartment))
    : semesters;

  const allowedSubjects = subjects.filter(s => {
    if (selectedSemester) return s.semesterId === Number(selectedSemester);
    if (selectedDepartment) {
      const semIds = allowedSemesters.map(as => as.id);
      return semIds.includes(s.semesterId);
    }
    return true;
  });

  const filteredSubjects = allowedSubjects.filter(s => 
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subjectId) {
      setErr('Please select a valid subject from the list.');
      return;
    }
    setErr('');
    setSaving(true);
    try {
      if (form.uploadMode === 'file' && file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('subjectId', form.subjectId);
        fd.append('title', form.title);
        fd.append('resourceType', form.resourceType);
        fd.append('description', form.description);
        fd.append('source', form.source);
        await createResourceWithFile(fd);
      } else {
        await onSubmit({ ...form });
      }
      onClose(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {err && <p className="text-sm text-error bg-error/10 rounded-xl p-3">{err}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Branch (Dept)</label>
          <select 
            value={selectedDepartment} 
            onChange={(e) => { 
              setSelectedDepartment(e.target.value); 
              setSelectedSemester('');
              set('subjectId', ''); 
              setSearchQuery(''); 
            }}
            className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          >
            <option value="">All Branches</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Semester</label>
          <select 
            value={selectedSemester} 
            onChange={(e) => { 
              setSelectedSemester(e.target.value); 
              set('subjectId', ''); 
              setSearchQuery(''); 
            }}
            className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          >
            <option value="">All Semesters</option>
            {allowedSemesters.map((s) => (
              <option key={s.id} value={s.id}>
                {!selectedDepartment && `[${s.deptCode}] `}
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-on-surface mb-1.5">Subject *</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search subject..."
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              setIsDropdownOpen(true);
              if (form.subjectId) set('subjectId', ''); 
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1.5 bg-white border border-outline-variant/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => { 
                      set('subjectId', s.id); 
                      setSearchQuery(`[${s.code}] ${s.title}`); 
                      setIsDropdownOpen(false); 
                      
                      // Auto-select department and semester
                      const sem = semesters.find(se => se.id === s.semesterId);
                      if (sem) {
                        setSelectedSemester(sem.id);
                        setSelectedDepartment(sem.departmentId);
                      }
                    }}
                    className="px-4 py-2.5 hover:bg-surface-container cursor-pointer text-sm border-b border-outline-variant/10 last:border-0 transition-colors"
                  >
                    <span className="font-semibold text-primary">[{s.code}]</span> {s.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-on-surface-variant">No subjects found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface mb-1.5">Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. DAA Unit 1 Notes"
          className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface mb-1.5">Resource Type</label>
        <select value={form.resourceType} onChange={(e) => set('resourceType', e.target.value)}
          className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow">
          {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Optional description…"
          className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" />
      </div>

      {!initial && (
        <div className="pt-1">
          <div className="flex gap-2 bg-surface-container p-1 rounded-xl mb-4">
            {['url', 'file'].map((m) => (
              <button key={m} type="button" onClick={() => set('uploadMode', m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.uploadMode === m ? 'bg-white shadow text-primary' : 'text-on-surface-variant'}`}>
                {m === 'url' ? 'Link URL' : 'Upload File'}
              </button>
            ))}
          </div>

          {form.uploadMode === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">File URL</label>
              <input value={form.fileUrl} onChange={(e) => set('fileUrl', e.target.value)} required={form.uploadMode === 'url'} placeholder="https://…"
                className="w-full border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">File</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required={form.uploadMode === 'file'}
                className="w-full text-sm text-on-surface-variant file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-sm cursor-pointer hover:file:bg-primary/20 transition-all" />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10 mt-6">
        <button type="button" onClick={() => onClose(false)} className="px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm">
          {saving ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
          {initial ? 'Save Changes' : 'Publish Resource'}
        </button>
      </div>
    </form>
  );
}

export default function AdminResourcesView() {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  // { id, title } of the resource pending hard-delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadSubjects = useCallback(async () => {
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
    } catch { 
      setDepartments([]);
      setSemesters([]);
      setSubjects([]); 
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminResources({ search });
      setResources(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleCreate(form) {
    await createResource(form);
  }

  async function handleEdit(form) {
    await updateResource(editItem.id, {
      title:        form.title,
      resourceType: form.resourceType,
      description:  form.description,
      subjectId:    form.subjectId,
      source:       form.source,
      isActive:     true,
    });
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteResource(id);
      await load();
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-1">Resources</h1>
          <p className="text-on-surface-variant text-sm">Manage all published study materials.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span> Add Resource
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title…"
          className="w-full pl-9 pr-4 py-2.5 border border-outline-variant/30 rounded-xl text-sm bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {error && <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">{error}</div>}

      {loading && (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-surface-container rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!loading && resources.length === 0 && !error && (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl text-gray-300 block mb-3">folder_off</span>
          <p className="font-semibold">No resources found</p>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((r) => (
            <div key={r.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${r.isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface truncate text-sm">{r.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {r.subject?.code} · {r.resourceType} · {r.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(r.fileUrl || r.driveFileId) && (
                  <a href={buildViewUrl(r.id)} target="_blank" rel="noopener noreferrer" title="View file"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                )}
                <button onClick={() => setEditItem(r)} title="Edit"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button
                  onClick={() => setConfirmDelete({ id: r.id, title: r.title })}
                  disabled={deletingId === r.id}
                  title="Delete permanently"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all disabled:opacity-40"
                >
                  {deletingId === r.id
                    ? <svg className="animate-spin h-3.5 w-3.5 text-error" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <span className="material-symbols-outlined text-[16px]">delete</span>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Add New Resource" onClose={(saved) => { setShowCreate(false); if (saved) load(); }}>
          <ResourceForm departments={departments} semesters={semesters} subjects={subjects} onSubmit={handleCreate} onClose={(saved) => { setShowCreate(false); if (saved) load(); }} />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Resource" onClose={(saved) => { setEditItem(null); if (saved) load(); }}>
          <ResourceForm departments={departments} semesters={semesters} subjects={subjects} onSubmit={handleEdit} initial={editItem} onClose={(saved) => { setEditItem(null); if (saved) load(); }} />
        </Modal>
      )}

      {/* ── Drive Delete Confirmation Modal ───────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Yellow header */}
            <div className="bg-amber-400 px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-black text-[22px]">warning</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-black leading-tight">Permanent Delete</h2>
                <p className="text-xs font-semibold text-black/60">This action cannot be undone</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                You are about to permanently delete:
              </p>
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3">
                <p className="font-bold text-black text-sm truncate">{confirmDelete.title}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2">
                <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0 mt-0.5">cloud_off</span>
                <p className="text-xs text-red-700 leading-relaxed">
                  <strong>Warning:</strong> This will permanently delete the file from both
                  the website database <em>and</em> your Google Drive storage.
                  The file cannot be recovered after this action.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-400 hover:text-black transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-3 rounded-xl bg-black text-amber-400 text-sm font-black hover:bg-gray-900 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {deletingId === confirmDelete.id ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                )}
                {deletingId === confirmDelete.id ? 'Deleting…' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
