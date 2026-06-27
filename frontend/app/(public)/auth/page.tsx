'use client';
import { Suspense } from 'react';
import AuthPage from '@/pages/Auth/AuthPage';

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AuthPage />
    </Suspense>
  );
}
