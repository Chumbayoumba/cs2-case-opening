'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
