'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { useDispatch } from 'react-redux';
import { setToken, clearToken } from '@/store/slices/authSlice';
import { getTokenFromCookies, setTokenInCookies, clearTokenFromCookies, isAuthenticated, getUserFromToken } from '@/utils/auth';

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
    // Check for existing authentication
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const cookieToken = getTokenFromCookies();
    
    // If we have a valid token in cookies, use it
    if (cookieToken && isAuthenticated()) {
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        const uiUser: User = {
          id: tokenUser.id.toString(),
          name: tokenUser.email.split('@')[0],
          email: tokenUser.email,
          role: tokenUser.role,
          initials: tokenUser.email.charAt(0).toUpperCase(),
          avatarUrl: undefined,
        };
        setUser(uiUser);
        dispatch(setToken(cookieToken));
        setIsLoading(false);
        return;
      }
    }
    
    // Fallback to localStorage
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch {
        // ignore parse error
      }
    }
    if (savedToken) {
      dispatch(setToken(savedToken));
    }
    
    setIsLoading(false);
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const { authService } = await import('@/utils/apiServices');
      const response = await authService.login(email, password);
      
      console.log('Login response:', response);
      
      if (response.success && response.token) {
        const { token, admin } = response;
        
        console.log('Login successful, setting up user session...');
        
        // Create user object from admin data
        const uiUser: User = {
          id: admin.id.toString(),
          name: admin.email.split('@')[0], // Use email prefix as name if name not provided
          email: admin.email,
          role: 'Admin',
          initials: admin.email.charAt(0).toUpperCase(),
          avatarUrl: undefined,
        };
        
        setUser(uiUser);
        localStorage.setItem('user', JSON.stringify(uiUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        dispatch(setToken(token));
        
        // Set auth cookie for middleware
        setTokenInCookies(token);
        
        console.log('User session established successfully');
        return true;
      } else {
        console.error('Login failed - invalid response:', response);
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    dispatch(clearToken());
    // Clear auth cookie for middleware
    clearTokenFromCookies();
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


