'use client'

import { EffetSpecial } from '@/lib/types-clean'
import { useEffetsSpeciaux } from '@/hooks/useEffetsSpeciaux'
import { EffetsSpeciauxList } from './effets-speciaux/EffetsSpeciauxList'
import { EffetsSpeciauxForm, EffetsSpeciauxFormRef } from './effets-speciaux/EffetsSpeciauxForm'
import { useStepForm } from '@/hooks/useStepForm'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface EffetsSpeciauxStepProps {
  sequenceId: string
}

export function EffetsSpeciauxStep({ sequenceId }: EffetsSpeciauxStepProps) {
  const { refreshEffetsSpeciaux } = useEffetsSpeciaux(sequenceId)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEffet, setEditingEffet] = useState<EffetSpecial | undefined>(undefined)
  const { enterFormMode, exitFormMode } = useStepForm()
  const formRef = useRef<EffetsSpeciauxFormRef>(null)

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
        formRef.current?.submitForm()
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
        formRef.current?.submitForm()
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
    
    // Rafraîchir la liste des effets spéciaux
    refreshEffetsSpeciaux()
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <EffetsSpeciauxForm
        ref={formRef}
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