'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface SupabaseRole {
  id: string
  sequence_id: string
  type: 'Principale' | 'Secondaire' | 'Figurant' | 'Voix Off'
  nom_role: string
  interprete_nom: string
  interprete_prenom: string
  genre: 'Masculin' | 'Féminin' | 'Autre'
  age_personnage?: string
  apparence?: string
  description?: string
  notes_sequence?: string
  adresse?: string
  email?: string
  telephone?: string
  doublure_nom?: string
  doublure_prenom?: string
  doublure_type?: 'Image' | 'Voix' | 'Cascades'
  doublure_adresse?: string
  doublure_email?: string
  doublure_telephone?: string
  doublure_notes?: string
  created_at: string
  updated_at: string
}

export interface CreateRoleData {
  sequence_id: string
  type: 'Principale' | 'Secondaire' | 'Figurant' | 'Voix Off'
  nom_role: string
  interprete_nom: string
  interprete_prenom: string
  genre: 'Masculin' | 'Féminin' | 'Autre'
  age_personnage?: string
  apparence?: string
  description?: string
  notes_sequence?: string
  adresse?: string
  email?: string
  telephone?: string
  doublure_nom?: string
  doublure_prenom?: string
  doublure_type?: 'Image' | 'Voix' | 'Cascades'
  doublure_adresse?: string
  doublure_email?: string
  doublure_telephone?: string
  doublure_notes?: string
}

export function useRoles(sequenceId: string) {
  const [roles, setRoles] = useState<SupabaseRole[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les rôles d'une séquence
  const loadRoles = async () => {
    if (!sequenceId) {
      setRoles([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('roles')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setRoles(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setRoles([])
    } finally {
      setIsLoading(false)
    }
  }

  // Créer un nouveau rôle
  const createRole = async (roleData: CreateRoleData): Promise<SupabaseRole | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('roles')
        .insert([roleData])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setRoles(prev => [...prev, data])
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la création du rôle:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Mettre à jour un rôle
  const updateRole = async (
    roleId: string, 
    updates: Partial<Omit<CreateRoleData, 'sequence_id'>>
  ): Promise<SupabaseRole | null> => {
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', roleId)
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setRoles(prev => prev.map(role => 
          role.id === roleId ? data : role
        ))
        return data
      }

      return null
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  // Supprimer un rôle
  const deleteRole = async (roleId: string): Promise<boolean> => {
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId)

      if (supabaseError) {
        throw supabaseError
      }

      setRoles(prev => prev.filter(role => role.id !== roleId))
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression du rôle:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    }
  }

  // Charger les rôles au montage du composant et quand sequenceId change
  useEffect(() => {
    loadRoles()
  }, [sequenceId])

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refetch: loadRoles
  }
}