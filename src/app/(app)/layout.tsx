// src/app/(app)/layout.tsx
'use client'

import AppShell from '@/components/layout/AppShell'
import AuthGuard from '@/components/AuthGuard'
import { Toaster } from 'react-hot-toast'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
      <Toaster 
        position="top-right"
        toastOptions={{
          // Style pour le thème sombre de l'app
          style: {
            background: '#374151', // gray-700
            color: '#ffffff',
            border: '1px solid #4b5563', // gray-600
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981', // green-500
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#ffffff',
            },
          },
        }}
      />
    </AuthGuard>
  )
}