'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminBooksAdd from '@/pages/admin/AdminBooksAdd';
export default function AdminBooksAddPage() {
  return <AdminProtectedRoute><AdminBooksAdd /></AdminProtectedRoute>;
}
