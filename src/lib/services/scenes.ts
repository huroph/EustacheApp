// Service pour la gestion des scènes avec Supabase
// src/lib/services/scenes.ts

import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

// Types inférés de la base de données
export type Scene = Database['public']['Tables']['scenes']['Row']
export type SceneInsert = Database['public']['Tables']['scenes']['Insert']
export type SceneUpdate = Database['public']['Tables']['scenes']['Update']

export class ScenesService {
  static async getAll(): Promise<Scene[]> {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .order('numero', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des scènes:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  static async getBySequence(sequenceId: string): Promise<Scene[]> {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('numero', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des scènes par séquence:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  static async getByDecor(decorId: string): Promise<Scene[]> {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('decor_id', decorId)
      .order('numero', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des scènes par décor:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  static async getById(id: string): Promise<Scene | null> {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Pas trouvé
      }
      console.error('Erreur lors de la récupération de la scène:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async create(sceneData: SceneInsert): Promise<Scene> {
    const { data, error } = await supabase
      .from('scenes')
      .insert(sceneData)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la scène:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async update(id: string, sceneData: SceneUpdate): Promise<Scene> {
    const { data, error } = await supabase
      .from('scenes')
      .update(sceneData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la scène:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('scenes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de la scène:', error)
      throw new Error(error.message)
    }
  }

  static async countBySequence(sequenceId: string): Promise<number> {
    const { count, error } = await supabase
      .from('scenes')
      .select('*', { count: 'exact', head: true })
      .eq('sequence_id', sequenceId)

    if (error) {
      console.error('Erreur lors du comptage des scènes:', error)
      throw new Error(error.message)
    }

    return count || 0
  }

  static async countByDecor(decorId: string): Promise<number> {
    const { count, error } = await supabase
      .from('scenes')
      .select('*', { count: 'exact', head: true })
      .eq('decor_id', decorId)

    if (error) {
      console.error('Erreur lors du comptage des scènes par décor:', error)
      throw new Error(error.message)
    }

    return count || 0
  }
}