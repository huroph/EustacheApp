import { supabase } from '@/lib/supabase'
import { EquipeTechnique } from '@/lib/types-clean'
import { SupabaseEquipeTechnique, CreateEquipeTechniqueData, UpdateEquipeTechniqueData } from '@/hooks/useEquipesTechniques'

export class EquipesTechniquesService {
  // Adapter pour convertir les données Supabase vers EquipeTechnique
  static adaptSupabaseToEquipeTechnique(supabaseEquipeTechnique: SupabaseEquipeTechnique): EquipeTechnique {
    return {
      id: supabaseEquipeTechnique.id,
      nom: supabaseEquipeTechnique.nom,
      prenom: supabaseEquipeTechnique.prenom,
      type: supabaseEquipeTechnique.type,
      sequences: [supabaseEquipeTechnique.sequence_id], // L'interface originale attend un array
      notes: supabaseEquipeTechnique.notes || '',
      createdAt: new Date(supabaseEquipeTechnique.created_at)
    }
  }

  // Adapter pour convertir EquipeTechnique vers les données Supabase
  static adaptEquipeTechniqueToSupabase(equipeTechnique: Partial<EquipeTechnique> & { sequenceId?: string }): Partial<SupabaseEquipeTechnique> & { sequence_id?: string } {
    const result: Partial<SupabaseEquipeTechnique> & { sequence_id?: string } = {}
    
    if (equipeTechnique.id) result.id = equipeTechnique.id
    if (equipeTechnique.nom) result.nom = equipeTechnique.nom
    if (equipeTechnique.prenom) result.prenom = equipeTechnique.prenom
    if (equipeTechnique.type) result.type = equipeTechnique.type
    if (equipeTechnique.notes !== undefined) result.notes = equipeTechnique.notes
    if (equipeTechnique.sequenceId) result.sequence_id = equipeTechnique.sequenceId
    
    return result
  }

  // Récupérer toutes les équipes techniques d'une séquence
  static async getEquipesTechniquesBySequence(sequenceId: string): Promise<EquipeTechnique[]> {
    const { data, error } = await supabase
      .from('equipes_techniques')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des équipes techniques:', error)
      throw error
    }

    return data.map(this.adaptSupabaseToEquipeTechnique)
  }

  // Créer une nouvelle équipe technique
  static async createEquipeTechnique(equipeTechniqueData: CreateEquipeTechniqueData): Promise<EquipeTechnique> {
    const { data, error } = await supabase
      .from('equipes_techniques')
      .insert([equipeTechniqueData])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de l\'équipe technique:', error)
      throw error
    }

    return this.adaptSupabaseToEquipeTechnique(data)
  }

  // Mettre à jour une équipe technique
  static async updateEquipeTechnique(id: string, updates: UpdateEquipeTechniqueData): Promise<EquipeTechnique> {
    const { data, error } = await supabase
      .from('equipes_techniques')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'équipe technique:', error)
      throw error
    }

    return this.adaptSupabaseToEquipeTechnique(data)
  }

  // Supprimer une équipe technique
  static async deleteEquipeTechnique(id: string): Promise<void> {
    const { error } = await supabase
      .from('equipes_techniques')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de l\'équipe technique:', error)
      throw error
    }
  }
}