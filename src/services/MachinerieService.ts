import { supabase } from '@/lib/supabase'
import { Machinerie } from '@/lib/types-clean'
import { SupabaseMachinerie, CreateMachinerieData, UpdateMachinerieData } from '@/hooks/useMachinerie'

export class MachinerieService {
  // Adapter Supabase vers Machinerie
  static adaptSupabaseToMachinerie(supabaseData: SupabaseMachinerie): Machinerie {
    return {
      id: supabaseData.id,
      nom: supabaseData.nom,
      statut: supabaseData.statut,
      referentId: supabaseData.referent_id || '',
      notes: supabaseData.notes || '',
      createdAt: new Date(supabaseData.created_at)
    }
  }

  // Adapter Machinerie vers données Supabase pour la création
  static adaptMachinerieToSupabase(machinerie: Omit<Machinerie, 'id' | 'createdAt'>, sequenceId: string): CreateMachinerieData {
    return {
      sequence_id: sequenceId,
      nom: machinerie.nom,
      statut: machinerie.statut,
      referent_id: machinerie.referentId || undefined,
      notes: machinerie.notes
    }
  }

  // Adapter Machinerie vers données Supabase pour la mise à jour
  static adaptMachinerieToSupabaseUpdate(machinerie: Partial<Machinerie>): UpdateMachinerieData {
    const updateData: UpdateMachinerieData = {}
    
    if (machinerie.nom !== undefined) updateData.nom = machinerie.nom
    if (machinerie.statut !== undefined) updateData.statut = machinerie.statut
    if (machinerie.referentId !== undefined) {
      updateData.referent_id = machinerie.referentId || null
    }
    if (machinerie.notes !== undefined) updateData.notes = machinerie.notes
    
    return updateData
  }

  // Récupérer toutes les machineries d'une séquence
  static async getMachinerieBySequence(sequenceId: string): Promise<Machinerie[]> {
    const { data, error } = await supabase
      .from('machinerie')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Erreur lors de la récupération de la machinerie: ${error.message}`)
    }

    return data.map(this.adaptSupabaseToMachinerie)
  }

  // Récupérer une machinerie par ID
  static async getMachinerieById(id: string): Promise<Machinerie | null> {
    const { data, error } = await supabase
      .from('machinerie')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Machinerie non trouvée
      }
      throw new Error(`Erreur lors de la récupération de la machinerie: ${error.message}`)
    }

    return this.adaptSupabaseToMachinerie(data)
  }

  // Créer une machinerie
  static async createMachinerie(machinerie: Omit<Machinerie, 'id' | 'createdAt'>, sequenceId: string): Promise<Machinerie> {
    const supabaseData = this.adaptMachinerieToSupabase(machinerie, sequenceId)

    const { data, error } = await supabase
      .from('machinerie')
      .insert([supabaseData])
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la création de la machinerie: ${error.message}`)
    }

    return this.adaptSupabaseToMachinerie(data)
  }

  // Mettre à jour une machinerie
  static async updateMachinerie(id: string, updates: Partial<Machinerie>): Promise<Machinerie> {
    const supabaseUpdates = this.adaptMachinerieToSupabaseUpdate(updates)

    const { data, error } = await supabase
      .from('machinerie')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la mise à jour de la machinerie: ${error.message}`)
    }

    return this.adaptSupabaseToMachinerie(data)
  }

  // Supprimer une machinerie
  static async deleteMachinerie(id: string): Promise<void> {
    const { error } = await supabase
      .from('machinerie')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erreur lors de la suppression de la machinerie: ${error.message}`)
    }
  }

  // Supprimer toutes les machineries d'une séquence
  static async deleteMachinerieBySequence(sequenceId: string): Promise<void> {
    const { error } = await supabase
      .from('machinerie')
      .delete()
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors de la suppression des machineries: ${error.message}`)
    }
  }

  // Récupérer les machineries par référent
  static async getMachinerieByReferent(referentId: string): Promise<Machinerie[]> {
    const { data, error } = await supabase
      .from('machinerie')
      .select('*')
      .eq('referent_id', referentId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Erreur lors de la récupération des machineries par référent: ${error.message}`)
    }

    return data.map(this.adaptSupabaseToMachinerie)
  }

  // Compter les machineries par statut pour une séquence
  static async countMachinerieByStatus(sequenceId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('machinerie')
      .select('statut')
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors du comptage des machineries: ${error.message}`)
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