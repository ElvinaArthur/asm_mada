'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfilePage from '@/pages/user/ProfilePage';
export default function Profile() {
  return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
}
