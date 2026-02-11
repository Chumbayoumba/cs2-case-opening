'use client';

import { create } from 'zustand';
import { apiClient } from './api-client';

interface User {
  id: number;
  email: string;
  username: string;
  balance: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/register', { email, username, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await apiClient.get('/auth/me');
      set({ user: response.data });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null });
    }
  },
}));
