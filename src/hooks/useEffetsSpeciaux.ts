import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EffetSpecial } from '@/lib/types-clean'

// Type pour Supabase (correspond à la structure de la table)
export interface SupabaseEffetSpecial {
  id: string
  sequence_id: string
  nom: string
  statut: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
  description: string | null
  created_at: string
  updated_at: string
}

// Type pour les opérations de création (sans id et dates)
export interface CreateEffetSpecialData {
  sequence_id: string
  nom: string
  statut: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
  description: string
}

// Type pour les opérations de mise à jour (sans sequence_id et dates)
export interface UpdateEffetSpecialData {
  nom?: string
  statut?: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
  description?: string
}

export function useEffetsSpeciaux(sequenceId?: string) {
  const [effetsSpeciaux, setEffetsSpeciaux] = useState<EffetSpecial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les effets spéciaux
  const loadEffetsSpeciaux = async () => {
    if (!sequenceId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('effets_speciaux')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Convertir les données Supabase vers le format attendu
      const convertedData: EffetSpecial[] = data.map((item: SupabaseEffetSpecial) => ({
        id: item.id,
        nom: item.nom,
        statut: item.statut,
        description: item.description || '',
        createdAt: new Date(item.created_at)
      }))

      setEffetsSpeciaux(convertedData)
    } catch (err) {
      console.error('Erreur lors du chargement des effets spéciaux:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer un effet spécial
  const createEffetSpecial = async (data: CreateEffetSpecialData): Promise<EffetSpecial | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: newEffetSpecial, error } = await supabase
        .from('effets_speciaux')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      const convertedEffetSpecial: EffetSpecial = {
        id: newEffetSpecial.id,
        nom: newEffetSpecial.nom,
        statut: newEffetSpecial.statut,
        description: newEffetSpecial.description || '',
        createdAt: new Date(newEffetSpecial.created_at)
      }

      setEffetsSpeciaux(prev => [...prev, convertedEffetSpecial])
      return convertedEffetSpecial
    } catch (err) {
      console.error('Erreur lors de la création de l\'effet spécial:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour mettre à jour un effet spécial
  const updateEffetSpecial = async (id: string, updates: UpdateEffetSpecialData): Promise<EffetSpecial | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: updatedEffetSpecial, error } = await supabase
        .from('effets_speciaux')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const convertedEffetSpecial: EffetSpecial = {
        id: updatedEffetSpecial.id,
        nom: updatedEffetSpecial.nom,
        statut: updatedEffetSpecial.statut,
        description: updatedEffetSpecial.description || '',
        createdAt: new Date(updatedEffetSpecial.created_at)
      }

      setEffetsSpeciaux(prev => 
        prev.map(effet => effet.id === id ? convertedEffetSpecial : effet)
      )

      return convertedEffetSpecial
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'effet spécial:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour supprimer un effet spécial
  const deleteEffetSpecial = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('effets_speciaux')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEffetsSpeciaux(prev => prev.filter(effet => effet.id !== id))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'effet spécial:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Charger les effets spéciaux au montage et lors du changement de sequenceId
  useEffect(() => {
    loadEffetsSpeciaux()
  }, [sequenceId])

  return {
    effetsSpeciaux,
    loading,
    error,
    createEffetSpecial,
    updateEffetSpecial,
    deleteEffetSpecial,
    refreshEffetsSpeciaux: loadEffetsSpeciaux
  }
}