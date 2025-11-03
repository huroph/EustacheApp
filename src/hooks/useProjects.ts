// Hook React pour la gestion des projets avec Supabase
// src/hooks/useProjects.ts

'use client'

import { useState, useEffect } from 'react'
import { ProjectsService, type Project } from '@/lib/services/projects'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ProjectsService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors du chargement des projets:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const createProject = async (projectData: {
    title: string
    description?: string
    script_file?: string
    start_date?: string
    end_date?: string
    cover_url?: string
    status?: 'En préparation' | 'En cours' | 'Terminé' | 'Archivé'
  }) => {
    try {
      const newProject = await ProjectsService.create(projectData)
      await loadProjects() // Recharger pour voir la numérotation automatique
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      throw err
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await ProjectsService.update(id, updates)
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      )
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await ProjectsService.delete(id) // Inclut la renumérotation automatique
      await loadProjects() // Recharger pour voir les nouveaux numéros
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      throw err
    }
  }

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects
  }
}

export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setProject(null)
      setIsLoading(false)
      return
    }

    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await ProjectsService.getById(id)
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        console.error('Erreur lors du chargement du projet:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [id])

  return { project, isLoading, error }
}