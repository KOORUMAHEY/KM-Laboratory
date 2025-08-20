'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader } from './page-loader';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    if (previousPath !== pathname) {
      setLoading(true);
      // This timeout simulates the loading process for demonstration.
      // In a real app, you might not need this if your page content loads quickly
      // or you could tie this to data fetching events.
      const timer = setTimeout(() => {
        setLoading(false);
        setPreviousPath(pathname);
      }, 500); // Adjust delay as needed

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return (
    <>
      {loading && <PageLoader />}
      {children}
    </>
  );
}
