// Service pour la gestion des projets avec Supabase
// src/lib/services/projects.ts

import { supabase, type Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  
  /**
   * Récupérer tous les projets
   */
  static async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      throw new Error(`Erreur lors de la récupération des projets: ${error.message}`)
    }

    return data || []
  }

  /**
   * Récupérer un projet par ID
   */
  static async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Projet non trouvé
      }
      console.error('Erreur lors de la récupération du projet:', error)
      throw new Error(`Erreur lors de la récupération du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Créer un nouveau projet
   */
  static async create(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création du projet:', error)
      throw new Error(`Erreur lors de la création du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Mettre à jour un projet
   */
  static async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour du projet:', error)
      throw new Error(`Erreur lors de la mise à jour du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Supprimer un projet
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression du projet:', error)
      throw new Error(`Erreur lors de la suppression du projet: ${error.message}`)
    }
  }

  /**
   * Récupérer les projets par année
   */
  static async getByYear(year: number): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .gte('start_date', `${year}-01-01`)
      .lt('start_date', `${year + 1}-01-01`)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des projets par année:', error)
      throw new Error(`Erreur lors de la récupération des projets par année: ${error.message}`)
    }

    return data || []
  }

  /**
   * Rechercher des projets
   */
  static async search(query: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la recherche de projets:', error)
      throw new Error(`Erreur lors de la recherche de projets: ${error.message}`)
    }

    return data || []
  }
}

// Types exportés pour utilisation dans les composants
export type { Project, ProjectInsert, ProjectUpdate }