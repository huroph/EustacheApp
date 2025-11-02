'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Role } from '@/lib/types-clean'
import { useRoles } from '@/hooks/useRoles'
import { useStepForm } from '@/hooks/useStepForm'
import RolesList from './RolesList'
import RoleForm, { RoleFormRef } from './RoleForm'

interface RoleStepSupabaseProps {
  sequenceId: string
  onUpdate?: () => void
}

// Adaptateur pour convertir les données Supabase vers le type Role de l'interface
const adaptSupabaseToRole = (supabaseRole: any): Role => ({
  id: supabaseRole.id,
  type: supabaseRole.type,
  nomRole: supabaseRole.nom_role,
  interpreteNom: supabaseRole.interprete_nom,
  interpretePrenom: supabaseRole.interprete_prenom,
  genre: supabaseRole.genre,
  agePersonnage: supabaseRole.age_personnage || '',
  apparence: supabaseRole.apparence || '',
  description: supabaseRole.description || '',
  notesSequence: supabaseRole.notes_sequence || '',
  adresse: supabaseRole.adresse || '',
  email: supabaseRole.email || '',
  telephone: supabaseRole.telephone || '',
  doublureNom: supabaseRole.doublure_nom,
  doublurePrenom: supabaseRole.doublure_prenom,
  doublureType: supabaseRole.doublure_type,
  doublureAdresse: supabaseRole.doublure_adresse,
  doublureEmail: supabaseRole.doublure_email,
  doublureTelephone: supabaseRole.doublure_telephone,
  doublureNotes: supabaseRole.doublure_notes,
  createdAt: new Date(supabaseRole.created_at)
})

// Adaptateur pour convertir les données de l'interface vers Supabase
const adaptRoleToSupabase = (role: Omit<Role, 'id' | 'createdAt'>) => ({
  type: role.type,
  nom_role: role.nomRole,
  interprete_nom: role.interpreteNom,
  interprete_prenom: role.interpretePrenom,
  genre: role.genre,
  age_personnage: role.agePersonnage || undefined,
  apparence: role.apparence || undefined,
  description: role.description || undefined,
  notes_sequence: role.notesSequence || undefined,
  adresse: role.adresse || undefined,
  email: role.email || undefined,
  telephone: role.telephone || undefined,
  doublure_nom: role.doublureNom || undefined,
  doublure_prenom: role.doublurePrenom || undefined,
  doublure_type: role.doublureType || undefined,
  doublure_adresse: role.doublureAdresse || undefined,
  doublure_email: role.doublureEmail || undefined,
  doublure_telephone: role.doublureTelephone || undefined,
  doublure_notes: role.doublureNotes || undefined
})

export default function RoleStepSupabase({ sequenceId, onUpdate }: RoleStepSupabaseProps) {
  const { roles: supabaseRoles, createRole, updateRole, deleteRole, isLoading } = useRoles(sequenceId)
  const { enterFormMode, exitFormMode } = useStepForm()
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const formRef = useRef<RoleFormRef | null>(null)

  // Convertir les rôles Supabase vers le format de l'interface
  const roles: Role[] = supabaseRoles.map(adaptSupabaseToRole)

  useEffect(() => {
    if (onUpdate) {
      onUpdate()
    }
  }, [roles, onUpdate])

  const handleCreateRole = () => {
    setEditingRole(null)
    setViewMode('form')
    
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        if (formRef.current) {
          formRef.current.submitForm()
        }
      },
      () => {
        // Fonction d'annulation
        setViewMode('list')
        setEditingRole(null)
      },
      'Créer'
    )
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setViewMode('form')
    
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Modifier" dans le footer
        if (formRef.current) {
          formRef.current.submitForm()
        }
      },
      () => {
        setViewMode('list')
        setEditingRole(null)
      },
      'Modifier'
    )
  }

  const handleDeleteRole = async (roleId: string) => {
    const roleToDelete = roles.find(r => r.id === roleId)
    if (!roleToDelete) return

    if (confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${roleToDelete.nomRole}" ?`)) {
      const loadingToast = toast.loading('Suppression du rôle...')
      
      try {
        await deleteRole(roleId)
        toast.success(`Rôle "${roleToDelete.nomRole}" supprimé avec succès`, {
          id: loadingToast,
        })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression du rôle', {
          id: loadingToast,
        })
      }
    }
  }

  const handleSaveRole = async (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const isEditing = !!editingRole
    const loadingToast = toast.loading(isEditing ? 'Modification du rôle...' : 'Création du rôle...')
    
    try {
      const supabaseData = {
        ...adaptRoleToSupabase(roleData),
        sequence_id: sequenceId
      }
      
      if (editingRole) {
        // Pour update, on n'a pas besoin de sequence_id
        await updateRole(editingRole.id, adaptRoleToSupabase(roleData))
        toast.success(`Rôle "${roleData.nomRole}" modifié avec succès`, {
          id: loadingToast,
        })
      } else {
        await createRole(supabaseData)
        toast.success(`Rôle "${roleData.nomRole}" créé avec succès`, {
          id: loadingToast,
        })
      }
      setViewMode('list')
      setEditingRole(null)
      exitFormMode()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error(isEditing ? 'Erreur lors de la modification du rôle' : 'Erreur lors de la création du rôle', {
        id: loadingToast,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Chargement des rôles...</div>
      </div>
    )
  }

  if (viewMode === 'form') {
    return (
      <RoleForm
        ref={formRef}
        role={editingRole}
        onSave={handleSaveRole}
        onCancel={() => {
          setViewMode('list')
          setEditingRole(null)
          exitFormMode()
        }}
      />
    )
  }

  return (
    <RolesList
      roles={roles}
      onCreateRole={handleCreateRole}
      onEditRole={handleEditRole}
      onDeleteRole={handleDeleteRole}
    />
  )
}
