'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LibraryPage from '@/pages/Library/LibraryPage';
export default function Library() {
  return <ProtectedRoute requireVerification={true}><LibraryPage /></ProtectedRoute>;
}
