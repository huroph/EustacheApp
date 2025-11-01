'use client'

import { sessionStore, Machinerie } from '@/lib/sessionData'
import { MachinerieList } from './machinerie/MachinerieList'
import { MachinerieForm } from './machinerie/MachinerieForm'
import { useState, useEffect } from 'react'

interface MachinerieStepProps {
  sequenceId?: string
}

export default function MachinerieStep({ sequenceId }: MachinerieStepProps) {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingMachinerie, setEditingMachinerie] = useState<Machinerie | undefined>(undefined)
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
    setEditingMachinerie(undefined)
  }, [currentSequenceId])

  const handleCreateClick = () => {
    setEditingMachinerie(undefined)
    setViewMode('form')
  }

  const handleEditClick = (machinerie: Machinerie) => {
    setEditingMachinerie(machinerie)
    setViewMode('form')
  }

  const handleBackToList = () => {
    setEditingMachinerie(undefined)
    setViewMode('list')
  }

  const handleFormSuccess = () => {
    setEditingMachinerie(undefined)
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
      <MachinerieForm
        sequenceId={currentSequenceId}
        machinerie={editingMachinerie}
        onCancel={handleBackToList}
        onSuccess={handleFormSuccess}
      />
    )
  }

  return (
    <MachinerieList
      sequenceId={currentSequenceId}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
    />
  )
}