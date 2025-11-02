import { supabase } from '@/lib/supabase'
import { MaterielSon } from '@/lib/types-clean'
import { SupabaseMaterielSon, CreateMaterielSonData, UpdateMaterielSonData } from '@/hooks/useMaterielSon'

export class MaterielSonService {
  // Adapter Supabase vers MaterielSon
  static adaptSupabaseToMaterielSon(supabaseData: SupabaseMaterielSon): MaterielSon {
    return {
      id: supabaseData.id,
      nom: supabaseData.nom,
      statut: supabaseData.statut,
      referentId: supabaseData.referent_id || '',
      notes: supabaseData.notes || '',
      createdAt: new Date(supabaseData.created_at)
    }
  }

  // Adapter MaterielSon vers données Supabase pour la création
  static adaptMaterielSonToSupabase(materielSon: Omit<MaterielSon, 'id' | 'createdAt'>, sequenceId: string): CreateMaterielSonData {
    return {
      sequence_id: sequenceId,
      nom: materielSon.nom,
      statut: materielSon.statut,
      referent_id: materielSon.referentId || undefined,
      notes: materielSon.notes
    }
  }

  // Adapter MaterielSon vers données Supabase pour la mise à jour
  static adaptMaterielSonToSupabaseUpdate(materielSon: Partial<MaterielSon>): UpdateMaterielSonData {
    const updateData: UpdateMaterielSonData = {}
    
    if (materielSon.nom !== undefined) updateData.nom = materielSon.nom
    if (materielSon.statut !== undefined) updateData.statut = materielSon.statut
    if (materielSon.referentId !== undefined) {
      updateData.referent_id = materielSon.referentId || null
    }
    if (materielSon.notes !== undefined) updateData.notes = materielSon.notes
    
    return updateData
  }

  // Récupérer tous les matériels son d'une séquence
  static async getMaterielSonBySequence(sequenceId: string): Promise<MaterielSon[]> {
    const { data, error } = await supabase
      .from('materiel_son')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Erreur lors de la récupération du matériel son: ${error.message}`)
    }

    return data.map(this.adaptSupabaseToMaterielSon)
  }

  // Récupérer un matériel son par ID
  static async getMaterielSonById(id: string): Promise<MaterielSon | null> {
    const { data, error } = await supabase
      .from('materiel_son')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Matériel son non trouvé
      }
      throw new Error(`Erreur lors de la récupération du matériel son: ${error.message}`)
    }

    return this.adaptSupabaseToMaterielSon(data)
  }

  // Créer un matériel son
  static async createMaterielSon(materielSon: Omit<MaterielSon, 'id' | 'createdAt'>, sequenceId: string): Promise<MaterielSon> {
    const supabaseData = this.adaptMaterielSonToSupabase(materielSon, sequenceId)

    const { data, error } = await supabase
      .from('materiel_son')
      .insert([supabaseData])
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la création du matériel son: ${error.message}`)
    }

    return this.adaptSupabaseToMaterielSon(data)
  }

  // Mettre à jour un matériel son
  static async updateMaterielSon(id: string, updates: Partial<MaterielSon>): Promise<MaterielSon> {
    const supabaseUpdates = this.adaptMaterielSonToSupabaseUpdate(updates)

    const { data, error } = await supabase
      .from('materiel_son')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du matériel son: ${error.message}`)
    }

    return this.adaptSupabaseToMaterielSon(data)
  }

  // Supprimer un matériel son
  static async deleteMaterielSon(id: string): Promise<void> {
    const { error } = await supabase
      .from('materiel_son')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erreur lors de la suppression du matériel son: ${error.message}`)
    }
  }

  // Supprimer tous les matériels son d'une séquence
  static async deleteMaterielSonBySequence(sequenceId: string): Promise<void> {
    const { error } = await supabase
      .from('materiel_son')
      .delete()
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors de la suppression des matériels son: ${error.message}`)
    }
  }

  // Récupérer les matériels son par référent
  static async getMaterielSonByReferent(referentId: string): Promise<MaterielSon[]> {
    const { data, error } = await supabase
      .from('materiel_son')
      .select('*')
      .eq('referent_id', referentId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Erreur lors de la récupération des matériels son par référent: ${error.message}`)
    }

    return data.map(this.adaptSupabaseToMaterielSon)
  }

  // Compter les matériels son par statut pour une séquence
  static async countMaterielSonByStatus(sequenceId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('materiel_son')
      .select('statut')
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors du comptage des matériels son: ${error.message}`)
    }

    const counts: Record<string, number> = {
      'A validé': 0,
      'En attente': 0,
      'Validé': 0,
      'Reporté': 0
    }

    data.forEach(item => {
      counts[item.statut] = (counts[item.statut] || 0) + 1
    })

    return counts
  }
}