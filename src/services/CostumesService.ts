import { supabase } from '@/lib/supabase'
import { Costume } from '@/lib/types-clean'
import { SupabaseCostume, CreateCostumeData } from '@/hooks/useCostumes'

export class CostumesService {
  // Adapter pour convertir un costume Supabase vers l'interface frontend
  static adaptSupabaseToCostume(supabaseCostume: SupabaseCostume): Costume {
    return {
      id: supabaseCostume.id,
      nomCostume: supabaseCostume.nom_costume,
      roleId: supabaseCostume.role_id || undefined,
      statut: supabaseCostume.statut,
      notesCostume: supabaseCostume.notes_costume || '',
      createdAt: new Date(supabaseCostume.created_at)
    }
  }

  // Adapter pour convertir un costume frontend vers Supabase
  static adaptCostumeToSupabase(costume: Costume, sequenceId: string): CreateCostumeData {
    return {
      sequence_id: sequenceId,
      nom_costume: costume.nomCostume,
      role_id: costume.roleId || undefined,
      statut: costume.statut,
      notes_costume: costume.notesCostume || undefined
    }
  }

  // Récupérer tous les costumes d'une séquence
  static async getCostumesBySequence(sequenceId: string): Promise<Costume[]> {
    try {
      const { data, error } = await supabase
        .from('costumes')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToCostume)
    } catch (error) {
      console.error('Erreur lors de la récupération des costumes:', error)
      throw error
    }
  }

  // Créer un nouveau costume
  static async createCostume(costume: Costume, sequenceId: string): Promise<Costume> {
    try {
      const supabaseData = this.adaptCostumeToSupabase(costume, sequenceId)
      
      const { data, error } = await supabase
        .from('costumes')
        .insert([supabaseData])
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.adaptSupabaseToCostume(data)
    } catch (error) {
      console.error('Erreur lors de la création du costume:', error)
      throw error
    }
  }

  // Mettre à jour un costume
  static async updateCostume(costumeId: string, costume: Costume, sequenceId: string): Promise<Costume> {
    try {
      const supabaseData = this.adaptCostumeToSupabase(costume, sequenceId)
      // Enlever sequence_id des updates car on ne doit pas le modifier
      const { sequence_id, ...updates } = supabaseData
      
      const { data, error } = await supabase
        .from('costumes')
        .update(updates)
        .eq('id', costumeId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.adaptSupabaseToCostume(data)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du costume:', error)
      throw error
    }
  }

  // Supprimer un costume
  static async deleteCostume(costumeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('costumes')
        .delete()
        .eq('id', costumeId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du costume:', error)
      throw error
    }
  }

  // Récupérer un costume par ID
  static async getCostumeById(costumeId: string): Promise<Costume | null> {
    try {
      const { data, error } = await supabase
        .from('costumes')
        .select('*')
        .eq('id', costumeId)
        .single()

      if (error) {
        throw error
      }

      return data ? this.adaptSupabaseToCostume(data) : null
    } catch (error) {
      console.error('Erreur lors de la récupération du costume:', error)
      throw error
    }
  }

  // Récupérer les costumes par rôle
  static async getCostumesByRole(roleId: string): Promise<Costume[]> {
    try {
      const { data, error } = await supabase
        .from('costumes')
        .select('*')
        .eq('role_id', roleId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToCostume)
    } catch (error) {
      console.error('Erreur lors de la récupération des costumes par rôle:', error)
      throw error
    }
  }

  // Récupérer les costumes par statut
  static async getCostumesByStatus(sequenceId: string, statut: Costume['statut']): Promise<Costume[]> {
    try {
      const { data, error } = await supabase
        .from('costumes')
        .select('*')
        .eq('sequence_id', sequenceId)
        .eq('statut', statut)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []).map(this.adaptSupabaseToCostume)
    } catch (error) {
      console.error('Erreur lors de la récupération des costumes par statut:', error)
      throw error
    }
  }
}