'use client'

import { sessionStore, MaterielSon } from '@/lib/sessionData'
import { MaterielSonList } from './son/MaterielSonList'
import { MaterielSonForm } from './son/MaterielSonForm'
import { useState, useEffect } from 'react'

interface SonStepProps {
  sequenceId?: string
}

export default function SonStep({ sequenceId }: SonStepProps) {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingMateriel, setEditingMateriel] = useState<MaterielSon | undefined>(undefined)
  const [currentSequenceId, setCurrentSequenceId] = useState<string>('')

  useEffect(() => {
    // Récupérer l'ID de la séquence courante
    const currentSeq = sessionStore.getCurrentSequence()
    if (currentSeq) {
      setCurrentSequenceId(currentSeq.id)
    } else if (sequenceId) {
      setCurrentSequenceId(sequenceId)
    }
  }, [sequenceId])

  // Réinitialiser quand on change de séquence
  useEffect(() => {
    setViewMode('list')
    setEditingMateriel(undefined)
  }, [currentSequenceId])

  const handleCreateClick = () => {
    setEditingMateriel(undefined)
    setViewMode('form')
  }

  const handleEditClick = (materiel: MaterielSon) => {
    setEditingMateriel(materiel)
    setViewMode('form')
  }

  const handleBackToList = () => {
    setEditingMateriel(undefined)
    setViewMode('list')
  }

  const handleFormSuccess = () => {
    setEditingMateriel(undefined)
    setViewMode('list')
  }

  if (!currentSequenceId) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-700 p-6 rounded-lg text-center">
          <p className="text-gray-400">Aucune séquence sélectionnée</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'form') {
    return (
      <MaterielSonForm
        sequenceId={currentSequenceId}
        materiel={editingMateriel}
        onCancel={handleBackToList}
        onSuccess={handleFormSuccess}
      />
    )
  }

  return (
    <MaterielSonList
      sequenceId={currentSequenceId}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
    />
  )
}