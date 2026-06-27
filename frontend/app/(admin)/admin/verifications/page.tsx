'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminVerifications from '@/pages/admin/AdminVerifications';
export default function AdminVerificationsPage() {
  return <AdminProtectedRoute><AdminVerifications /></AdminProtectedRoute>;
}
