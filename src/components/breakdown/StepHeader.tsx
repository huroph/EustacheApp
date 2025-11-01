'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface StepHeaderProps {
  current: string
  steps: readonly string[]
  onSelect: (step: string) => void
  onClose: () => void
}

export default function StepHeader({ current, steps, onSelect, onClose }: StepHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStepSelect = (step: string) => {
    onSelect(step)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative">
        {/* Dropdown Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"
        >
          <div className="w-6 h-6 bg-orange-500 rounded"></div>
          <span className="font-medium">{current}</span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-10">
            <div className="py-2">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => handleStepSelect(step)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-600 transition-colors ${
                    step === current ? 'bg-slate-600 text-white' : 'text-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step === current ? 'bg-orange-500 text-white' : 'bg-slate-500 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button variant="secondary" onClick={onClose}>
        ✕
      </Button>
    </div>
  )
}