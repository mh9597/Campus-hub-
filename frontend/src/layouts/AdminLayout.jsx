// ─── layouts/AdminLayout.jsx ──────────────────────────────────
// Protected layout wrapper for all /admin/* routes.
// Redirects to /admin/login if the user is not authenticated.

import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import ScrollToTop from '../components/common/ScrollToTop';

export default function AdminLayout() {
  const { admin, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();

  // While checking session cookie, show a spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  const navItems = [
    { to: '/admin/dashboard',     icon: 'dashboard',    label: 'Dashboard' },
    { to: '/admin/submissions',   icon: 'inbox',        label: 'Submissions' },
    { to: '/admin/resources',     icon: 'folder_open',  label: 'Resources' },
    { to: '/admin/opportunities', icon: 'work',         label: 'Opportunities' },
  ];


  return (
    <div className="min-h-screen bg-background flex">
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-surface-container border-r border-outline-variant/20 flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm leading-tight">Resource Hub</p>
              <p className="text-xs text-on-surface-variant">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">person</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{admin.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{admin.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
