import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LoginRequest } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../utils/token';
import { AuthContext, type AuthContextType } from './auth-context-definition';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const refreshResponse = await authApi.refresh();
      const newAccessToken = refreshResponse.data.accessToken;
      tokenStorage.set(newAccessToken);

      const meResponse = await authApi.me();
      setUser(meResponse.data);
    } catch {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshResponse = await authApi.refresh();
        tokenStorage.set(refreshResponse.data.accessToken);

        const meResponse = await authApi.me();
        setUser(meResponse.data);
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [clearAuth]);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);
    const { accessToken } = response.data;

    tokenStorage.set(accessToken);

    const meResponse = await authApi.me();
    setUser(meResponse.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Vẫn clear state dù backend logout fail
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
