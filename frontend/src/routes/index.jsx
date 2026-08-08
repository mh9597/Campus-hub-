import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';

// ─── Public pages ─────────────────────────────────────────────
import Home from '../pages/Home/Home';
import Resources from '../pages/Resources/Resources';
import Semesters from '../pages/Resources/Semesters';
import SemesterDetails from '../pages/ResourceDetails/ResourceDetails';
import Opportunities from '../pages/Opportunities/Opportunities';
import Community from '../pages/Community/Community';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound/NotFound';
import SubjectDetails from '../pages/Subject/SubjectDetails';
import ComingSoon from '../pages/ComingSoon/ComingSoon';
import ResourceViewer from '../pages/ResourceViewer/ResourceViewer';
import { useParams, Navigate as RouterNavigate } from 'react-router-dom';

function DepartmentRouteHandler() {
  const { code } = useParams();
  const normalized = (code || '').toUpperCase();
  if (normalized === 'CE') {
    return <RouterNavigate to="/semesters" replace />;
  }
  return <RouterNavigate to={`/coming-soon?dept=${normalized}`} replace />;
}

// ─── Admin pages ──────────────────────────────────────────────
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminSubmissionsView from '../pages/Admin/AdminSubmissionsView';
import AdminResourcesView from '../pages/Admin/AdminResourcesView';
import AdminOpportunitiesView from '../pages/Admin/AdminOpportunitiesView';
import AdminCatalogView from '../pages/Admin/AdminCatalogView';

export const router = createBrowserRouter([
  // ── Public app ─────────────────────────────────────────────
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'resources', element: <Resources /> },
      { path: 'semesters', element: <Semesters /> },
      { path: 'semesters/:id', element: <SemesterDetails /> },
      { path: 'subject/:code', element: <SubjectDetails /> },
      { path: 'opportunities', element: <Opportunities /> },
      { path: 'community', element: <Community /> },
      { path: 'contact', element: <Contact /> },
      { path: 'about', element: <About /> },
      { path: 'coming-soon', element: <ComingSoon /> },
      { path: 'department/:code', element: <DepartmentRouteHandler /> },
      { path: '*', element: <NotFound /> },
    ],
  },

  // ── Resource Viewer (full-screen, no navbar) ────────────────
  { path: '/resource/:id', element: <ResourceViewer /> },

  // ── Admin login (standalone — no sidebar) ──────────────────
  { path: '/admin/login', element: <AdminLogin /> },

  // ── Admin portal (protected — requires auth, shows sidebar) ─
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // /admin  →  redirect to dashboard
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'submissions', element: <AdminSubmissionsView /> },
      { path: 'uploads', element: <AdminSubmissionsView /> },      // alias
      { path: 'resources', element: <AdminResourcesView /> },
      { path: 'opportunities', element: <AdminOpportunitiesView /> },
      { path: 'catalog', element: <AdminCatalogView /> },
      // Unknown /admin/* → 404
      { path: '*', element: <NotFound /> },
    ],
  },

  // ── Global catch-all for unmatched top-level routes ─────────
  { path: '*', element: <NotFound /> },
]);
