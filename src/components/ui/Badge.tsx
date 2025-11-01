// src/components/ui/Badge.tsx
import React from 'react'

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-600/10 px-2 py-1 text-xs font-semibold text-primary-700">
      {children}
    </span>
  )
}
