'use client'

import { useState, useEffect } from 'react'
import { Role, sessionStore } from '@/lib/sessionData'
import RolesList from './roles/RolesList'
import RoleForm from './roles/RoleForm'

export default function RoleStep() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const loadData = () => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (currentSequence) {
      const sequenceRoles = sessionStore.getRoles(currentSequence.id)
      setRoles(sequenceRoles)
      
      // Si on a des rôles et aucun n'est sélectionné, sélectionner le premier
      if (sequenceRoles.length > 0 && !selectedRole) {
        setSelectedRole(sequenceRoles[0])
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateRole = () => {
    setEditingRole(null)
    setShowForm(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowForm(true)
  }

  const handleDeleteRole = (roleId: string) => {
    const currentSequence = sessionStore.getCurrentSequence()
    if (!currentSequence) return

    sessionStore.deleteRole(currentSequence.id, roleId)
    loadData()
    
    // Si le rôle supprimé était sélectionné, désélectionner
    if (selectedRole?.id === roleId) {
      setSelectedRole(null)
    }
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
    setShowForm(false)
    setEditingRole(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingRole(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Configuration des rôles et personnages</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des rôles (gauche) */}
        <div className="space-y-4">
          <RolesList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onCreateRole={handleCreateRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
          />
        </div>

        {/* Formulaire de création/édition (droite) */}
        <div className="space-y-4">
          <RoleForm
            role={editingRole}
            onSave={handleSaveRole}
            onCancel={handleCancelForm}
            isVisible={showForm}
          />
        </div>
      </div>
    </div>
  )
}