'use client'

import { Machinerie } from '@/lib/types-clean'
import { MachinerieList } from './machinerie/MachinerieList'
import { MachinerieForm, MachinerieFormRef } from './machinerie/MachinerieForm'
import { useState, useEffect, useRef } from 'react'
import { useStepForm } from '@/hooks/useStepForm'

interface MachinerieStepProps {
  sequenceId?: string
}

export default function MachinerieStep({ sequenceId }: MachinerieStepProps) {
  const { enterFormMode, exitFormMode } = useStepForm()
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingMachinerie, setEditingMachinerie] = useState<Machinerie | undefined>(undefined)
  const [currentSequenceId, setCurrentSequenceId] = useState<string>('')
  const formRef = useRef<MachinerieFormRef>(null)

  useEffect(() => {
    // Utiliser directement le sequenceId fourni
    if (sequenceId) {
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
    
    // Utiliser le nouveau système
    enterFormMode(
      async () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        await formRef.current?.submitForm()
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingMachinerie(undefined)
      },
      'Créer'
    )
  }

  const handleEditClick = (machinerie: Machinerie) => {
    setEditingMachinerie(machinerie)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      async () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        await formRef.current?.submitForm()
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingMachinerie(undefined)
      },
      'Modifier'
    )
  }

  const handleBackToList = () => {
    setEditingMachinerie(undefined)
    setViewMode('list')
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  const handleFormSuccess = () => {
    setEditingMachinerie(undefined)
    setViewMode('list')
    
    // Sortir du mode formulaire
    exitFormMode()
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
        ref={formRef}
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