// Hook React pour la gestion des scènes avec Supabase
// src/hooks/useScenes.ts

'use client'

import { useState, useEffect } from 'react'
import { ScenesService, type Scene, type SceneInsert, type SceneUpdate } from '@/lib/services/scenes'

export function useScenes(sequenceId?: string) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadScenes = async () => {
    // Ne rien faire si sequenceId est undefined
    if (!sequenceId) {
      setScenes([])
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await ScenesService.getBySequence(sequenceId)
      setScenes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors du chargement des scènes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadScenes()
  }, [sequenceId]) // Ne se déclenche que si sequenceId change réellement

  const createScene = async (sceneData: SceneInsert) => {
    try {
      const newScene = await ScenesService.create(sceneData)
      setScenes(prev => [...prev, newScene].sort((a, b) => a.numero.localeCompare(b.numero)))
      return newScene
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      throw err
    }
  }

  const updateScene = async (id: string, sceneData: SceneUpdate) => {
    try {
      const updatedScene = await ScenesService.update(id, sceneData)
      setScenes(prev => prev.map(s => s.id === id ? updatedScene : s).sort((a, b) => a.numero.localeCompare(b.numero)))
      return updatedScene
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const deleteScene = async (id: string) => {
    try {
      await ScenesService.delete(id)
      setScenes(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      throw err
    }
  }

  return {
    scenes,
    isLoading,
    error,
    createScene,
    updateScene,
    deleteScene,
    refetch: loadScenes
  }
}

// Hook pour des scènes par décor
export function useScenesByDecor(decorId?: string) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!decorId) {
      setScenes([])
      setIsLoading(false)
      return
    }

    const loadScenes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await ScenesService.getByDecor(decorId)
        setScenes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        console.error('Erreur lors du chargement des scènes par décor:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadScenes()
  }, [decorId])

  return { scenes, isLoading, error }
}

// Hook pour une scène spécifique
export function useScene(id?: string) {
  const [scene, setScene] = useState<Scene | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setScene(null)
      setIsLoading(false)
      return
    }

    const loadScene = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await ScenesService.getById(id)
        setScene(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        console.error('Erreur lors du chargement de la scène:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadScene()
  }, [id])

  return { scene, isLoading, error }
}