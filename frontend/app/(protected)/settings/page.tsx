'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserSettings from '@/pages/user/UserSettings';
export default function Settings() {
  return <ProtectedRoute><UserSettings /></ProtectedRoute>;
}
