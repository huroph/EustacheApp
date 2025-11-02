import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Machinerie } from '@/lib/types-clean'

// Type pour Supabase (correspond à la structure de la table)
export interface SupabaseMachinerie {
  id: string
  sequence_id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Type pour les opérations de création (sans id et dates)
export interface CreateMachinerieData {
  sequence_id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referent_id?: string
  notes: string
}

// Type pour les opérations de mise à jour (sans sequence_id et dates)
export interface UpdateMachinerieData {
  nom?: string
  statut?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referent_id?: string | null
  notes?: string
}

export function useMachinerie(sequenceId?: string) {
  const [machinerie, setMachinerie] = useState<Machinerie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger la machinerie
  const loadMachinerie = async () => {
    if (!sequenceId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('machinerie')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Convertir les données Supabase vers le format attendu
      const convertedData: Machinerie[] = data.map((item: SupabaseMachinerie) => ({
        id: item.id,
        nom: item.nom,
        statut: item.statut,
        referentId: item.referent_id || '',
        notes: item.notes || '',
        createdAt: new Date(item.created_at)
      }))

      setMachinerie(convertedData)
    } catch (err) {
      console.error('Erreur lors du chargement de la machinerie:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer une machinerie
  const createMachinerie = async (data: CreateMachinerieData): Promise<Machinerie | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: newMachinerie, error } = await supabase
        .from('machinerie')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      const convertedMachinerie: Machinerie = {
        id: newMachinerie.id,
        nom: newMachinerie.nom,
        statut: newMachinerie.statut,
        referentId: newMachinerie.referent_id || '',
        notes: newMachinerie.notes || '',
        createdAt: new Date(newMachinerie.created_at)
      }

      setMachinerie(prev => [...prev, convertedMachinerie])
      return convertedMachinerie
    } catch (err) {
      console.error('Erreur lors de la création de la machinerie:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour mettre à jour une machinerie
  const updateMachinerie = async (id: string, updates: UpdateMachinerieData): Promise<Machinerie | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: updatedMachinerie, error } = await supabase
        .from('machinerie')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const convertedMachinerie: Machinerie = {
        id: updatedMachinerie.id,
        nom: updatedMachinerie.nom,
        statut: updatedMachinerie.statut,
        referentId: updatedMachinerie.referent_id || '',
        notes: updatedMachinerie.notes || '',
        createdAt: new Date(updatedMachinerie.created_at)
      }

      setMachinerie(prev => 
        prev.map(item => item.id === id ? convertedMachinerie : item)
      )

      return convertedMachinerie
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la machinerie:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour supprimer une machinerie
  const deleteMachinerie = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('machinerie')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMachinerie(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression de la machinerie:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Charger la machinerie au montage et lors du changement de sequenceId
  useEffect(() => {
    loadMachinerie()
  }, [sequenceId])

  return {
    machinerie,
    loading,
    error,
    createMachinerie,
    updateMachinerie,
    deleteMachinerie,
    refreshMachinerie: loadMachinerie
  }
}