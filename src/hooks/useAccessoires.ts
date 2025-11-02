'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface SupabaseAccessoire {
  id: string
  sequence_id: string
  nom_accessoire: string
  role_id?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notes_accessoire?: string
  created_at: string
  updated_at: string
}

export interface CreateAccessoireData {
  sequence_id: string
  nom_accessoire: string
  role_id?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notes_accessoire?: string
}

export function useAccessoires(sequenceId: string) {
  const [accessoires, setAccessoires] = useState<SupabaseAccessoire[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les accessoires d'une séquence
  const loadAccessoires = async () => {
    if (!sequenceId) {
      setAccessoires([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('accessoires')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setAccessoires(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des accessoires:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setAccessoires([])
    } finally {
      setIsLoading(false)
    }
  }

  // Créer un nouvel accessoire
  const createAccessoire = async (accessoireData: CreateAccessoireData): Promise<SupabaseAccessoire | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('accessoires')
        .insert([accessoireData])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setAccessoires(prev => [...prev, data])
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la création de l\'accessoire:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Mettre à jour un accessoire
  const updateAccessoire = async (
    accessoireId: string, 
    updates: Partial<Omit<CreateAccessoireData, 'sequence_id'>>
  ): Promise<SupabaseAccessoire | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('accessoires')
        .update(updates)
        .eq('id', accessoireId)
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setAccessoires(prev => prev.map(accessoire => 
          accessoire.id === accessoireId ? data : accessoire
        ))
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'accessoire:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Supprimer un accessoire
  const deleteAccessoire = async (accessoireId: string): Promise<boolean> => {
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('accessoires')
        .delete()
        .eq('id', accessoireId)

      if (supabaseError) {
        throw supabaseError
      }

      setAccessoires(prev => prev.filter(accessoire => accessoire.id !== accessoireId))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'accessoire:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    }
  }

  // Charger les accessoires au montage du composant et quand sequenceId change
  useEffect(() => {
    loadAccessoires()
  }, [sequenceId])

  return {
    accessoires,
    isLoading,
    error,
    createAccessoire,
    updateAccessoire,
    deleteAccessoire,
    refetch: loadAccessoires
  }
}