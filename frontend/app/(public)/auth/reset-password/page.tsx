'use client';
import { Suspense } from 'react';
import ResetPasswordPage from '@/pages/Auth/ResetPassword';

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
