// Hook React pour la gestion des décors avec Supabase
// src/hooks/useDecors.ts

'use client'

import { useState, useEffect } from 'react'
import { DecorsService, type Decor, type DecorInsert, type DecorUpdate } from '@/lib/services/decors'

export function useDecors(sequenceId?: string) {
  const [decors, setDecors] = useState<Decor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDecors = async () => {
    // Ne rien faire si sequenceId est undefined
    if (!sequenceId) {
      setDecors([])
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await DecorsService.getBySequence(sequenceId)
      setDecors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors du chargement des décors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDecors()
  }, [sequenceId]) // Ne se déclenche que si sequenceId change réellement

  const createDecor = async (decorData: DecorInsert) => {
    try {
      const newDecor = await DecorsService.create(decorData)
      setDecors(prev => [newDecor, ...prev])
      return newDecor
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      throw err
    }
  }

  const updateDecor = async (id: string, decorData: DecorUpdate) => {
    try {
      const updatedDecor = await DecorsService.update(id, decorData)
      setDecors(prev => prev.map(d => d.id === id ? updatedDecor : d))
      return updatedDecor
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const deleteDecor = async (id: string) => {
    try {
      await DecorsService.delete(id)
      setDecors(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      throw err
    }
  }

  return {
    decors,
    isLoading,
    error,
    createDecor,
    updateDecor,
    deleteDecor,
    refetch: loadDecors
  }
}

// Hook pour un décor spécifique
export function useDecor(id?: string) {
  const [decor, setDecor] = useState<Decor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setDecor(null)
      setIsLoading(false)
      return
    }

    const loadDecor = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await DecorsService.getById(id)
        setDecor(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        console.error('Erreur lors du chargement du décor:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDecor()
  }, [id])

  return { decor, isLoading, error }
}