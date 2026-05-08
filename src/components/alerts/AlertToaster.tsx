'use client';

import { Toaster } from 'sonner';

/**
 * AlertToaster - Wrapper for Sonner Toaster component
 * Positioned top-right with richColors and closeButton
 */
export function AlertToaster() {
  return (
    <Toaster 
      position="top-right" 
      richColors 
      closeButton 
      toastOptions={{
        style: {
          background: '#fff',
          border: '1px solid #e5e7eb',
        }
      }}
    />
  );
}