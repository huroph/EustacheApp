'use client'

import { sessionStore, EquipeTechnique } from '@/lib/sessionData'
import { EquipesTechniquesList } from './equipes-techniques/EquipesTechniquesList'
import { EquipesTechniquesForm } from './equipes-techniques/EquipesTechniquesForm'
import { useState, useEffect } from 'react'
import { useStepForm } from '@/hooks/useStepForm'

export function EquipesTechniquesStep() {
  const { enterFormMode, exitFormMode } = useStepForm()
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEquipe, setEditingEquipe] = useState<EquipeTechnique | undefined>(undefined)

  const handleCreateClick = () => {
    setEditingEquipe(undefined)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        console.log('Submit equipe technique form')
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
        console.log('Submit equipe technique form')
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
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <EquipesTechniquesForm
        equipe={editingEquipe}
        onCancel={handleBackToList}
        onSuccess={handleFormSuccess}
      />
    )
  }

  return (
    <EquipesTechniquesList
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
    />
  )
}