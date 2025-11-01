'use client'

import { useState, useEffect } from 'react'
import { Role, sessionStore } from '@/lib/sessionData'
import RolesList from './roles/RolesList'
import RoleForm from './roles/RoleForm'

export default function RoleStep() {
  const [roles, setRoles] = useState<Role[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingRole, setEditingRole] = useState<Role | null>(null)

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
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setViewMode('form')
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
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingRole(null)
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