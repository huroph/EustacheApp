import { supabase } from '@/lib/supabase'
import { Accessoire } from '@/lib/types-clean'
import { SupabaseAccessoire, CreateAccessoireData } from '@/hooks/useAccessoires'

export class AccessoiresService {
  // Adapter pour convertir un accessoire Supabase vers l'interface frontend
  static adaptSupabaseToAccessoire(supabaseAccessoire: SupabaseAccessoire): Accessoire {
    return {
      id: supabaseAccessoire.id,
      nomAccessoire: supabaseAccessoire.nom_accessoire,
      roleId: supabaseAccessoire.role_id || undefined,
      statut: supabaseAccessoire.statut,
      notesAccessoire: supabaseAccessoire.notes_accessoire || '',
      createdAt: new Date(supabaseAccessoire.created_at)
    }
  }

  // Adapter pour convertir un accessoire frontend vers Supabase
  static adaptAccessoireToSupabase(accessoire: Accessoire, sequenceId: string): CreateAccessoireData {
    return {
      sequence_id: sequenceId,
      nom_accessoire: accessoire.nomAccessoire,
      role_id: accessoire.roleId || undefined,
      statut: accessoire.statut,
      notes_accessoire: accessoire.notesAccessoire || undefined
    }
  }

  // Récupérer tous les accessoires d'une séquence
  static async getAccessoiresBySequence(sequenceId: string): Promise<Accessoire[]> {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToAccessoire)
    } catch (error) {
      console.error('Erreur lors de la récupération des accessoires:', error)
      throw error
    }
  }

  // Créer un nouvel accessoire
  static async createAccessoire(accessoire: Accessoire, sequenceId: string): Promise<Accessoire> {
    try {
      const supabaseData = this.adaptAccessoireToSupabase(accessoire, sequenceId)
      
      const { data, error } = await supabase
        .from('accessoires')
        .insert([supabaseData])
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.adaptSupabaseToAccessoire(data)
    } catch (error) {
      console.error('Erreur lors de la création de l\'accessoire:', error)
      throw error
    }
  }

  // Mettre à jour un accessoire
  static async updateAccessoire(accessoireId: string, accessoire: Accessoire, sequenceId: string): Promise<Accessoire> {
    try {
      const supabaseData = this.adaptAccessoireToSupabase(accessoire, sequenceId)
      // Enlever sequence_id des updates car on ne doit pas le modifier
      const { sequence_id, ...updates } = supabaseData
      
      const { data, error } = await supabase
        .from('accessoires')
        .update(updates)
        .eq('id', accessoireId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.adaptSupabaseToAccessoire(data)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'accessoire:', error)
      throw error
    }
  }

  // Supprimer un accessoire
  static async deleteAccessoire(accessoireId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('accessoires')
        .delete()
        .eq('id', accessoireId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'accessoire:', error)
      throw error
    }
  }

  // Récupérer un accessoire par ID
  static async getAccessoireById(accessoireId: string): Promise<Accessoire | null> {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .select('*')
        .eq('id', accessoireId)
        .single()

      if (error) {
        throw error
      }

      return data ? this.adaptSupabaseToAccessoire(data) : null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'accessoire:', error)
      throw error
    }
  }

  // Récupérer les accessoires par rôle
  static async getAccessoiresByRole(roleId: string): Promise<Accessoire[]> {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .select('*')
        .eq('role_id', roleId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToAccessoire)
    } catch (error) {
      console.error('Erreur lors de la récupération des accessoires par rôle:', error)
      throw error
    }
  }

  // Récupérer les accessoires par statut
  static async getAccessoiresByStatus(sequenceId: string, statut: Accessoire['statut']): Promise<Accessoire[]> {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .select('*')
        .eq('sequence_id', sequenceId)
        .eq('statut', statut)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToAccessoire)
    } catch (error) {
      console.error('Erreur lors de la récupération des accessoires par statut:', error)
      throw error
    }
  }
}