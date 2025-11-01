'use client'

import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { useFooter } from '@/contexts/FooterContext'

export interface FormHandle {
  submit: () => void
}

interface UseExternalSubmitOptions {
  onSubmit: () => void
}

export function useExternalSubmit({ onSubmit }: UseExternalSubmitOptions) {
  const { footerState } = useFooter()
  const submitFnRef = useRef(onSubmit)

  // Mettre à jour la ref quand onSubmit change
  useEffect(() => {
    submitFnRef.current = onSubmit
  }, [onSubmit])

  // Écouter les changements du footer state pour déclencher le submit
  useEffect(() => {
    if (footerState.onSubmit) {
      // Remplacer la fonction onSubmit du footer par notre fonction
      const originalOnSubmit = footerState.onSubmit
      footerState.onSubmit = () => {
        submitFnRef.current()
      }
    }
  }, [footerState.onSubmit])

  return {
    triggerSubmit: () => submitFnRef.current()
  }
}