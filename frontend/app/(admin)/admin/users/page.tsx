'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminUsers from '@/pages/admin/AdminUsers';
export default function AdminUsersPage() {
  return <AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>;
}
