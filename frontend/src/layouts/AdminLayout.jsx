// ─── layouts/AdminLayout.jsx ──────────────────────────────────
// Protected layout wrapper for all /admin/* routes.
// Redirects to /admin/login if the user is not authenticated.

import { useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import ScrollToTop from '../components/common/ScrollToTop';

export default function AdminLayout() {
  const { admin, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-x-hidden">
      <ScrollToTop />

      {/* Mobile Top Header Bar */}
      <header className="md:hidden bg-surface-container border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">school</span>
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm leading-tight">Resource Hub</p>
            <p className="text-[10px] text-on-surface-variant">Admin Portal</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Slide-Over Overlay */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-surface-container border-r border-outline-variant/20 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm leading-tight">Resource Hub</p>
              <p className="text-xs text-on-surface-variant">Admin Portal</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-error/10 hover:text-error transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
