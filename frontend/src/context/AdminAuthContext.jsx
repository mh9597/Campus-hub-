// ─── context/AdminAuthContext.jsx ────────────────────────────
// Lightweight admin authentication context.
//
// Provides:
//   useAdminAuth() → { admin, isLoading, login, logout }
//
// On mount it calls GET /api/admin/auth/me via the HttpOnly cookie
// to restore a previous session without requiring re-login.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, adminMe } from '../services/admin/adminApi';
import { setAccessToken } from '../lib/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);        // null = not logged in
  const [isLoading, setIsLoading] = useState(true); // true while checking session

  // ── Restore session on app boot ───────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await adminMe();
        if (!cancelled) setAdmin(user);
      } catch {
        // No active session — this is the normal unauthenticated state
        if (!cancelled) setAdmin(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const user = await adminLogin({ email, password });
    setAdmin(user);
    return user;
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
    setAccessToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * Hook to consume the admin auth context.
 * Must be used inside <AdminAuthProvider>.
 */
export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  }
  return ctx;
}
