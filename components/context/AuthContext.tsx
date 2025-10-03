'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { useDispatch } from 'react-redux';
import { setToken, clearToken } from '@/store/slices/authSlice';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore parse error
      }
    }
    if (savedToken) dispatch(setToken(savedToken));
    setIsLoading(false);
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Static login credentials for demo
    const validCredentials = [
      { email: 'iamjaisuthar@gmail.com', password: 'asdfasdf' },
      { email: 'demo@liftora.com', password: 'demo123' },
      { email: 'test@liftora.com', password: 'test123' }
    ];

    const isValid = validCredentials.some(cred => cred.email === email && cred.password === password);
    
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Create demo user
    const uiUser: User = {
      id: '1',
      name: 'Liftora Admin',
      email: email,
      role: 'Admin',
      initials: 'LA',
      avatarUrl: undefined,
    };
    
    setUser(uiUser);
    localStorage.setItem('user', JSON.stringify(uiUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token-123');
    dispatch(setToken('demo-token-123'));
    
    // Set auth cookie for middleware
    try {
      document.cookie = `auth_token=demo-token-123; path=/; SameSite=Lax`;
    } catch {}
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    dispatch(clearToken());
    // Clear auth cookie for middleware
    try {
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    } catch {}
  };

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      const next = { ...(prev || {} as User), ...partial } as User;
      try {
        localStorage.setItem('user', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

