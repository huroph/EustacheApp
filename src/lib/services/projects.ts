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

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur Supabase lors de la récupération des projets:', error)
        console.error('Code d\'erreur:', error.code)
        console.error('Détails:', error.details)
        console.error('Hint:', error.hint)
        throw new Error(`Erreur lors de la récupération des projets: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('Erreur réseau ou autre lors de getAll():', err)
      throw err
    }
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
   * Générer le prochain numéro de projet pour l'utilisateur
   */
  static async getNextProjectNumber(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('code')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (!projects) return 1

      // Extraire les numéros existants
      const numbers = projects
        .map(p => {
          if (!p.code) return 0
          const match = p.code.match(/^PRJ-(\d+)$/)
          return match ? parseInt(match[1]) : 0
        })
        .filter(n => n > 0)
        .sort((a, b) => a - b)

      // Trouver le premier numéro disponible
      let nextNumber = 1
      for (const num of numbers) {
        if (num === nextNumber) {
          nextNumber++
        } else {
          break
        }
      }

      return nextNumber
    } catch (err) {
      console.error('Erreur lors de getNextProjectNumber:', err)
      return 1 // Fallback sûr
    }
  }

  /**
   * Renuméroter tous les projets d'un utilisateur
   */
  static async renumberProjects(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data: projects } = await supabase
      .from('projects')
      .select('id, code, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!projects || projects.length === 0) return

    // Renuméroter séquentiellement
    for (let i = 0; i < projects.length; i++) {
      const newCode = `PRJ-${i + 1}`
      if (projects[i].code !== newCode) {
        await supabase
          .from('projects')
          .update({ code: newCode })
          .eq('id', projects[i].id)
          .eq('user_id', user.id)
      }
    }
  }

  /**
   * Créer un nouveau projet avec numérotation automatique
   */
  static async create(project: Omit<ProjectInsert, 'user_id' | 'code'>): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      // Générer le code automatiquement
      const nextNumber = await this.getNextProjectNumber()
      const code = `PRJ-${nextNumber}`

      console.log('Création de projet avec code:', code, 'pour utilisateur:', user.id)

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, user_id: user.id, code }])
        .select()
        .single()

      if (error) {
        console.error('Erreur Supabase lors de la création du projet:', error)
        console.error('Code d\'erreur:', error.code)
        console.error('Détails:', error.details)
        console.error('Hint:', error.hint)
        console.error('Données envoyées:', { ...project, user_id: user.id, code })
        throw new Error(`Erreur lors de la création du projet: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Erreur lors de create():', err)
      throw err
    }
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
   * Supprimer un projet et renuméroter automatiquement
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

    // Renuméroter automatiquement après suppression
    await this.renumberProjects()
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
export type ProjectCreateInput = Omit<ProjectInsert, 'user_id' | 'code'>