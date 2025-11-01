'use client'

import { useState, useEffect } from 'react'
import { Accessoire, Role, sessionStore } from '@/lib/sessionData'
import { useStepForm } from '@/hooks/useStepForm'
import AccessoiresList from './accessoires/AccessoiresList'
import AccessoireForm from './accessoires/AccessoireForm'

export default function AccessoireStep() {
  const [accessoires, setAccessoires] = useState<Accessoire[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingAccessoire, setEditingAccessoire] = useState<Accessoire | null>(null)
  const [roleNames, setRoleNames] = useState<{ [roleId: string]: string }>({})
  const { enterFormMode, exitFormMode } = useStepForm()

  const loadData = () => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (currentSequence) {
      const sequenceAccessoires = sessionStore.getAccessoires(currentSequence.id)
      const sequenceRoles = sessionStore.getRoles(currentSequence.id)
      
      setAccessoires(sequenceAccessoires)
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

  const handleCreateAccessoire = () => {
    setEditingAccessoire(null)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        console.log('Submit accessoire form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingAccessoire(null)
      },
      'Créer'
    )
  }

  const handleEditAccessoire = (accessoire: Accessoire) => {
    setEditingAccessoire(accessoire)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        console.log('Submit accessoire form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingAccessoire(null)
      },
      'Modifier'
    )
  }

  const handleDeleteAccessoire = (accessoireId: string) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    sessionStore.deleteAccessoire(currentSequence.id, accessoireId)
    loadData()
  }

  const handleSaveAccessoire = (accessoireData: Omit<Accessoire, 'id' | 'createdAt'>) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    if (editingAccessoire) {
      // Mise à jour
      sessionStore.updateAccessoire(currentSequence.id, editingAccessoire.id, accessoireData)
    } else {
      // Création
      sessionStore.createAccessoire(currentSequence.id, accessoireData)
    }

    loadData()
    setViewMode('list')
    setEditingAccessoire(null)
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingAccessoire(null)
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Configuration des accessoires et props</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {viewMode === 'list' ? (
        <AccessoiresList
          accessoires={accessoires}
          onCreateAccessoire={handleCreateAccessoire}
          onEditAccessoire={handleEditAccessoire}
          onDeleteAccessoire={handleDeleteAccessoire}
          roleNames={roleNames}
        />
      ) : (
        <AccessoireForm
          accessoire={editingAccessoire}
          roles={roles}
          onSave={handleSaveAccessoire}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
}