'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

interface FooterState {
  isFormMode: boolean
  submitLabel: string
}

interface FooterContextType {
  footerState: FooterState
  setFormMode: (enabled: boolean, options?: {
    submitLabel?: string
  }) => void
  resetFooter: () => void
  // Refs pour les callbacks
  onCancelRef: React.MutableRefObject<(() => void) | undefined>
  onSubmitRef: React.MutableRefObject<(() => void) | undefined>
  // Fonctions pour trigger les actions
  triggerCancel: () => void
  triggerSubmit: () => void
}

const FooterContext = createContext<FooterContextType | undefined>(undefined)

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [footerState, setFooterState] = useState<FooterState>({
    isFormMode: false,
    submitLabel: 'Créer'
  })

  const onCancelRef = useRef<(() => void) | undefined>(undefined)
  const onSubmitRef = useRef<(() => void) | undefined>(undefined)

  const setFormMode = useCallback((enabled: boolean, options?: {
    submitLabel?: string
  }) => {
    setFooterState({
      isFormMode: enabled,
      submitLabel: enabled ? (options?.submitLabel || 'Créer') : 'Créer'
    })
  }, [])

  const resetFooter = useCallback(() => {
    setFooterState({
      isFormMode: false,
      submitLabel: 'Créer'
    })
    onCancelRef.current = undefined
    onSubmitRef.current = undefined
  }, [])

  const triggerCancel = useCallback(() => {
    if (onCancelRef.current) {
      onCancelRef.current()
    }
    // Automatiquement sortir du mode formulaire après l'annulation
    setFooterState({
      isFormMode: false,
      submitLabel: 'Créer'
    })
    onCancelRef.current = undefined
    onSubmitRef.current = undefined
  }, [])

  const triggerSubmit = useCallback(() => {
    if (onSubmitRef.current) {
      onSubmitRef.current()
    }
    // Note: Ne pas automatiquement sortir du mode formulaire ici
    // car le formulaire peut avoir des erreurs de validation
  }, [])

  const value: FooterContextType = {
    footerState,
    setFormMode,
    resetFooter,
    onCancelRef,
    onSubmitRef,
    triggerCancel,
    triggerSubmit
  }

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  )
}

export function useFooter() {
  const context = useContext(FooterContext)
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider')
  }
  return context
}