'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

  // Check authentication status on mount by calling /auth/me
  // JWT cookie is automatically sent by browser
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include', // Send cookies with request
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Not authenticated or token expired
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Allow cookies to be set and sent
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    // JWT is now in HttpOnly cookie (set by backend)
    // No need to store in localStorage
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, fullName: string, phone?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Allow cookies to be set and sent
      body: JSON.stringify({ email, password, fullName, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    // JWT is now in HttpOnly cookie (set by backend)
    // No need to store in localStorage
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HttpOnly cookie
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Send cookies with request
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with client-side logout even if request fails
    }

    // Clear client-side user state
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
