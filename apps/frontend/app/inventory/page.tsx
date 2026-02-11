'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface InventoryItem {
  id: number;
  acquiredAt: string;
  item: {
    id: number;
    name: string;
    rarity: string;
    price: string;
    imageUrl: string;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await apiClient.get('/user/inventory');
      return response.data as InventoryItem[];
    },
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400';
      case 'epic': return 'border-purple-400';
      case 'rare': return 'border-blue-400';
      default: return 'border-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Inventory</h1>

      {!inventory || inventory.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-4">Your inventory is empty</p>
          <a href="/cases" className="text-blue-500 hover:text-blue-400">
            Open some cases to get items
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {inventory.map((invItem) => (
            <div
              key={invItem.id}
              className={`bg-gray-800 p-4 rounded-lg border-2 ${getRarityColor(invItem.item.rarity)}`}
            >
              <div className="relative h-32 mb-2">
                <Image
                  src={invItem.item.imageUrl}
                  alt={invItem.item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="text-sm font-semibold mb-1">
                {invItem.item.name}
              </div>
              <div className="text-yellow-400 text-sm">
                ${parseFloat(invItem.item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
