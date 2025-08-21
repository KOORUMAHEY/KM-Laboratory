'use client';

import React from 'react';
import { PageLoader } from './page-loader';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  // The state management for loading has been removed to eliminate artificial delays.
  // This component can be extended in the future to handle route change animations
  // without a hardcoded loader delay.
  return (
    <>
      {children}
    </>
  );
}
