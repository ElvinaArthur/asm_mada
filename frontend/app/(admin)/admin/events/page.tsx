'use client';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminEvents from '@/pages/admin/AdminEvents';
export default function AdminEventsPage() {
  return <AdminProtectedRoute><AdminEvents /></AdminProtectedRoute>;
}
