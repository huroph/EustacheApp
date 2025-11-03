// Service pour la gestion des séquences avec Supabase
// src/lib/services/sequences.ts

import { supabase, type Database } from '@/lib/supabase'

type Sequence = Database['public']['Tables']['sequences']['Row']
type SequenceInsert = Database['public']['Tables']['sequences']['Insert']
type SequenceUpdate = Database['public']['Tables']['sequences']['Update']

// Type enrichi avec les données du projet
type SequenceWithProject = Sequence & {
  project?: {
    id: string
    title: string
    code: string
  }
}

export class SequencesService {
  
  /**
   * Récupérer toutes les séquences
   */
  static async getAll(): Promise<SequenceWithProject[]> {
    const { data, error } = await supabase
      .from('sequences')
      .select(`
        *,
        project:projects(id, title, code)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des séquences:', error)
      throw new Error(`Erreur lors de la récupération des séquences: ${error.message}`)
    }

    return data || []
  }

  /**
   * Récupérer les séquences d'un projet ordonnées par numéro
   */
  static async getByProject(projectId: string): Promise<Sequence[]> {
    const { data, error } = await supabase
      .from('sequences')
      .select('*')
      .eq('project_id', projectId)
      .order('code', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des séquences du projet:', error)
      throw new Error(`Erreur lors de la récupération des séquences du projet: ${error.message}`)
    }

    return data || []
  }

  /**
   * Générer le prochain numéro de séquence pour un projet
   */
  static async getNextSequenceNumber(projectId: string): Promise<number> {
    const sequences = await this.getByProject(projectId)
    
    // Extraire les numéros existants (SEQ-1 → 1, SEQ-2 → 2, etc.)
    const existingNumbers = sequences
      .map(seq => {
        const match = seq.code.match(/SEQ-(\d+)/)
        return match ? parseInt(match[1], 10) : 0
      })
      .filter(num => num > 0)
      .sort((a, b) => a - b)

    // Trouver le premier numéro disponible (commencer à 1)
    let nextNumber = 1
    for (const num of existingNumbers) {
      if (num === nextNumber) {
        nextNumber++
      } else {
        break
      }
    }

    return nextNumber
  }

  /**
   * Renuméroter toutes les séquences d'un projet après suppression
   */
  static async renumberSequences(projectId: string): Promise<void> {
    const sequences = await this.getByProject(projectId)
    
    // Trier par date de création pour garder l'ordre logique
    const sortedSequences = sequences.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    // Renuméroter séquentiellement
    for (let i = 0; i < sortedSequences.length; i++) {
      const newCode = `SEQ-${i + 1}`
      if (sortedSequences[i].code !== newCode) {
        await this.update(sortedSequences[i].id, { code: newCode })
      }
    }
  }

  /**
   * Récupérer une séquence par ID
   */
  static async getById(id: string): Promise<SequenceWithProject | null> {
    const { data, error } = await supabase
      .from('sequences')
      .select(`
        *,
        project:projects(id, title, code)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Séquence non trouvée
      }
      console.error('Erreur lors de la récupération de la séquence:', error)
      throw new Error(`Erreur lors de la récupération de la séquence: ${error.message}`)
    }

    return data
  }

  /**
   * Créer une nouvelle séquence avec numérotation automatique
   */
  static async create(sequence: Omit<SequenceInsert, 'code'>): Promise<Sequence> {
    // Générer automatiquement le code de séquence
    const nextNumber = await this.getNextSequenceNumber(sequence.project_id)
    const sequenceCode = `SEQ-${nextNumber}`

    const sequenceWithCode: SequenceInsert = {
      ...sequence,
      code: sequenceCode
    }

    console.log(`Création séquence ${sequenceCode} pour projet ${sequence.project_id}`)

    const { data, error } = await supabase
      .from('sequences')
      .insert([sequenceWithCode])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la séquence:', error)
      throw new Error(`Erreur lors de la création de la séquence: ${error.message}`)
    }

    return data
  }

  /**
   * Mettre à jour une séquence
   */
  static async update(id: string, updates: SequenceUpdate): Promise<Sequence> {
    const { data, error } = await supabase
      .from('sequences')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la séquence:', error)
      throw new Error(`Erreur lors de la mise à jour de la séquence: ${error.message}`)
    }

    return data
  }

  /**
   * Supprimer une séquence et renuméroter les séquences restantes
   */
  static async delete(id: string): Promise<void> {
    console.log(`Suppression de la séquence ${id}`)

    // Récupérer la séquence pour connaître le project_id
    const sequence = await this.getById(id)
    if (!sequence) {
      throw new Error('Séquence non trouvée')
    }

    const projectId = sequence.project_id

    // Supprimer la séquence
    const { error } = await supabase
      .from('sequences')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de la séquence:', error)
      throw new Error(`Erreur lors de la suppression de la séquence: ${error.message}`)
    }

    console.log(`Séquence ${sequence.code} supprimée, renumérotation en cours...`)

    // Renuméroter toutes les séquences restantes du projet
    await this.renumberSequences(projectId)

    console.log('Renumérotation terminée')
  }

  /**
   * Compter les séquences d'un projet
   */
  static async countByProject(projectId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('sequences')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)

      if (error) {
        console.error('Erreur lors du comptage des séquences:', error)
        throw new Error(`Erreur lors du comptage des séquences: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      console.error('Erreur dans countByProject:', error)
      // Retourner 0 au lieu de faire échouer pour éviter de casser l'interface
      return 0
    }
  }

  /**
   * Rechercher des séquences
   */
  static async search(query: string, projectId?: string): Promise<SequenceWithProject[]> {
    let queryBuilder = supabase
      .from('sequences')
      .select(`
        *,
        project:projects(id, title, code)
      `)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,code.ilike.%${query}%`)

    if (projectId) {
      queryBuilder = queryBuilder.eq('project_id', projectId)
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la recherche de séquences:', error)
      throw new Error(`Erreur lors de la recherche de séquences: ${error.message}`)
    }

    return data || []
  }

  /**
   * Vérifier qu'une séquence appartient à un projet spécifique
   */
  static async verifySequenceProject(sequenceId: string, expectedProjectId: string): Promise<boolean> {
    const sequence = await this.getById(sequenceId)
    return sequence?.project_id === expectedProjectId
  }

  /**
   * Obtenir les statistiques d'une séquence
   */
  static async getStats(sequenceId: string): Promise<{
    decorsCount: number
    scenesCount: number
    rolesCount: number
    // TODO: Ajouter d'autres stats quand les tables seront créées
  }> {
    // Pour l'instant, retourne des valeurs par défaut
    // Ces stats seront calculées quand nous aurons les tables décors, scènes, etc.
    return {
      decorsCount: 0,
      scenesCount: 0,
      rolesCount: 0
    }
  }
}

// Types exportés pour utilisation dans les composants
export type { Sequence, SequenceUpdate, SequenceWithProject }
export type SequenceCreateInput = Omit<SequenceInsert, 'code'>