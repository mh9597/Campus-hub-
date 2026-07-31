// src/pages/Admin/AdminCatalogView.jsx
// Academic Catalog Manager — Departments > Semesters > Subjects
// Non-tech admins can create, edit, and delete branches/semesters/subjects in real-time.
import { useState, useEffect, useCallback } from 'react';
import {
  getAdminDepartments,
  createDepartment, updateDepartment, deleteDepartment,
  createSemester,  updateSemester,  deleteSemester,
  createSubject,   updateSubject,   deleteSubject,
} from '../../services/admin/catalogApi';

// ─── Toast notification (inline, no dependency) ──────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm animate-fade-in
        ${isError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}
    >
      <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
        {isError ? 'error' : 'check_circle'}
      </span>
      <p className="text-sm leading-relaxed flex-1">{toast.message}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────
function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-red-500 text-[28px]">warning</span>
          <h3 className="text-lg font-bold text-on-surface">Confirm Delete</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field Component ──────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition ${className}`}
    />
  );
}

function TextArea({ ...props }) {
  return (
    <textarea
      rows={3}
      {...props}
      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition resize-none"
    />
  );
}

// ─── Department Modal ─────────────────────────────────────────
function DepartmentModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState({ code: initial?.code || '', name: initial?.name || '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Branch code is required (e.g. CE, ME)';
    if (!form.name.trim()) e.name = 'Branch name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? 'Add New Branch' : 'Edit Branch'} icon="account_tree" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Branch Code" required error={errors.code}>
          <Input
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="e.g. CE, ME, EE, CIVIL"
            maxLength={20}
          />
          <p className="mt-1 text-xs text-on-surface-variant">Short code used as identifier. Will be auto-uppercased.</p>
        </Field>
        <Field label="Branch Name" required error={errors.name}>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Computer Engineering"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Create Branch' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Semester Modal ───────────────────────────────────────────
function SemesterModal({ mode, initial, departmentName, onClose, onSave }) {
  const [form, setForm] = useState({
    semesterNumber: initial?.semesterNumber || '',
    name: initial?.name || '',
    description: initial?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.semesterNumber) errs.semesterNumber = 'Semester number is required';
    if (!form.name.trim()) errs.name = 'Semester name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? `Add Semester — ${departmentName}` : 'Edit Semester'} icon="calendar_month" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Semester No." required error={errors.semesterNumber}>
            <Input
              type="number" min={1} max={12}
              value={form.semesterNumber}
              onChange={e => setForm(f => ({ ...f, semesterNumber: e.target.value }))}
              placeholder="e.g. 3"
            />
          </Field>
          <Field label="Name" required error={errors.name}>
            <Input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Semester 3"
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Optional short description for students…"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Add Semester' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Icon Picker ──────────────────────────────────────────────
const ACADEMIC_ICONS = [
  'menu_book', 'code', 'science', 'calculate', 'language', 
  'architecture', 'biotech', 'laptop_mac', 'history_edu', 
  'psychology', 'gavel', 'art_track', 'engineering', 
  'business_center', 'memory', 'terminal', 'data_object',
  'functions', 'bar_chart', 'public'
];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px] w-6 flex items-center justify-center">
            {value}
          </span>
          <span className="font-mono text-xs opacity-70">{value}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-50 grid grid-cols-5 gap-2 w-64 animate-fade-in">
            {ACADEMIC_ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => { onChange(icon); setOpen(false); }}
                title={icon}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  value === icon 
                    ? 'bg-primary text-on-primary shadow-sm scale-110' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Subject Modal ────────────────────────────────────────────
function SubjectModal({ mode, initial, semesterName, onClose, onSave }) {
  const [form, setForm] = useState({
    code: initial?.code || '',
    title: initial?.title || '',
    description: initial?.description || '',
    icon: initial?.icon || 'menu_book',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.code.trim()) errs.code = 'Subject code is required (e.g. CE301)';
    if (!form.title.trim()) errs.title = 'Subject title is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? `Add Subject — ${semesterName}` : 'Edit Subject'} icon="book_2" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Subject Code" required error={errors.code}>
            <Input
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. CE301"
              maxLength={30}
            />
          </Field>
          <Field label="Icon">
            <IconPicker
              value={form.icon}
              onChange={(icon) => setForm(f => ({ ...f, icon }))}
            />
          </Field>
        </div>
        <Field label="Subject Title" required error={errors.title}>
          <Input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Data Structures & Algorithms"
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Brief description for students…"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Add Subject' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Shared Modal Shell ───────────────────────────────────────
function ModalShell({ title, icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg border border-outline-variant/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/15">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface flex-1">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ saving, onCancel, saveLabel }) {
  return (
    <div className="flex gap-3 justify-end pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-60 transition flex items-center gap-2"
      >
        {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {saving ? 'Saving…' : saveLabel}
      </button>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
function Badge({ count, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
      {count} {label}
    </span>
  );
}

// ─── Main View ────────────────────────────────────────────────
export default function AdminCatalogView() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState({}); // { deptId: bool, semId: bool }
  const [toast, setToast]             = useState(null);
  const [confirm, setConfirm]         = useState(null);
  const [modal, setModal]             = useState(null);
  // modal = { type: 'dept'|'sem'|'subject', mode: 'create'|'edit', target: object }

  // ── Fetch ──────────────────────────────────────────────────
  const fetchDepts = useCallback(async () => {
    try {
      const data = await getAdminDepartments();
      setDepartments(data?.data ?? data ?? []);
    } catch (err) {
      showToast(err.message || 'Failed to load catalog', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepts(); }, [fetchDepts]);

  // ── Toast helpers ──────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Expand/Collapse ────────────────────────────────────────
  const toggleExpand = (key) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Department actions ─────────────────────────────────────
  const handleCreateDept = async (form) => {
    await createDepartment(form);
    showToast(`Branch "${form.name}" created successfully`);
    fetchDepts();
  };

  const handleUpdateDept = async (id, form) => {
    await updateDepartment(id, form);
    showToast('Branch updated successfully');
    fetchDepts();
  };

  const handleDeleteDept = (dept) => {
    setConfirm({
      message: `Delete branch "${dept.name}" (${dept.code})? This is permanent and only works if it has no semesters.`,
      onConfirm: async () => {
        try {
          await deleteDepartment(dept.id);
          showToast(`Branch "${dept.name}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  // ── Semester actions ───────────────────────────────────────
  const handleCreateSem = async (dept, form) => {
    await createSemester({ ...form, departmentId: dept.id });
    showToast(`Semester ${form.semesterNumber} added to ${dept.name}`);
    setExpanded(prev => ({ ...prev, [`d-${dept.id}`]: true }));
    fetchDepts();
  };

  const handleUpdateSem = async (sem, form) => {
    await updateSemester(sem.id, form);
    showToast('Semester updated');
    fetchDepts();
  };

  const handleDeleteSem = (sem, deptName) => {
    setConfirm({
      message: `Delete "${sem.name}" from ${deptName}? This only works if the semester has no subjects.`,
      onConfirm: async () => {
        try {
          await deleteSemester(sem.id);
          showToast(`"${sem.name}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  // ── Subject actions ────────────────────────────────────────
  const handleCreateSubject = async (sem, dept, form) => {
    await createSubject({ ...form, semesterId: sem.id });
    showToast(`Subject "${form.title}" added`);
    setExpanded(prev => ({ ...prev, [`d-${dept.id}`]: true, [`s-${sem.id}`]: true }));
    fetchDepts();
  };

  const handleUpdateSubject = async (subject, form) => {
    await updateSubject(subject.id, form);
    showToast('Subject updated');
    fetchDepts();
  };

  const handleDeleteSubject = (subject) => {
    setConfirm({
      message: `Delete subject "${subject.title}" (${subject.code})? This only works if it has no resources.`,
      onConfirm: async () => {
        try {
          await deleteSubject(subject.id);
          showToast(`"${subject.title}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-1">Academic Catalog</h1>
          <p className="text-on-surface-variant text-sm">
            Manage branches, semesters, and subjects in real-time.
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'dept', mode: 'create', target: null })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Branch
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && departments.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-[36px]">account_tree</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">No branches yet</h3>
          <p className="text-on-surface-variant text-sm mb-6">Start by creating your first department branch.</p>
          <button
            onClick={() => setModal({ type: 'dept', mode: 'create', target: null })}
            className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition"
          >
            Add First Branch
          </button>
        </div>
      )}

      {/* Catalog Tree */}
      {!loading && departments.length > 0 && (
        <div className="space-y-4">
          {departments.map(dept => {
            const deptExpanded = expanded[`d-${dept.id}`] ?? true;
            return (
              <div key={dept.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                {/* Department Row */}
                <div className="flex items-center gap-3 px-5 py-4 bg-surface-container/50">
                  <button
                    onClick={() => toggleExpand(`d-${dept.id}`)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-container transition shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200"
                      style={{ transform: deptExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      chevron_right
                    </span>
                  </button>
                  <span className="material-symbols-outlined text-primary text-[22px]">account_tree</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-on-surface">{dept.name}</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{dept.code}</span>
                      <Badge count={dept._count?.semesters ?? dept.semesters?.length ?? 0} label="sems" />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <ActionBtn icon="add" label="Add Semester" color="text-blue-600" onClick={() => setModal({ type: 'sem', mode: 'create', target: dept })} />
                    <ActionBtn icon="edit" label="Edit Branch" color="text-on-surface-variant" onClick={() => setModal({ type: 'dept', mode: 'edit', target: dept })} />
                    <ActionBtn icon="delete" label="Delete Branch" color="text-red-400" onClick={() => handleDeleteDept(dept)} />
                  </div>
                </div>

                {/* Semesters */}
                {deptExpanded && dept.semesters?.length > 0 && (
                  <div className="divide-y divide-outline-variant/10">
                    {dept.semesters.map(sem => {
                      const semExpanded = expanded[`s-${sem.id}`] ?? false;
                      return (
                        <div key={sem.id}>
                          {/* Semester Row */}
                          <div className="flex items-center gap-3 px-5 py-3 pl-10 bg-surface-container/30 hover:bg-surface-container/50 transition">
                            <button
                              onClick={() => toggleExpand(`s-${sem.id}`)}
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-surface-container transition shrink-0"
                            >
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200"
                                style={{ transform: semExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                              >
                                chevron_right
                              </span>
                            </button>
                            <span className="material-symbols-outlined text-tertiary text-[18px]">calendar_month</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-on-surface text-sm">{sem.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-semibold">Sem {sem.semesterNumber}</span>
                                <Badge count={sem._count?.subjects ?? sem.subjects?.length ?? 0} label="subjects" />
                              </div>
                              {sem.description && (
                                <p className="text-xs text-on-surface-variant mt-0.5 truncate">{sem.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <ActionBtn icon="add" label="Add Subject" color="text-blue-600" onClick={() => setModal({ type: 'subject', mode: 'create', target: { sem, dept } })} />
                              <ActionBtn icon="edit" label="Edit Semester" color="text-on-surface-variant" onClick={() => setModal({ type: 'sem', mode: 'edit', target: { sem, dept } })} />
                              <ActionBtn icon="delete" label="Delete Semester" color="text-red-400" onClick={() => handleDeleteSem(sem, dept.name)} />
                            </div>
                          </div>

                          {/* Subjects */}
                          {semExpanded && sem.subjects?.length > 0 && (
                            <div className="divide-y divide-outline-variant/5">
                              {sem.subjects.map(subject => (
                                <div key={subject.id} className="flex items-center gap-3 px-5 py-2.5 pl-16 hover:bg-surface-container/30 transition">
                                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                                    {subject.icon || 'menu_book'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-medium text-on-surface text-sm">{subject.title}</span>
                                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{subject.code}</span>
                                      {subject._count?.resources > 0 && (
                                        <Badge count={subject._count.resources} label="resources" />
                                      )}
                                    </div>
                                    {subject.description && (
                                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{subject.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <ActionBtn icon="edit" label="Edit Subject" color="text-on-surface-variant" onClick={() => setModal({ type: 'subject', mode: 'edit', target: { subject, sem, dept } })} />
                                    <ActionBtn icon="delete" label="Delete Subject" color="text-red-400" onClick={() => handleDeleteSubject(subject)} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Empty subjects state inside semester */}
                          {semExpanded && (!sem.subjects || sem.subjects.length === 0) && (
                            <div className="pl-16 py-3 text-xs text-on-surface-variant italic">
                              No subjects yet —{' '}
                              <button
                                className="text-primary font-semibold hover:underline"
                                onClick={() => setModal({ type: 'subject', mode: 'create', target: { sem, dept } })}
                              >
                                Add one
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty semesters state inside dept */}
                {deptExpanded && (!dept.semesters || dept.semesters.length === 0) && (
                  <div className="pl-12 py-4 text-sm text-on-surface-variant italic">
                    No semesters yet —{' '}
                    <button
                      className="text-primary font-semibold hover:underline"
                      onClick={() => setModal({ type: 'sem', mode: 'create', target: dept })}
                    >
                      Add first semester
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────────────── */}

      {modal?.type === 'dept' && modal.mode === 'create' && (
        <DepartmentModal
          mode="create"
          initial={null}
          onClose={() => setModal(null)}
          onSave={handleCreateDept}
        />
      )}

      {modal?.type === 'dept' && modal.mode === 'edit' && (
        <DepartmentModal
          mode="edit"
          initial={modal.target}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateDept(modal.target.id, form)}
        />
      )}

      {modal?.type === 'sem' && modal.mode === 'create' && (
        <SemesterModal
          mode="create"
          initial={null}
          departmentName={modal.target?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleCreateSem(modal.target, form)}
        />
      )}

      {modal?.type === 'sem' && modal.mode === 'edit' && (
        <SemesterModal
          mode="edit"
          initial={modal.target?.sem}
          departmentName={modal.target?.dept?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateSem(modal.target.sem, form)}
        />
      )}

      {modal?.type === 'subject' && modal.mode === 'create' && (
        <SubjectModal
          mode="create"
          initial={null}
          semesterName={modal.target?.sem?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleCreateSubject(modal.target.sem, modal.target.dept, form)}
        />
      )}

      {modal?.type === 'subject' && modal.mode === 'edit' && (
        <SubjectModal
          mode="edit"
          initial={modal.target?.subject}
          semesterName={modal.target?.sem?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateSubject(modal.target.subject, form)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirm}
        message={confirm?.message}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────
function ActionBtn({ icon, label, color, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition ${color}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}
