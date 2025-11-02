'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Decor } from '@/lib/types-clean'
import { useDecors } from '@/hooks/useDecors'
import { useStepForm } from '@/hooks/useStepForm'
import DecorsList from './DecorsList'
import DecorForm, { DecorFormRef } from './DecorForm'

interface DecorStepSupabaseProps {
  sequenceId: string
  onUpdate?: () => void
}

// Adaptateur pour convertir les données Supabase vers le type Decor de l'interface
const adaptSupabaseToDecor = (supabaseDecor: any): Decor => ({
  id: supabaseDecor.id,
  title: supabaseDecor.title,
  address: supabaseDecor.address || '',
  manoir: supabaseDecor.location_type === 'Intérieur' ? 'Intérieur' : 'Extérieur',
  status: supabaseDecor.status,
  createdAt: new Date(supabaseDecor.created_at)
})

// Adaptateur pour convertir les données de l'interface vers Supabase
const adaptDecorToSupabase = (decor: Omit<Decor, 'id' | 'createdAt'>) => ({
  title: decor.title,
  address: decor.address,
  location_type: decor.manoir,
  status: decor.status
})

export default function DecorStepSupabase({ sequenceId, onUpdate }: DecorStepSupabaseProps) {
  const { decors: supabaseDecors, createDecor, updateDecor, deleteDecor, isLoading } = useDecors(sequenceId)
  const { enterFormMode, exitFormMode } = useStepForm()
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingDecor, setEditingDecor] = useState<Decor | null>(null)
  const formRef = useRef<DecorFormRef | null>(null)

  // Convertir les décors Supabase vers le format de l'interface
  const decors: Decor[] = supabaseDecors.map(adaptSupabaseToDecor)

  useEffect(() => {
    if (onUpdate) {
      onUpdate()
    }
  }, [decors, onUpdate])

  const handleCreateDecor = () => {
    setEditingDecor(null)
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
        setEditingDecor(null)
      },
      'Créer'
    )
  }

  const handleEditDecor = (decor: Decor) => {
    setEditingDecor(decor)
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
        setEditingDecor(null)
      },
      'Modifier'
    )
  }

  const handleDeleteDecor = async (decorId: string) => {
    if (confirm('Supprimer ce décor ?')) {
      const loadingToast = toast.loading('Suppression du décor...')
      try {
        await deleteDecor(decorId)
        toast.success('Décor supprimé avec succès', {
          id: loadingToast,
        })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression du décor', {
          id: loadingToast,
        })
      }
    }
  }

  const handleSaveDecor = async (decorData: Omit<Decor, 'id' | 'createdAt'>) => {
    const isEditing = !!editingDecor
    const loadingToast = toast.loading(isEditing ? 'Modification du décor...' : 'Création du décor...')
    
    try {
      const supabaseData = {
        ...adaptDecorToSupabase(decorData),
        sequence_id: sequenceId
      }
      
      if (editingDecor) {
        // Pour update, on n'a pas besoin de sequence_id
        await updateDecor(editingDecor.id, adaptDecorToSupabase(decorData))
        toast.success(`Décor "${decorData.title}" modifié avec succès`, {
          id: loadingToast,
        })
      } else {
        await createDecor(supabaseData)
        toast.success(`Décor "${decorData.title}" créé avec succès`, {
          id: loadingToast,
        })
      }
      setViewMode('list')
      setEditingDecor(null)
      exitFormMode()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error(isEditing ? 'Erreur lors de la modification du décor' : 'Erreur lors de la création du décor', {
        id: loadingToast,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Chargement des décors...</div>
      </div>
    )
  }

  if (viewMode === 'form') {
    return (
      <DecorForm
        ref={formRef}
        decor={editingDecor}
        onSave={handleSaveDecor}
        onCancel={() => {
          setViewMode('list')
          setEditingDecor(null)
          exitFormMode()
        }}
      />
    )
  }

  return (
    <DecorsList
      decors={decors}
      onCreateDecor={handleCreateDecor}
      onEditDecor={handleEditDecor}
      onDeleteDecor={handleDeleteDecor}
    />
  )
}