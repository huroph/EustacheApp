'use client'

import Button from '@/components/ui/Button'

interface StepFooterProps {
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function StepFooter({ currentIndex, total, onPrev, onNext, onSubmit }: StepFooterProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1

  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-600">
      <div className="flex items-center space-x-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onPrev}
          disabled={isFirst}
        >
          Précédent
        </Button>
        <span className="text-gray-400 text-sm">
          {currentIndex + 1} of {total}
        </span>
      </div>
      
      {isLast ? (
        <Button type="button" variant="default" onClick={onSubmit}>
          Créer la séquence
        </Button>
      ) : (
        <Button type="button" variant="default" onClick={onNext}>
          Suivant
        </Button>
      )}
    </div>
  )
}