'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Scene, Decor } from '@/lib/types-clean'
import { useScenes } from '@/hooks/useScenes'
import { useStepForm } from '@/hooks/useStepForm'
import ScenesList from './ScenesList'
import SceneForm from './SceneForm'

interface SceneStepSupabaseProps {
  sequenceId: string
  decors: Decor[]
  onUpdate?: () => void
}

// Adaptateur pour convertir les données Supabase vers le type Scene de l'interface
const adaptSupabaseToScene = (supabaseScene: any): Scene => ({
  id: supabaseScene.id,
  numero: supabaseScene.numero || '',
  decorId: supabaseScene.decor_id,
  status: supabaseScene.status,
  description: supabaseScene.description || undefined,
  createdAt: new Date(supabaseScene.created_at)
})

// Adaptateur pour convertir les données de l'interface vers Supabase
const adaptSceneToSupabase = (scene: Omit<Scene, 'id' | 'createdAt'>) => ({
  numero: scene.numero,
  decor_id: scene.decorId,
  status: scene.status,
  description: scene.description || null
})

export default function SceneStepSupabase({ sequenceId, decors, onUpdate }: SceneStepSupabaseProps) {
  const { scenes: supabaseScenes, createScene, updateScene, deleteScene, isLoading } = useScenes(sequenceId)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const { enterFormMode, exitFormMode } = useStepForm()

  // Convertir les scènes Supabase vers le format de l'interface
  const scenes: Scene[] = supabaseScenes.map(adaptSupabaseToScene)

  useEffect(() => {
    if (onUpdate) {
      onUpdate()
    }
  }, [scenes, onUpdate])

  const handleCreateScene = () => {
    if (decors.length === 0) return
    
    setEditingScene(null)
    setViewMode('form')
    
    enterFormMode(
      () => {
        console.log('Submit scene form')
      },
      () => {
        setViewMode('list')
        setEditingScene(null)
      },
      'Créer'
    )
  }

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene)
    setViewMode('form')
    
    enterFormMode(
      () => {
        console.log('Update scene form')
      },
      () => {
        setViewMode('list')
        setEditingScene(null)
      },
      'Modifier'
    )
  }

  const handleDeleteScene = async (sceneId: string) => {
    if (confirm('Supprimer cette scène ?')) {
      const loadingToast = toast.loading('Suppression de la scène...')
      try {
        await deleteScene(sceneId)
        toast.success('Scène supprimée avec succès', {
          id: loadingToast,
        })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression de la scène', {
          id: loadingToast,
        })
      }
    }
  }

  const handleSaveScene = async (sceneData: Omit<Scene, 'id' | 'createdAt'>) => {
    const isEditing = !!editingScene
    const loadingToast = toast.loading(isEditing ? 'Modification de la scène...' : 'Création de la scène...')
    
    try {
      const supabaseData = {
        ...adaptSceneToSupabase(sceneData),
        sequence_id: sequenceId
      }
      
      if (editingScene) {
        // Pour update, on n'a pas besoin de sequence_id
        await updateScene(editingScene.id, adaptSceneToSupabase(sceneData))
        toast.success(`Scène "${sceneData.numero}" modifiée avec succès`, {
          id: loadingToast,
        })
      } else {
        await createScene(supabaseData)
        toast.success(`Scène "${sceneData.numero}" créée avec succès`, {
          id: loadingToast,
        })
      }
      setViewMode('list')
      setEditingScene(null)
      exitFormMode()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error(isEditing ? 'Erreur lors de la modification de la scène' : 'Erreur lors de la création de la scène', {
        id: loadingToast,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Chargement des scènes...</div>
      </div>
    )
  }

  if (viewMode === 'form') {
    return (
      <SceneForm
        scene={editingScene}
        decors={decors}
        onSave={handleSaveScene}
        onCancel={() => {
          setViewMode('list')
          setEditingScene(null)
          exitFormMode()
        }}
      />
    )
  }

  return (
    <ScenesList
      scenes={scenes}
      decors={decors}
      onCreateScene={handleCreateScene}
      onEditScene={handleEditScene}
      onDeleteScene={handleDeleteScene}
    />
  )
}