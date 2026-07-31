// ─── pages/Admin/AdminDashboard.jsx ──────────────────────────
// Overview dashboard for the admin portal.

import { useAdminAuth } from '../../context/AdminAuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();

  const cards = [
    {
      to: '/admin/uploads',
      icon: 'upload_file',
      label: 'Pending Uploads',
      description: 'Review and approve student resource submissions.',
      color: 'text-primary bg-primary/10',
    },
    {
      to: '/admin/resources',
      icon: 'folder_open',
      label: 'Manage Resources',
      description: 'Add, edit, or remove published study materials.',
      color: 'text-tertiary bg-tertiary/10',
    },
    {
      to: '/admin/opportunities',
      icon: 'work',
      label: 'Opportunities',
      description: 'Create internship, hackathon, and scholarship listings.',
      color: 'text-blue-600 bg-blue-500/10',
    },
    {
      to: '/admin/catalog',
      icon: 'account_tree',
      label: 'Academic Catalog',
      description: 'Add or remove branches, semesters, and subjects in real-time.',
      color: 'text-violet-600 bg-violet-500/10',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-on-surface mb-2">
          Welcome back, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-on-surface-variant">
          Manage the Student Resource Hub from here.
        </p>
      </div>

      {/* Quick-action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ to, icon, label, description, color }) => (
          <Link
            key={to}
            to={to}
            className="group bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 hover:border-primary/20 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <h2 className="font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
              {label}
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
            <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Go to {label} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-10 bg-primary/5 border border-primary/10 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">info</span>
          <div>
            <p className="font-semibold text-on-surface mb-1">Getting Started</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Use <strong>Pending Uploads</strong> to approve or reject student submissions. 
              Approved items immediately become visible in the public resource catalog.
              Use <strong>Manage Resources</strong> to directly publish curated materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
