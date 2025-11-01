'use client'

import { sessionStore, EquipeTechnique } from '@/lib/sessionData'
import { EquipesTechniquesList } from './equipes-techniques/EquipesTechniquesList'
import { EquipesTechniquesForm } from './equipes-techniques/EquipesTechniquesForm'
import { useState, useEffect } from 'react'

export function EquipesTechniquesStep() {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEquipe, setEditingEquipe] = useState<EquipeTechnique | undefined>(undefined)

  const handleCreateClick = () => {
    setEditingEquipe(undefined)
    setViewMode('form')
  }

  const handleEditClick = (equipe: EquipeTechnique) => {
    setEditingEquipe(equipe)
    setViewMode('form')
  }

  const handleBackToList = () => {
    setEditingEquipe(undefined)
    setViewMode('list')
  }

  const handleFormSuccess = () => {
    setEditingEquipe(undefined)
    setViewMode('list')
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