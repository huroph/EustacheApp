'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface SupabaseCostume {
  id: string
  sequence_id: string
  nom_costume: string
  role_id?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notes_costume?: string
  created_at: string
  updated_at: string
}

export interface CreateCostumeData {
  sequence_id: string
  nom_costume: string
  role_id?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notes_costume?: string
}

export function useCostumes(sequenceId: string) {
  const [costumes, setCostumes] = useState<SupabaseCostume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les costumes d'une séquence
  const loadCostumes = async () => {
    if (!sequenceId) {
      setCostumes([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('costumes')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setCostumes(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des costumes:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setCostumes([])
    } finally {
      setIsLoading(false)
    }
  }

  // Créer un nouveau costume
  const createCostume = async (costumeData: CreateCostumeData): Promise<SupabaseCostume | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('costumes')
        .insert([costumeData])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setCostumes(prev => [...prev, data])
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la création du costume:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Mettre à jour un costume
  const updateCostume = async (
    costumeId: string, 
    updates: Partial<Omit<CreateCostumeData, 'sequence_id'>>
  ): Promise<SupabaseCostume | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('costumes')
        .update(updates)
        .eq('id', costumeId)
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setCostumes(prev => prev.map(costume => 
          costume.id === costumeId ? data : costume
        ))
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la mise à jour du costume:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Supprimer un costume
  const deleteCostume = async (costumeId: string): Promise<boolean> => {
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('costumes')
        .delete()
        .eq('id', costumeId)

      if (supabaseError) {
        throw supabaseError
      }

      setCostumes(prev => prev.filter(costume => costume.id !== costumeId))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression du costume:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    }
  }

  // Charger les costumes au montage du composant et quand sequenceId change
  useEffect(() => {
    loadCostumes()
  }, [sequenceId])

  return {
    costumes,
    isLoading,
    error,
    createCostume,
    updateCostume,
    deleteCostume,
    refetch: loadCostumes
  }
}