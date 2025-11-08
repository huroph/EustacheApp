// Service pour la gestion des projets avec Supabase
// src/lib/services/projects.ts

import { supabase, type Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  
  /**
   * Récupérer tous les projets de l'utilisateur connecté
   * Inclut les projets dont il est propriétaire ET ceux partagés avec lui
   */
  static async getAll(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      // Récupérer les projets dont l'utilisateur est propriétaire
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ownedError) {
        console.error('Erreur Supabase lors de la récupération des projets possédés:', ownedError)
        throw new Error(`Erreur lors de la récupération des projets: ${ownedError.message}`)
      }

      // Récupérer les projets partagés avec l'utilisateur
      const { data: sharedProjectsData, error: sharedError } = await supabase
        .from('project_shares')
        .select(`
          role,
          project_id,
          projects (*)
        `)
        .eq('shared_with_user_id', user.id)

      if (sharedError) {
        console.error('Erreur lors de la récupération des projets partagés:', sharedError)
        // Ne pas faire échouer toute la requête si les partages échouent
      }

      // Combiner les projets possédés et partagés
      const ownedProjectsWithRole = (ownedProjects || []).map(project => ({
        ...project,
        user_role: 'owner' as const
      }))

      const sharedProjects = (sharedProjectsData || [])
        .filter((share: any) => share.projects) // Filtrer les partages sans projet
        .map((share: any) => ({
          ...share.projects,
          user_role: share.role as 'viewer' | 'editor'
        }))

      // Fusionner et trier par date de création
      const allProjects = [...ownedProjectsWithRole, ...sharedProjects]
        .sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })

      return allProjects
    } catch (err) {
      console.error('Erreur réseau ou autre lors de getAll():', err)
      throw err
    }
  }

  /**
   * Récupérer un projet par ID 
   * Vérifie que le projet appartient à l'utilisateur OU qu'il est partagé avec lui
   */
  static async getById(id: string): Promise<Project | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    // Vérifier que l'ID est un UUID valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      console.warn('ID de projet invalide (pas un UUID):', id)
      return null
    }

    try {
      // D'abord vérifier si c'est un projet possédé
      const { data: ownedProject, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (ownedProject) {
        return {
          ...ownedProject,
          user_role: 'owner' as const
        }
      }

      // Si pas trouvé, vérifier s'il est partagé
      const { data: sharedProject, error: sharedError } = await supabase
        .from('project_shares')
        .select(`
          role,
          projects (*)
        `)
        .eq('project_id', id)
        .eq('shared_with_user_id', user.id)
        .single()

      if (sharedProject && sharedProject.projects) {
        return {
          ...(sharedProject.projects as any),
          user_role: sharedProject.role as 'viewer' | 'editor'
        }
      }

      return null // Projet non trouvé ou pas accessible
    } catch (err) {
      console.error('Erreur dans getById:', err)
      return null
    }
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