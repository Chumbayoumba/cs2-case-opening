'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

interface Item {
  id: number;
  name: string;
  rarity: string;
  price: string;
  imageUrl: string;
}

interface CaseItem {
  id: number;
  dropRate: string;
  item: Item;
}

interface CaseDetails {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: string;
  items: CaseItem[];
}

export default function CaseOpeningPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [wonItem, setWonItem] = useState<Item | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', params.slug],
    queryFn: async () => {
      const response = await apiClient.get(`/cases/${params.slug}`);
      return response.data as CaseDetails;
    },
  });

  const openMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/cases/${params.slug}/open`);
      return response.data;
    },
    onSuccess: (data) => {
      setWonItem(data.item);
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const handleOpen = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const balance = parseFloat(user.balance);
    const price = parseFloat(caseData?.price || '0');

    if (balance < price) {
      alert('Insufficient balance!');
      return;
    }

    setIsOpening(true);
    setWonItem(null);

    // Simulate opening animation
    setTimeout(async () => {
      try {
        await openMutation.mutateAsync();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to open case');
      } finally {
        setIsOpening(false);
      }
    }, 2000);
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!caseData) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Case not found</div>;
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={caseData.imageUrl}
              alt={caseData.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{caseData.name}</h1>
          <p className="text-gray-400 mb-6">{caseData.description}</p>

          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <div className="text-3xl font-bold text-yellow-400 mb-4">
              ${parseFloat(caseData.price).toFixed(2)}
            </div>

            <button
              onClick={handleOpen}
              disabled={isOpening || openMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg text-lg"
            >
              {isOpening ? 'Opening...' : 'Open Case'}
            </button>
          </div>

          {wonItem && (
            <div className="bg-green-500/10 border border-green-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">You won!</h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={wonItem.imageUrl}
                    alt={wonItem.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <div className={`font-bold ${getRarityColor(wonItem.rarity)}`}>
                    {wonItem.name}
                  </div>
                  <div className="text-yellow-400">
                    ${parseFloat(wonItem.price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Possible Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {caseData.items.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-gray-800 p-4 rounded-lg text-center"
            >
              <div className="relative h-24 mb-2">
                <Image
                  src={caseItem.item.imageUrl}
                  alt={caseItem.item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className={`text-sm font-semibold mb-1 ${getRarityColor(caseItem.item.rarity)}`}>
                {caseItem.item.name}
              </div>
              <div className="text-xs text-gray-400">
                {parseFloat(caseItem.dropRate).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
