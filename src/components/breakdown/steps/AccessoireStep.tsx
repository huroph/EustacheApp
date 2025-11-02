'use client'

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { Accessoire, Role } from '@/lib/types-clean'
import { useAccessoires } from '@/hooks/useAccessoires'
import { useRoles } from '@/hooks/useRoles'
import { AccessoiresService } from '@/services/AccessoiresService'
import { adaptSupabaseToRole } from '@/services/RolesService'
import { useStepForm } from '@/hooks/useStepForm'
import AccessoiresList from './accessoires/AccessoiresList'
import AccessoireForm, { AccessoireFormRef } from './accessoires/AccessoireForm'
import toast from 'react-hot-toast'

interface AccessoireStepProps {
  sequenceId: string
}

export interface AccessoireStepRef {
  handleSubmit: () => Promise<boolean>
}

export default forwardRef<AccessoireStepRef, AccessoireStepProps>(function AccessoireStep({ sequenceId }, ref) {
  const { accessoires, isLoading, createAccessoire, updateAccessoire, deleteAccessoire } = useAccessoires(sequenceId)
  const { roles, isLoading: rolesLoading } = useRoles(sequenceId)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingAccessoire, setEditingAccessoire] = useState<Accessoire | null>(null)
  const [roleNames, setRoleNames] = useState<{ [roleId: string]: string }>({})
  const { enterFormMode, exitFormMode } = useStepForm()
  const formRef = useRef<AccessoireFormRef | null>(null)

  // Exposer les méthodes via ref pour le footer
  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      // Pour les accessoires, pas besoin de validation spécifique
      return true
    }
  }))

  // Charger les noms des rôles quand les rôles changent
  useEffect(() => {
    if (roles.length > 0) {
      const names: { [roleId: string]: string } = {}
      roles.forEach(role => {
        const adaptedRole = adaptSupabaseToRole(role)
        names[adaptedRole.id] = adaptedRole.nomRole
      })
      setRoleNames(names)
    }
  }, [roles])

  const handleCreateAccessoire = () => {
    setEditingAccessoire(null)
    setViewMode('form')
    
    // Utiliser le nouveau système
    enterFormMode(
      () => {
        // Cette fonction sera appelée quand on clique sur "Créer" dans le footer
        if (formRef.current) {
          formRef.current.submitForm()
        }
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
        if (formRef.current) {
          formRef.current.submitForm()
        }
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingAccessoire(null)
      },
      'Modifier'
    )
  }

  const handleDeleteAccessoire = async (accessoireId: string) => {
    try {
      const success = await deleteAccessoire(accessoireId)
      
      if (success) {
        toast.success('Accessoire supprimé avec succès', {
          style: { background: '#374151', color: '#fff' }
        })
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'accessoire:', error)
      toast.error('Erreur lors de la suppression de l\'accessoire', {
        style: { background: '#374151', color: '#fff' }
      })
    }
  }

  const handleSaveAccessoire = async (accessoireData: Omit<Accessoire, 'id' | 'createdAt'>) => {
    try {
      if (editingAccessoire) {
        // Mise à jour
        const result = await updateAccessoire(editingAccessoire.id, {
          nom_accessoire: accessoireData.nomAccessoire,
          role_id: accessoireData.roleId || undefined,
          statut: accessoireData.statut,
          notes_accessoire: accessoireData.notesAccessoire || undefined
        })

        if (result) {
          toast.success('Accessoire modifié avec succès', {
            style: { background: '#374151', color: '#fff' }
          })
        }
      } else {
        // Création
        const result = await createAccessoire({
          sequence_id: sequenceId,
          nom_accessoire: accessoireData.nomAccessoire,
          role_id: accessoireData.roleId || undefined,
          statut: accessoireData.statut,
          notes_accessoire: accessoireData.notesAccessoire || undefined
        })

        if (result) {
          toast.success('Accessoire créé avec succès', {
            style: { background: '#374151', color: '#fff' }
          })
        }
      }

      setViewMode('list')
      setEditingAccessoire(null)
      
      // Sortir du mode formulaire
      exitFormMode()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'accessoire:', error)
      toast.error('Erreur lors de la sauvegarde de l\'accessoire', {
        style: { background: '#374151', color: '#fff' }
      })
    }
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingAccessoire(null)
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  // Adapter les accessoires Supabase vers l'interface frontend
  const adaptedAccessoires: Accessoire[] = accessoires.map(accessoire => 
    AccessoiresService.adaptSupabaseToAccessoire(accessoire)
  )

  // Adapter les rôles Supabase vers l'interface frontend
  const adaptedRoles: Role[] = roles.map(role => adaptSupabaseToRole(role))

  if (isLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">{viewMode === 'list' ? 'Gestion des accessoires' : 'Modifier l\'accessoire'}</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {viewMode === 'list' ? (
        <AccessoiresList
          accessoires={adaptedAccessoires}
          onCreateAccessoire={handleCreateAccessoire}
          onEditAccessoire={handleEditAccessoire}
          onDeleteAccessoire={handleDeleteAccessoire}
          roleNames={roleNames}
        />
      ) : (
        <AccessoireForm
          ref={formRef}
          accessoire={editingAccessoire}
          roles={adaptedRoles}
          onSave={handleSaveAccessoire}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
})