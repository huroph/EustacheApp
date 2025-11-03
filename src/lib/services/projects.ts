// Service pour la gestion des projets avec Supabase
// src/lib/services/projects.ts

import { supabase, type Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  
  /**
   * Récupérer tous les projets de l'utilisateur connecté
   */
  static async getAll(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      throw new Error(`Erreur lors de la récupération des projets: ${error.message}`)
    }

    return data || []
  }

  /**
   * Récupérer un projet par ID (vérifie que le projet appartient à l'utilisateur)
   */
  static async getById(id: string): Promise<Project | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Projet non trouvé ou pas accessible
      }
      console.error('Erreur lors de la récupération du projet:', error)
      throw new Error(`Erreur lors de la récupération du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Créer un nouveau projet
   */
  static async create(project: Omit<ProjectInsert, 'user_id'>): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création du projet:', error)
      throw new Error(`Erreur lors de la création du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Mettre à jour un projet (vérifie que le projet appartient à l'utilisateur)
   */
  static async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour du projet:', error)
      throw new Error(`Erreur lors de la mise à jour du projet: ${error.message}`)
    }

    return data
  }

  /**
   * Supprimer un projet (vérifie que le projet appartient à l'utilisateur)
   */
  static async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur lors de la suppression du projet:', error)
      throw new Error(`Erreur lors de la suppression du projet: ${error.message}`)
    }
  }

  /**
   * Récupérer les projets par année pour l'utilisateur connecté
   */
  static async getByYear(year: number): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
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
   * Rechercher des projets de l'utilisateur connecté
   */
  static async search(query: string): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
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
export type { Project, ProjectUpdate }
export type ProjectCreateInput = Omit<ProjectInsert, 'user_id'>