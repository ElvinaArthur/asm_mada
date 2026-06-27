'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminSettings from '@/pages/admin/AdminSettings';
export default function AdminSettingsPage() {
  return <AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>;
}
