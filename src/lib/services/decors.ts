// Service pour la gestion des décors avec Supabase
// src/lib/services/decors.ts

import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

// Types inférés de la base de données
export type Decor = Database['public']['Tables']['decors']['Row']
export type DecorInsert = Database['public']['Tables']['decors']['Insert']
export type DecorUpdate = Database['public']['Tables']['decors']['Update']

export class DecorsService {
  static async getAll(): Promise<Decor[]> {
    const { data, error } = await supabase
      .from('decors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des décors:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  static async getBySequence(sequenceId: string): Promise<Decor[]> {
    const { data, error } = await supabase
      .from('decors')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des décors par séquence:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  static async getById(id: string): Promise<Decor | null> {
    const { data, error } = await supabase
      .from('decors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Pas trouvé
      }
      console.error('Erreur lors de la récupération du décor:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async create(decorData: DecorInsert): Promise<Decor> {
    const { data, error } = await supabase
      .from('decors')
      .insert(decorData)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création du décor:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async update(id: string, decorData: DecorUpdate): Promise<Decor> {
    const { data, error } = await supabase
      .from('decors')
      .update(decorData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour du décor:', error)
      throw new Error(error.message)
    }

    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('decors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression du décor:', error)
      throw new Error(error.message)
    }
  }

  static async countBySequence(sequenceId: string): Promise<number> {
    const { count, error } = await supabase
      .from('decors')
      .select('*', { count: 'exact', head: true })
      .eq('sequence_id', sequenceId)

    if (error) {
      console.error('Erreur lors du comptage des décors:', error)
      throw new Error(error.message)
    }

    return count || 0
  }
}