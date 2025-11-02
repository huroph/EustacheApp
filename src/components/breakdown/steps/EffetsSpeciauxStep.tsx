'use client'

import { EffetSpecial } from '@/lib/types-clean'
import { sessionStore } from '@/lib/sessionStore-mock'
import { EffetsSpeciauxList } from './effets-speciaux/EffetsSpeciauxList'
import { EffetsSpeciauxForm } from './effets-speciaux/EffetsSpeciauxForm'
import { useStepForm } from '@/hooks/useStepForm'
import { useState, useEffect } from 'react'

interface EffetsSpeciauxStepProps {
  sequenceId: string
}

export function EffetsSpeciauxStep({ sequenceId }: EffetsSpeciauxStepProps) {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEffet, setEditingEffet] = useState<EffetSpecial | undefined>(undefined)
  const { enterFormMode, exitFormMode } = useStepForm()

  // Réinitialiser quand on change de séquence
  useEffect(() => {
    setViewMode('list')
    setEditingEffet(undefined)
  }, [sequenceId])

  const handleCreateClick = () => {
    setEditingEffet(undefined)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        console.log('Submit effet special form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingEffet(undefined)
      },
      'Créer'
    )
  }

  const handleEditClick = (effet: EffetSpecial) => {
    setEditingEffet(effet)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        console.log('Submit effet special form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingEffet(undefined)
      },
      'Modifier'
    )
  }

  const handleBackToList = () => {
    setEditingEffet(undefined)
    setViewMode('list')
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  const handleFormSuccess = () => {
    setEditingEffet(undefined)
    setViewMode('list')
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <EffetsSpeciauxForm
        sequenceId={sequenceId}
        effet={editingEffet}
        onCancel={handleBackToList}
        onSuccess={handleFormSuccess}
      />
    )
  }

  return (
    <EffetsSpeciauxList
      sequenceId={sequenceId}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
    />
  )
}