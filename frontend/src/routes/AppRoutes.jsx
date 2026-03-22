// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import PageLoader from "../components/ui/modals/PageLoader";

// Pages Publiques
const HomePage = lazy(() => import("../pages/Home/index"));
const AboutPage = lazy(() => import("../pages/About/AboutPage"));
const ContactPage = lazy(() => import("../pages/Contact/ContactPage"));
const MembersPage = lazy(() => import("../pages/Members/MembersPage"));

// Pages Auth
const AuthPage = lazy(() => import("../pages/Auth/AuthPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPassword"));
const VerificationPending = lazy(
  () => import("../pages/Auth/VerificationPending"),
);

// Pages Protégées (Utilisateur)
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const ProfilePage = lazy(() => import("../pages/user/ProfilePage"));
const UserSettings = lazy(() => import("../pages/user/UserSettings"));
const LibraryPage = lazy(() => import("../pages/Library/LibraryPage"));

// Pages Admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminBooks = lazy(() => import("../pages/admin/AdminBooks"));
const AdminBooksAdd = lazy(() => import("../pages/admin/AdminBooksAdd"));
const AdminBooksEdit = lazy(() => import("../pages/admin/AdminBooksEdit"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminVerifications = lazy(
  () => import("../pages/admin/AdminVerifications"),
);
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminProfile = lazy(() => import("../pages/admin/AdminProfile"));
const AdminEvents = lazy(() => import("../pages/admin/AdminEvents"));
const AdminEventsAdd = lazy(() => import("../pages/admin/AdminEventsAdd"));
const AdminEventsEdit = lazy(() => import("../pages/admin/AdminEventsEdit"));
const AdminDirectory = lazy(() => import("../pages/admin/AdminDirectory"));
const DashboardRedirect = lazy(
  () => import("../components/admin/DashboardRedirect"),
);

// Events
const EventsPage = lazy(() => import("../pages/Events/index"));
const EventDetailPage = lazy(() => import("../pages/Events/EventDetailPage"));

// Legal
const TermsPage = lazy(() => import("../pages/Legal/TermsPage"));
const PrivacyPage = lazy(() => import("../pages/Legal/PrivacyPage"));
const CookiesPage = lazy(() => import("../pages/Legal/CookiesPage"));
const MentionsPage = lazy(() => import("../pages/Legal/MentionsPage"));
const RgpdPage = lazy(() => import("../pages/Legal/RgpdPage"));

// 404
const NotFoundPage = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Routes publiques */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="members" element={<MembersPage />} />

          {/* Legal */}
          <Route path="legal/terms" element={<TermsPage />} />
          <Route path="legal/privacy" element={<PrivacyPage />} />
          <Route path="legal/cookies" element={<CookiesPage />} />
          <Route path="legal/mentions" element={<MentionsPage />} />
          <Route path="legal/rgpd" element={<RgpdPage />} />

          {/* Redirect root si connecté */}
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Événements */}
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="event" element={<EventsPage />} />

          {/* Auth */}
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="auth/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="verification-pending"
            element={<VerificationPending />}
          />

          {/* ── Utilisateur ─────────────────────────────────────── */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="library"
            element={
              <ProtectedRoute requireVerification={true}>
                <LibraryPage />
              </ProtectedRoute>
            }
          />

          {/* ── Admin ───────────────────────────────────────────── */}
          <Route
            path="admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/books"
            element={
              <AdminProtectedRoute>
                <AdminBooks />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/books/add"
            element={
              <AdminProtectedRoute>
                <AdminBooksAdd />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/books/edit/:id"
            element={
              <AdminProtectedRoute>
                <AdminBooksEdit />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/verifications"
            element={
              <AdminProtectedRoute>
                <AdminVerifications />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/profile"
            element={
              <AdminProtectedRoute>
                <AdminProfile />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/events"
            element={
              <AdminProtectedRoute>
                <AdminEvents />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/events/add"
            element={
              <AdminProtectedRoute>
                <AdminEventsAdd />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/events/edit/:id"
            element={
              <AdminProtectedRoute>
                <AdminEventsEdit />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin/directory"
            element={
              <AdminProtectedRoute>
                <AdminDirectory />
              </AdminProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
