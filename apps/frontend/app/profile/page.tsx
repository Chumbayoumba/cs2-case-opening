'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Profile {
  id: number;
  email: string;
  username: string;
  balance: string;
  totalCasesOpened: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/user/profile');
      return response.data as Profile;
    },
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      <div className="bg-gray-800 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm">Username</label>
            <div className="text-xl font-semibold">{profile?.username}</div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <div className="text-xl font-semibold">{profile?.email}</div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Balance</label>
            <div className="text-2xl font-bold text-yellow-400">
              ${parseFloat(profile?.balance || '0').toFixed(2)}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Cases Opened</label>
            <div className="text-2xl font-bold text-blue-400">
              {profile?.totalCasesOpened || 0}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Member Since</label>
            <div className="text-lg">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
