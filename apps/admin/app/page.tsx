'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-white">
                Admin Panel
              </Link>
              <Link href="/cases" className="text-gray-300 hover:text-white">
                Cases
              </Link>
              <Link href="/items" className="text-gray-300 hover:text-white">
                Items
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{user.username}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/cases"
            className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Cases</h2>
            <p className="text-gray-400">Create, edit, and delete cases</p>
          </Link>

          <Link
            href="/items"
            className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Items</h2>
            <p className="text-gray-400">Create, edit, and delete items</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
