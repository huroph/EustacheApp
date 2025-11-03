// Hook React pour la gestion des séquences avec Supabase
// src/hooks/useSequences.ts

'use client'

import { useState, useEffect } from 'react'
import { SequencesService, type Sequence, type SequenceWithProject, type SequenceCreateInput } from '@/lib/services/sequences'

export function useSequences(projectId?: string) {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSequences = async () => {
    // Ne rien faire si projectId est undefined
    if (!projectId) {
      setSequences([])
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await SequencesService.getByProject(projectId)
      setSequences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors du chargement des séquences:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSequences()
  }, [projectId]) // Ne se déclenche que si projectId change réellement

  const createSequence = async (sequenceData: SequenceCreateInput) => {
    // Vérifier que project_id correspond au projectId du hook
    if (sequenceData.project_id !== projectId) {
      throw new Error('ID du projet non valide')
    }

    try {
      console.log(`Création d'une nouvelle séquence pour le projet ${projectId}`)
      const newSequence = await SequencesService.create(sequenceData)
      
      // Recharger toutes les séquences pour avoir la numérotation à jour
      await loadSequences()
      
      return newSequence
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      throw err
    }
  }

  const updateSequence = async (id: string, updates: Partial<Sequence>) => {
    try {
      const updatedSequence = await SequencesService.update(id, updates)
      setSequences(prev => 
        prev.map(sequence => 
          sequence.id === id ? updatedSequence : sequence
        )
      )
      return updatedSequence
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const deleteSequence = async (id: string) => {
    try {
      // Vérifier que la séquence appartient bien au projet
      if (projectId) {
        const isValid = await SequencesService.verifySequenceProject(id, projectId)
        if (!isValid) {
          throw new Error('Cette séquence n\'appartient pas au projet courant')
        }
      }

      console.log(`Suppression de la séquence ${id} et renumérotation automatique`)
      await SequencesService.delete(id)
      
      // Recharger toutes les séquences pour avoir la nouvelle numérotation
      await loadSequences()
      
      console.log('Séquences renumérotées et rechargées')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      throw err
    }
  }

  return {
    sequences,
    isLoading,
    error,
    createSequence,
    updateSequence,
    deleteSequence,
    refetch: loadSequences
  }
}

export function useSequence(id: string | null) {
  const [sequence, setSequence] = useState<SequenceWithProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setSequence(null)
      setIsLoading(false)
      return
    }

    const loadSequence = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await SequencesService.getById(id)
        setSequence(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        console.error('Erreur lors du chargement de la séquence:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSequence()
  }, [id])

  return { sequence, isLoading, error }
}

// Hook pour gérer la séquence courante (utile pour le CreateSequenceForm)
export function useCurrentSequence() {
  const [currentSequenceId, setCurrentSequenceId] = useState<string | null>(null)
  const { sequence, isLoading, error } = useSequence(currentSequenceId)

  const setCurrentSequence = (id: string | null) => {
    setCurrentSequenceId(id)
  }

  return {
    currentSequence: sequence,
    isLoading,
    error,
    setCurrentSequence
  }
}