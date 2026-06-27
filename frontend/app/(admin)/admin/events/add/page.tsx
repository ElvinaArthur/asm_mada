'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminEventsAdd from '@/pages/admin/AdminEventsAdd';
export default function AdminEventsAddPage() {
  return <AdminProtectedRoute><AdminEventsAdd /></AdminProtectedRoute>;
}
