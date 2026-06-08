'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'ADMIN' | 'USER';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const savedToken = window.localStorage.getItem('realestate_token');
    const savedUser = window.localStorage.getItem('realestate_user');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        window.localStorage.removeItem('realestate_user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('realestate_token', nextToken);
      window.localStorage.setItem('realestate_user', JSON.stringify(nextUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('realestate_token');
      window.localStorage.removeItem('realestate_user');
    }
  };

  const value = useMemo(
    () => ({ user, token, isLoading, login, logout }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
