'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/user/Dashboard';
export default function DashboardPage() {
  return <ProtectedRoute><Dashboard /></ProtectedRoute>;
}
