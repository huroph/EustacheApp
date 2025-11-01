'use client'

import { sessionStore, EffetSpecial } from '@/lib/sessionData'
import { EffetsSpeciauxList } from './effets-speciaux/EffetsSpeciauxList'
import { EffetsSpeciauxForm } from './effets-speciaux/EffetsSpeciauxForm'
import { useState, useEffect } from 'react'

interface EffetsSpeciauxStepProps {
  sequenceId: string
}

export function EffetsSpeciauxStep({ sequenceId }: EffetsSpeciauxStepProps) {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingEffet, setEditingEffet] = useState<EffetSpecial | undefined>(undefined)

  // Réinitialiser quand on change de séquence
  useEffect(() => {
    setViewMode('list')
    setEditingEffet(undefined)
  }, [sequenceId])

  const handleCreateClick = () => {
    setEditingEffet(undefined)
    setViewMode('form')
  }

  const handleEditClick = (effet: EffetSpecial) => {
    setEditingEffet(effet)
    setViewMode('form')
  }

  const handleBackToList = () => {
    setEditingEffet(undefined)
    setViewMode('list')
  }

  const handleFormSuccess = () => {
    setEditingEffet(undefined)
    setViewMode('list')
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