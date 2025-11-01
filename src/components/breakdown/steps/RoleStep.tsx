'use client'

import { useState, useEffect } from 'react'
import { Role, sessionStore } from '@/lib/sessionData'
import { useStepForm } from '@/hooks/useStepForm'
import RolesList from './roles/RolesList'
import RoleForm from './roles/RoleForm'

export default function RoleStep() {
  const [roles, setRoles] = useState<Role[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const { enterFormMode, exitFormMode } = useStepForm()

  const loadData = () => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (currentSequence) {
      const sequenceRoles = sessionStore.getRoles(currentSequence.id)
      setRoles(sequenceRoles)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateRole = () => {
    setEditingRole(null)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        // On a besoin d'une référence vers la fonction de soumission du formulaire
        // Pour l'instant, on va juste fermer le formulaire et on implémentera la logique plus tard
        console.log('Submit role form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingRole(null)
      },
      'Créer'
    )
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        console.log('Submit role form')
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingRole(null)
      },
      'Modifier'
    )
  }

  const handleDeleteRole = (roleId: string) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    sessionStore.deleteRole(currentSequence.id, roleId)
    loadData()
  }

  const handleSaveRole = (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    if (editingRole) {
      // Mise à jour
      sessionStore.updateRole(currentSequence.id, editingRole.id, roleData)
    } else {
      // Création
      sessionStore.createRole(currentSequence.id, roleData)
    }

    loadData()
    setViewMode('list')
    setEditingRole(null)
    
    // Sortir du mode formulaire
    exitFormMode()
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingRole(null)
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Configuration des rôles et personnages</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {viewMode === 'list' ? (
        <RolesList
          roles={roles}
          onCreateRole={handleCreateRole}
          onEditRole={handleEditRole}
          onDeleteRole={handleDeleteRole}
        />
      ) : (
        <RoleForm
          role={editingRole}
          onSave={handleSaveRole}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
}