'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-white">
              CS2 Cases
            </Link>
            <Link href="/cases" className="text-gray-300 hover:text-white">
              Cases
            </Link>
            {user && (
              <>
                <Link href="/inventory" className="text-gray-300 hover:text-white">
                  Inventory
                </Link>
                <Link href="/profile" className="text-gray-300 hover:text-white">
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-yellow-400 font-semibold">
                  ${parseFloat(user.balance).toFixed(2)}
                </span>
                <span className="text-gray-300">{user.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
