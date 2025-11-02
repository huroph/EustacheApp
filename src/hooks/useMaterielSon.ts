import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MaterielSon } from '@/lib/types-clean'

// Type pour Supabase (correspond à la structure de la table)
export interface SupabaseMaterielSon {
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
export interface CreateMaterielSonData {
  sequence_id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referent_id?: string
  notes: string
}

// Type pour les opérations de mise à jour (sans sequence_id et dates)
export interface UpdateMaterielSonData {
  nom?: string
  statut?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referent_id?: string | null
  notes?: string
}

export function useMaterielSon(sequenceId?: string) {
  const [materielSon, setMaterielSon] = useState<MaterielSon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger le matériel son
  const loadMaterielSon = async () => {
    if (!sequenceId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('materiel_son')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Convertir les données Supabase vers le format attendu
      const convertedData: MaterielSon[] = data.map((item: SupabaseMaterielSon) => ({
        id: item.id,
        nom: item.nom,
        statut: item.statut,
        referentId: item.referent_id || '',
        notes: item.notes || '',
        createdAt: new Date(item.created_at)
      }))

      setMaterielSon(convertedData)
    } catch (err) {
      console.error('Erreur lors du chargement du matériel son:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer un matériel son
  const createMaterielSon = async (data: CreateMaterielSonData): Promise<MaterielSon | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: newMaterielSon, error } = await supabase
        .from('materiel_son')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      const convertedMaterielSon: MaterielSon = {
        id: newMaterielSon.id,
        nom: newMaterielSon.nom,
        statut: newMaterielSon.statut,
        referentId: newMaterielSon.referent_id || '',
        notes: newMaterielSon.notes || '',
        createdAt: new Date(newMaterielSon.created_at)
      }

      setMaterielSon(prev => [...prev, convertedMaterielSon])
      return convertedMaterielSon
    } catch (err) {
      console.error('Erreur lors de la création du matériel son:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour mettre à jour un matériel son
  const updateMaterielSon = async (id: string, updates: UpdateMaterielSonData): Promise<MaterielSon | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: updatedMaterielSon, error } = await supabase
        .from('materiel_son')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const convertedMaterielSon: MaterielSon = {
        id: updatedMaterielSon.id,
        nom: updatedMaterielSon.nom,
        statut: updatedMaterielSon.statut,
        referentId: updatedMaterielSon.referent_id || '',
        notes: updatedMaterielSon.notes || '',
        createdAt: new Date(updatedMaterielSon.created_at)
      }

      setMaterielSon(prev => 
        prev.map(materiel => materiel.id === id ? convertedMaterielSon : materiel)
      )

      return convertedMaterielSon
    } catch (err) {
      console.error('Erreur lors de la mise à jour du matériel son:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour supprimer un matériel son
  const deleteMaterielSon = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('materiel_son')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMaterielSon(prev => prev.filter(materiel => materiel.id !== id))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression du matériel son:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Charger le matériel son au montage et lors du changement de sequenceId
  useEffect(() => {
    loadMaterielSon()
  }, [sequenceId])

  return {
    materielSon,
    loading,
    error,
    createMaterielSon,
    updateMaterielSon,
    deleteMaterielSon,
    refreshMaterielSon: loadMaterielSon
  }
}