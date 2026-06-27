'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminProfile from '@/pages/admin/AdminProfile';
export default function AdminProfilePage() {
  return <AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>;
}
