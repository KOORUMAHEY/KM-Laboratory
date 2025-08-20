'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

type AdminContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const adminPassword = process.env.ADMIN_PASSWORD;

  useEffect(() => {
    // Check session storage instead of local storage for better security
    const storedAdminState = sessionStorage.getItem('isAdmin');
    if (storedAdminState) {
      setIsAdmin(JSON.parse(storedAdminState));
    }
  }, []);

  const login = useCallback((password: string): boolean => {
     // Fallback for development if .env is not set up
    const correctPassword = adminPassword || 'admin';
    if (password === correctPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', JSON.stringify(true));
      return true;
    }
    return false;
  }, [adminPassword]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
