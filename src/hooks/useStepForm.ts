'use client'

import { useEffect } from 'react'
import { useFooter } from '@/contexts/FooterContext'

// Hook simplifié pour les formulaires dans les steps
export function useStepForm() {
  const { setFormMode, onCancelRef, onSubmitRef, resetFooter } = useFooter()
  
  const enterFormMode = (onSubmit: () => void, onCancel: () => void, submitLabel: string = 'Créer') => {
    // Configurer les refs
    onSubmitRef.current = onSubmit
    onCancelRef.current = onCancel
    
    // Activer le mode formulaire
    setFormMode(true, { submitLabel })
  }
  
  const exitFormMode = () => {
    resetFooter()
  }
  
  return {
    enterFormMode,
    exitFormMode
  }
}