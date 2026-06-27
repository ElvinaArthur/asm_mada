'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminBooksEdit from '@/pages/admin/AdminBooksEdit';
export default function AdminBooksEditPage() {
  return <AdminProtectedRoute><AdminBooksEdit /></AdminProtectedRoute>;
}
