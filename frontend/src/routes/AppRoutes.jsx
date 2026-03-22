// src/routes/AppRoutes.jsx — VERSION MISE À JOUR
// Ajout de la route /settings pour les utilisateurs

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import ContactPage from "../pages/Contact/ContactPage";

// Pages Publiques
import HomePage from "../pages/Home/index";
import AboutPage from "../pages/About/AboutPage";

// Pages Auth
import AuthPage from "../pages/Auth/AuthPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResetPasswordPage from "../pages/auth/ResetPassword";

// Pages Protégées (Utilisateur)
import Dashboard from "../pages/user/Dashboard";
import ProfilePage from "../pages/user/ProfilePage";
import UserSettings from "../pages/user/UserSettings"; // ← NOUVEAU
import LibraryPage from "../pages/Library/LibraryPage";

// Pages Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBooks from "../pages/admin/AdminBooks";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminBooksAdd from "../pages/admin/AdminBooksAdd";
import AdminBooksEdit from "../pages/admin/AdminBooksEdit";
import AdminVerifications from "../pages/admin/AdminVerifications";
import DashboardRedirect from "../components/admin/DashboardRedirect";
import AdminDirectory from "../pages/admin/AdminDirectory";

// Pages 404 et autres
import NotFoundPage from "../pages/NotFound";

// Events
import EventsPage from "../pages/Events/index";
import MembersPage from "../pages/Members/MembersPage";
import AdminEventsAdd from "../pages/admin/AdminEventsAdd";
import AdminEventsEdit from "../pages/admin/AdminEventsEdit";
import EventDetailPage from "../pages/Events/EventDetailPage";
import VerificationPending from "../pages/Auth/VerificationPending";
import TermsPage from "../pages/Legal/TermsPage";
import PrivacyPage from "../pages/Legal/PrivacyPage";
import CookiesPage from "../pages/Legal/CookiesPage";
import MentionsPage from "../pages/Legal/MentionsPage";
import RgpdPage from "../pages/Legal/RgpdPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Routes publiques */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="members" element={<MembersPage />} />

        {/* Routes footer link */}
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

        {/* Routes Événements */}
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="event" element={<EventsPage />} />

        {/* Auth */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="verification-pending" element={<VerificationPending />} />

        {/* ── Routes protégées — Utilisateur ───────────────────── */}
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

        {/* ✅ NOUVEAU : page paramètres utilisateur (plus de 404) */}
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

        {/* ── Routes Admin ───────────────────────────────────────── */}
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
  );
};

export default AppRoutes;
