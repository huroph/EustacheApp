'use client'

import { useState, useEffect } from 'react'
import { Costume, Role } from '@/lib/types-clean'
import { sessionStore } from '@/lib/sessionStore-mock'
import { useStepForm } from '@/hooks/useStepForm'
import CostumesList from './costumes/CostumesList'
import CostumeForm from './costumes/CostumeForm'

export default function CostumeStep() {
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingCostume, setEditingCostume] = useState<Costume | null>(null)
  const [roleNames, setRoleNames] = useState<{ [roleId: string]: string }>({})
  const { enterFormMode, exitFormMode } = useStepForm()

  const loadData = () => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (currentSequence) {
      const sequenceCostumes = sessionStore.getCostumes(currentSequence.id)
      const sequenceRoles = sessionStore.getRoles(currentSequence.id)
      
      setCostumes(sequenceCostumes)
      setRoles(sequenceRoles)
      
      // Créer un map roleId -> nom pour l'affichage
      const names: { [roleId: string]: string } = {}
      sequenceRoles.forEach(role => {
        names[role.id] = role.nomRole
      })
      setRoleNames(names)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateCostume = () => {
    setEditingCostume(null)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        console.log('Submit costume form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingCostume(null)
      },
      'Créer'
    )
  }

  const handleEditCostume = (costume: Costume) => {
    setEditingCostume(costume)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        console.log('Submit costume form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingCostume(null)
      },
      'Modifier'
    )
  }

  const handleDeleteCostume = (costumeId: string) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    sessionStore.deleteCostume(currentSequence.id, costumeId)
    loadData()
  }

  const handleSaveCostume = (costumeData: Omit<Costume, 'id' | 'createdAt'>) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    if (editingCostume) {
      // Mise à jour
      sessionStore.updateCostume(currentSequence.id, editingCostume.id, costumeData)
    } else {
      // Création
      sessionStore.createCostume(currentSequence.id, costumeData)
    }

    loadData()
    setViewMode('list')
    setEditingCostume(null)
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingCostume(null)
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">{viewMode === 'list' ? 'Gestion des costumes et garde-robe' : 'Modifier le costume'}</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {viewMode === 'list' ? (
        <CostumesList
          costumes={costumes}
          onCreateCostume={handleCreateCostume}
          onEditCostume={handleEditCostume}
          onDeleteCostume={handleDeleteCostume}
          roleNames={roleNames}
        />
      ) : (
        <CostumeForm
          costume={editingCostume}
          roles={roles}
          onSave={handleSaveCostume}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
}