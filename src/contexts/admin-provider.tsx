// src/contexts/admin-provider.tsx
'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

type AdminContextType = {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>; // Made async
  logout: () => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    // Here you could also verify the token's expiry, but for simplicity, we'll just check for its presence.
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        sessionStorage.setItem('adminToken', token);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, [API_URL]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('adminToken');
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}