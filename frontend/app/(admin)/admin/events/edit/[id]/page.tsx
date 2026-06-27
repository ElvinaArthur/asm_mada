'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminEventsEdit from '@/pages/admin/AdminEventsEdit';
export default function AdminEventsEditPage() {
  return <AdminProtectedRoute><AdminEventsEdit /></AdminProtectedRoute>;
}
