'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminDirectory from '@/pages/admin/AdminDirectory';
export default function AdminDirectoryPage() {
  return <AdminProtectedRoute><AdminDirectory /></AdminProtectedRoute>;
}
