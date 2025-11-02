'use client'

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { Costume, Role } from '@/lib/types-clean'
import { useCostumes } from '@/hooks/useCostumes'
import { useRoles } from '@/hooks/useRoles'
import { CostumesService } from '@/services/CostumesService'
import { adaptSupabaseToRole } from '@/services/RolesService'
import { useStepForm } from '@/hooks/useStepForm'
import CostumesList from './costumes/CostumesList'
import CostumeForm, { CostumeFormRef } from './costumes/CostumeForm'
import toast from 'react-hot-toast'

interface CostumeStepProps {
  sequenceId: string
}

export interface CostumeStepRef {
  handleSubmit: () => Promise<boolean>
}

export default forwardRef<CostumeStepRef, CostumeStepProps>(function CostumeStep({ sequenceId }, ref) {
  const { costumes, isLoading, createCostume, updateCostume, deleteCostume } = useCostumes(sequenceId)
  const { roles, isLoading: rolesLoading } = useRoles(sequenceId)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingCostume, setEditingCostume] = useState<Costume | null>(null)
  const [roleNames, setRoleNames] = useState<{ [roleId: string]: string }>({})
  const { enterFormMode, exitFormMode } = useStepForm()
  const formRef = useRef<CostumeFormRef | null>(null)

  // Exposer les méthodes via ref pour le footer
  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      // Pour les costumes, pas besoin de validation spécifique
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

  const handleCreateCostume = () => {
    setEditingCostume(null)
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
        if (formRef.current) {
          formRef.current.submitForm()
        }
      },
      () => {
        // Fonction d'annulation - le contexte gère automatiquement la sortie du mode formulaire
        setViewMode('list')
        setEditingCostume(null)
      },
      'Modifier'
    )
  }

  const handleDeleteCostume = async (costumeId: string) => {
    try {
      const success = await deleteCostume(costumeId)
      
      if (success) {
        toast.success('Costume supprimé avec succès', {
          style: { background: '#374151', color: '#fff' }
        })
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du costume:', error)
      toast.error('Erreur lors de la suppression du costume', {
        style: { background: '#374151', color: '#fff' }
      })
    }
  }

  const handleSaveCostume = async (costumeData: Omit<Costume, 'id' | 'createdAt'>) => {
    try {
      if (editingCostume) {
        // Mise à jour
        const result = await updateCostume(editingCostume.id, {
          nom_costume: costumeData.nomCostume,
          role_id: costumeData.roleId || undefined,
          statut: costumeData.statut,
          notes_costume: costumeData.notesCostume || undefined
        })

        if (result) {
          toast.success('Costume modifié avec succès', {
            style: { background: '#374151', color: '#fff' }
          })
        }
      } else {
        // Création
        const result = await createCostume({
          sequence_id: sequenceId,
          nom_costume: costumeData.nomCostume,
          role_id: costumeData.roleId || undefined,
          statut: costumeData.statut,
          notes_costume: costumeData.notesCostume || undefined
        })

        if (result) {
          toast.success('Costume créé avec succès', {
            style: { background: '#374151', color: '#fff' }
          })
        }
      }

      setViewMode('list')
      setEditingCostume(null)
      
      // Sortir du mode formulaire
      exitFormMode()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du costume:', error)
      toast.error('Erreur lors de la sauvegarde du costume', {
        style: { background: '#374151', color: '#fff' }
      })
    }
  }

  const handleBackToList = () => {
    setViewMode('list')
    setEditingCostume(null)
    // Le contexte gère automatiquement la sortie du mode formulaire via triggerCancel
  }

  // Adapter les costumes Supabase vers l'interface frontend
  const adaptedCostumes: Costume[] = costumes.map(costume => 
    CostumesService.adaptSupabaseToCostume(costume)
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
        <p className="text-gray-400 text-sm">{viewMode === 'list' ? 'Gestion des costumes et garde-robe' : 'Modifier le costume'}</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {viewMode === 'list' ? (
        <CostumesList
          costumes={adaptedCostumes}
          onCreateCostume={handleCreateCostume}
          onEditCostume={handleEditCostume}
          onDeleteCostume={handleDeleteCostume}
          roleNames={roleNames}
        />
      ) : (
        <CostumeForm
          ref={formRef}
          costume={editingCostume}
          roles={adaptedRoles}
          onSave={handleSaveCostume}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
})