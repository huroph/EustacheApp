'use client'

import { EquipeTechnique } from '@/lib/types-clean'
import { useEquipesTechniques } from '@/hooks/useEquipesTechniques'
import { EquipesTechniquesList } from './equipes-techniques/EquipesTechniquesList'
import { EquipesTechniquesForm, EquipesTechniquesFormRef } from './equipes-techniques/EquipesTechniquesForm'
import { useState, useEffect, useRef } from 'react'
import { useStepForm } from '@/hooks/useStepForm'
import toast from 'react-hot-toast'

interface EquipesTechniquesStepProps {
  sequenceId: string
}

export function EquipesTechniquesStep({ sequenceId }: EquipesTechniquesStepProps) {
  const { refreshEquipesTechniques } = useEquipesTechniques(sequenceId)
  const { enterFormMode, exitFormMode } = useStepForm()
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEquipe, setEditingEquipe] = useState<EquipeTechnique | undefined>(undefined)
  const formRef = useRef<EquipesTechniquesFormRef>(null)

  // Réinitialiser quand on change de séquence
  useEffect(() => {
    setViewMode('list')
    setEditingEquipe(undefined)
  }, [sequenceId])

  const handleCreateClick = () => {
    setEditingEquipe(undefined)
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
        setEditingEquipe(undefined)
      },
      'Créer'
    )
  }

  const handleEditClick = (equipe: EquipeTechnique) => {
    setEditingEquipe(equipe)
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
        setEditingEquipe(undefined)
      },
      'Modifier'
    )
  }

  const handleBackToList = () => {
    setEditingEquipe(undefined)
    setViewMode('list')
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  const handleFormSuccess = () => {
    setEditingEquipe(undefined)
    setViewMode('list')
    
    // Rafraîchir la liste des équipes techniques
    refreshEquipesTechniques()
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <EquipesTechniquesForm
        ref={formRef}
        sequenceId={sequenceId}
        equipe={editingEquipe}
        onCancel={handleBackToList}
        onSuccess={handleFormSuccess}
      />
    )
  }

  return (
    <EquipesTechniquesList
      sequenceId={sequenceId}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
    />
  )
}