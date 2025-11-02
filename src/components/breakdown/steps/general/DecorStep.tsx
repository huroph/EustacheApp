'use client'

import { useState, useEffect } from 'react'
import { Decor, sessionStore } from '@/lib/sessionData'
import { useStepForm } from '@/hooks/useStepForm'
import DecorsList from './DecorsList'
import DecorForm from './DecorForm'

interface DecorStepProps {
  sequenceId: string
  onUpdate: () => void
}

export default function DecorStep({ sequenceId, onUpdate }: DecorStepProps) {
  const [decors, setDecors] = useState<Decor[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingDecor, setEditingDecor] = useState<Decor | null>(null)
  const { enterFormMode, exitFormMode } = useStepForm()

  const loadData = () => {
    if (sequenceId) {
      const sequenceDecors = sessionStore.getDecors(sequenceId)
      setDecors(sequenceDecors)
      onUpdate()
    }
  }

  useEffect(() => {
    loadData()
  }, [sequenceId])

  const handleCreateDecor = () => {
    setEditingDecor(null)
    setViewMode('form')
    
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        console.log('Submit decor form')
      },
      () => {
        // Fonction d'annulation
        setViewMode('list')
        setEditingDecor(null)
      },
      'Créer'
    )
  }

  const handleEditDecor = (decor: Decor) => {
    setEditingDecor(decor)
    setViewMode('form')
    
    enterFormMode(
      () => {
        console.log('Update decor form')
      },
      () => {
        setViewMode('list')
        setEditingDecor(null)
      },
      'Modifier'
    )
  }

  const handleSaveDecor = (decorData: Omit<Decor, 'id' | 'createdAt'>) => {
    if (editingDecor) {
      // Mode édition
      sessionStore.updateDecor(sequenceId, editingDecor.id, decorData)
    } else {
      // Mode création
      sessionStore.createDecor(sequenceId, decorData)
    }
    
    setViewMode('list')
    setEditingDecor(null)
    exitFormMode()
    loadData()
  }

  const handleDeleteDecor = (decorId: string) => {
    sessionStore.deleteDecor(sequenceId, decorId)
    loadData()
  }

  const handleCancel = () => {
    setViewMode('list')
    setEditingDecor(null)
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <DecorForm
        decor={editingDecor}
        onSave={handleSaveDecor}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <DecorsList
      decors={decors}
      onCreateDecor={handleCreateDecor}
      onEditDecor={handleEditDecor}
      onDeleteDecor={handleDeleteDecor}
    />
  )
}