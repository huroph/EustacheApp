'use client'

import { useState, useEffect } from 'react'
import { Scene, Decor } from '@/lib/types-clean'
import { sessionStore } from '@/lib/sessionStore-mock'
import { useStepForm } from '@/hooks/useStepForm'
import ScenesList from './ScenesList'
import SceneForm from './SceneForm'

interface SceneStepProps {
  sequenceId: string
  decors: Decor[]
  onUpdate: () => void
}

export default function SceneStep({ sequenceId, decors, onUpdate }: SceneStepProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const { enterFormMode, exitFormMode } = useStepForm()

  const loadData = () => {
    if (sequenceId) {
      const sequenceScenes = sessionStore.getScenes(sequenceId)
      setScenes(sequenceScenes)
      onUpdate()
    }
  }

  useEffect(() => {
    loadData()
  }, [sequenceId])

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

  const handleSaveScene = (sceneData: Omit<Scene, 'id' | 'createdAt'>) => {
    if (editingScene) {
      // Mode édition
      sessionStore.updateScene(sequenceId, editingScene.id, sceneData)
    } else {
      // Mode création
      sessionStore.createScene(sequenceId, sceneData)
    }
    
    setViewMode('list')
    setEditingScene(null)
    exitFormMode()
    loadData()
  }

  const handleDeleteScene = (sceneId: string) => {
    sessionStore.deleteScene(sequenceId, sceneId)
    loadData()
  }

  const handleCancel = () => {
    setViewMode('list')
    setEditingScene(null)
    exitFormMode()
  }

  if (viewMode === 'form') {
    return (
      <SceneForm
        scene={editingScene}
        decors={decors}
        onSave={handleSaveScene}
        onCancel={handleCancel}
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