'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';

interface Case {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: string;
}

export default function CasesPage() {
  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const response = await apiClient.get('/cases');
      return response.data as Case[];
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading cases...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Cases</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases?.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/cases/${caseItem.slug}`}
            className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
          >
            <div className="relative h-48">
              <Image
                src={caseItem.imageUrl}
                alt={caseItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{caseItem.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{caseItem.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-400">
                  ${parseFloat(caseItem.price).toFixed(2)}
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Open
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
