'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useFooter } from '@/contexts/FooterContext'
import SequenceSummaryModal from './SequenceSummaryModal'

interface StepFooterProps {
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  sequenceId: string
  sequenceTitle: string
  editMode?: boolean
  onCancel?: () => void
}

export default function StepFooter({ 
  currentIndex, 
  total, 
  onPrev, 
  onNext, 
  onSubmit,
  sequenceId,
  sequenceTitle,
  editMode = false,
  onCancel
}: StepFooterProps) {
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  const { footerState, triggerSubmit, triggerCancel } = useFooter()

  return (
    <>
      {/* Modal récapitulatif */}
      <SequenceSummaryModal
        isOpen={showSummaryModal}
        sequenceId={sequenceId}
        sequenceTitle={sequenceTitle}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={() => {
          setShowSummaryModal(false)
          onSubmit()
        }}
      />

      {/* Footer de navigation */}
      <div className="space-y-3">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          {footerState.isFormMode ? (
            // Mode formulaire : Annuler / Créer
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={triggerCancel}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                variant="default" 
                onClick={triggerSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {footerState.submitLabel}
              </Button>
            </>
          ) : (
            // Mode navigation normale : Précédent / Suivant
            <>
              <div className="flex items-center space-x-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={isFirst ? onCancel : onPrev}
                  disabled={isFirst && !onCancel}
                >
                  {isFirst ? 'Annuler' : 'Précédent'}
                </Button>
                <span className="text-gray-400 text-sm">
                  {currentIndex + 1} of {total}
                </span>
              </div>
              
              {isLast ? (
                <Button 
                  type="button" 
                  variant="default" 
                  onClick={() => setShowSummaryModal(true)}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  {editMode ? 'Recap modifications' : 'Recap séquence'}
                </Button>
              ) : (
                <Button type="button" variant="default" onClick={onNext}>
                  Suivant
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}