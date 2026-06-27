'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
export default function Admin() {
  return <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>;
}
