// Hook React pour la gestion des séquences avec Supabase
// src/hooks/useSequences.ts

'use client'

import { useState, useEffect } from 'react'
import { SequencesService, type Sequence, type SequenceWithProject } from '@/lib/services/sequences'

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

  const createSequence = async (sequenceData: {
    title: string
    project_id: string
    color_id?: string
    status?: 'A validé' | 'En attente' | 'Validé'
    location?: string
    summary?: string
    pre_montage?: string
    ett?: string
    time_of_day?: 'JOUR' | 'NUIT'
    location_type?: 'INT' | 'EXT'
  }) => {
    try {
      const newSequence = await SequencesService.create(sequenceData)
      setSequences(prev => [newSequence, ...prev])
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
      await SequencesService.delete(id)
      setSequences(prev => prev.filter(sequence => sequence.id !== id))
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