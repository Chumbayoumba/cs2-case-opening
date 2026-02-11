'use client';

import { create } from 'zustand';
import { apiClient } from './api-client';

interface User {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, accessToken } = response.data;

    if (!user.isAdmin) {
      throw new Error('Admin access required');
    }

    localStorage.setItem('adminToken', accessToken);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    set({ user: null });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.isAdmin) {
        set({ user: response.data });
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      set({ user: null });
    }
  },
}));
