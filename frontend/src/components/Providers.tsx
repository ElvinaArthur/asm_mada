'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/hooks/AuthContext';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserDataProvider>
          {children}
          <Toaster position="top-right" />
        </UserDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
