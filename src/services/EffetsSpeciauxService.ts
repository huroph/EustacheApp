import { supabase } from '@/lib/supabase'
import { EffetSpecial } from '@/lib/types-clean'
import { SupabaseEffetSpecial, CreateEffetSpecialData, UpdateEffetSpecialData } from '@/hooks/useEffetsSpeciaux'

export class EffetsSpeciauxService {
  // Adapter pour convertir les données Supabase vers EffetSpecial
  static adaptSupabaseToEffetSpecial(supabaseEffetSpecial: SupabaseEffetSpecial): EffetSpecial {
    return {
      id: supabaseEffetSpecial.id,
      nom: supabaseEffetSpecial.nom,
      statut: supabaseEffetSpecial.statut,
      description: supabaseEffetSpecial.description || '',
      createdAt: new Date(supabaseEffetSpecial.created_at)
    }
  }

  // Adapter pour convertir EffetSpecial vers les données Supabase
  static adaptEffetSpecialToSupabase(effetSpecial: Partial<EffetSpecial> & { sequenceId?: string }): Partial<SupabaseEffetSpecial> & { sequence_id?: string } {
    const result: Partial<SupabaseEffetSpecial> & { sequence_id?: string } = {}
    
    if (effetSpecial.id) result.id = effetSpecial.id
    if (effetSpecial.nom) result.nom = effetSpecial.nom
    if (effetSpecial.statut) result.statut = effetSpecial.statut
    if (effetSpecial.description !== undefined) result.description = effetSpecial.description
    if (effetSpecial.sequenceId) result.sequence_id = effetSpecial.sequenceId
    
    return result
  }

  // Récupérer tous les effets spéciaux d'une séquence
  static async getEffetsSpeciauxBySequence(sequenceId: string): Promise<EffetSpecial[]> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des effets spéciaux:', error)
      throw error
    }

    return data.map(this.adaptSupabaseToEffetSpecial)
  }

  // Créer un nouvel effet spécial
  static async createEffetSpecial(effetSpecialData: CreateEffetSpecialData): Promise<EffetSpecial> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .insert([effetSpecialData])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de l\'effet spécial:', error)
      throw error
    }

    return this.adaptSupabaseToEffetSpecial(data)
  }

  // Mettre à jour un effet spécial
  static async updateEffetSpecial(id: string, updates: UpdateEffetSpecialData): Promise<EffetSpecial> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'effet spécial:', error)
      throw error
    }

    return this.adaptSupabaseToEffetSpecial(data)
  }

  // Supprimer un effet spécial
  static async deleteEffetSpecial(id: string): Promise<void> {
    const { error } = await supabase
      .from('effets_speciaux')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de l\'effet spécial:', error)
      throw error
    }
  }

  // Récupérer un effet spécial par son ID
  static async getEffetSpecialById(id: string): Promise<EffetSpecial | null> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Pas de résultat trouvé
        return null
      }
      console.error('Erreur lors de la récupération de l\'effet spécial:', error)
      throw error
    }

    return this.adaptSupabaseToEffetSpecial(data)
  }

  // Compter le nombre d'effets spéciaux par statut pour une séquence
  static async countEffetsSpeciauxByStatut(sequenceId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .select('statut')
      .eq('sequence_id', sequenceId)

    if (error) {
      console.error('Erreur lors du comptage des effets spéciaux:', error)
      throw error
    }

    const counts: Record<string, number> = {
      'En attente': 0,
      'A validé': 0,
      'Validé': 0,
      'Reporté': 0
    }

    data.forEach(item => {
      counts[item.statut] = (counts[item.statut] || 0) + 1
    })

    return counts
  }

  // Rechercher des effets spéciaux par nom
  static async searchEffetsSpeciaux(sequenceId: string, searchTerm: string): Promise<EffetSpecial[]> {
    const { data, error } = await supabase
      .from('effets_speciaux')
      .select('*')
      .eq('sequence_id', sequenceId)
      .ilike('nom', `%${searchTerm}%`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur lors de la recherche d\'effets spéciaux:', error)
      throw error
    }

    return data.map(this.adaptSupabaseToEffetSpecial)
  }
}