'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthResponse } from '@/types';
import { setTokens, clearTokens, getAccessToken, apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithTokens: (response: AuthResponse) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateCurrentUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithTokens: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  updateCurrentUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const freshUser = await apiClient<User>('/api/v1/auth/me');
      if (freshUser && freshUser.email) {
        setUser(freshUser);
        localStorage.setItem('user_info', JSON.stringify(freshUser));
      }
    } catch {
      // Token might be invalid or network issue; do not clear immediately if offline
    }
  }, []);

  const updateCurrentUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updated };
      localStorage.setItem('user_info', JSON.stringify(merged));
      return merged;
    });
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const savedUser = localStorage.getItem('user_info');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          clearTokens();
        }
      }
      setLoading(false);

      if (token) {
        // Fetch up-to-date user info in background (verified badges, roles, warnings)
        refreshUser();
      }
    };

    initAuth();
  }, [refreshUser]);

  const loginWithTokens = (authData: AuthResponse) => {
    setTokens(authData.accessToken, authData.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(authData.user));
    setUser(authData.user);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // ignore
    } finally {
      clearTokens();
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithTokens, logout, refreshUser, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
