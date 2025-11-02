'use client'

import { useState, ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  headerColor?: string
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true,
  headerColor = "bg-gray-700"
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${headerColor} p-4 flex items-center justify-between text-left hover:opacity-90 transition-opacity`}
      >
        <h3 className="text-white font-medium">{title}</h3>
        <svg 
          className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}