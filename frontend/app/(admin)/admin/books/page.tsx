'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminBooks from '@/pages/admin/AdminBooks';
export default function AdminBooksPage() {
  return <AdminProtectedRoute><AdminBooks /></AdminProtectedRoute>;
}
