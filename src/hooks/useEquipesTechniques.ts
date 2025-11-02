import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EquipeTechnique } from '@/lib/types-clean'

// Type pour Supabase (correspond à la structure de la table)
export interface SupabaseEquipeTechnique {
  id: string
  sequence_id: string
  nom: string
  prenom: string
  type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
  notes: string | null
  created_at: string
  updated_at: string
}

// Type pour les opérations de création (sans id et dates)
export interface CreateEquipeTechniqueData {
  sequence_id: string
  nom: string
  prenom: string
  type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
  notes: string
}

// Type pour les opérations de mise à jour (sans sequence_id et dates)
export interface UpdateEquipeTechniqueData {
  nom?: string
  prenom?: string
  type?: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
  notes?: string
}

export function useEquipesTechniques(sequenceId?: string) {
  const [equipesTechniques, setEquipesTechniques] = useState<EquipeTechnique[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les équipes techniques
  const loadEquipesTechniques = async () => {
    if (!sequenceId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('equipes_techniques')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Convertir les données Supabase vers le format attendu
      const convertedData: EquipeTechnique[] = data.map((item: SupabaseEquipeTechnique) => ({
        id: item.id,
        nom: item.nom,
        prenom: item.prenom,
        type: item.type,
        sequences: [sequenceId], // L'interface originale attend un array
        notes: item.notes || '',
        createdAt: new Date(item.created_at)
      }))

      setEquipesTechniques(convertedData)
    } catch (err) {
      console.error('Erreur lors du chargement des équipes techniques:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer une équipe technique
  const createEquipeTechnique = async (data: CreateEquipeTechniqueData): Promise<EquipeTechnique | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: newEquipeTechnique, error } = await supabase
        .from('equipes_techniques')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      const convertedEquipeTechnique: EquipeTechnique = {
        id: newEquipeTechnique.id,
        nom: newEquipeTechnique.nom,
        prenom: newEquipeTechnique.prenom,
        type: newEquipeTechnique.type,
        sequences: [data.sequence_id],
        notes: newEquipeTechnique.notes || '',
        createdAt: new Date(newEquipeTechnique.created_at)
      }

      setEquipesTechniques(prev => [...prev, convertedEquipeTechnique])
      return convertedEquipeTechnique
    } catch (err) {
      console.error('Erreur lors de la création de l\'équipe technique:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour mettre à jour une équipe technique
  const updateEquipeTechnique = async (id: string, updates: UpdateEquipeTechniqueData): Promise<EquipeTechnique | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: updatedEquipeTechnique, error } = await supabase
        .from('equipes_techniques')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const convertedEquipeTechnique: EquipeTechnique = {
        id: updatedEquipeTechnique.id,
        nom: updatedEquipeTechnique.nom,
        prenom: updatedEquipeTechnique.prenom,
        type: updatedEquipeTechnique.type,
        sequences: [updatedEquipeTechnique.sequence_id],
        notes: updatedEquipeTechnique.notes || '',
        createdAt: new Date(updatedEquipeTechnique.created_at)
      }

      setEquipesTechniques(prev => 
        prev.map(equipe => equipe.id === id ? convertedEquipeTechnique : equipe)
      )

      return convertedEquipeTechnique
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'équipe technique:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour supprimer une équipe technique
  const deleteEquipeTechnique = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('equipes_techniques')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEquipesTechniques(prev => prev.filter(equipe => equipe.id !== id))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'équipe technique:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Charger les équipes techniques au montage et lors du changement de sequenceId
  useEffect(() => {
    loadEquipesTechniques()
  }, [sequenceId])

  return {
    equipesTechniques,
    loading,
    error,
    createEquipeTechnique,
    updateEquipeTechnique,
    deleteEquipeTechnique,
    refreshEquipesTechniques: loadEquipesTechniques
  }
}