// Hook pour gérer le projet courant avec Supabase
// src/lib/currentProject-supabase.ts

'use client'

import { useState, useEffect } from 'react'
import { ProjectsService, type Project } from '@/lib/services/projects'
import { SequencesService } from '@/lib/services/sequences'

const STORAGE_KEY = 'selectedProjectId'

// Fonctions localStorage (inchangées)
export function getSelectedProjectId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setSelectedProjectId(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, id)
}

// Version Supabase
export async function getSelectedProject(): Promise<Project | null> {
  const id = getSelectedProjectId()
  if (!id) return null
  
  try {
    return await ProjectsService.getById(id)
  } catch (error) {
    console.error('Erreur lors de la récupération du projet sélectionné:', error)
    return null
  }
}

// Hook React mis à jour pour Supabase avec comptage des séquences
export function useCurrentProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [sequencesCount, setSequencesCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadProject = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const currentProject = await getSelectedProject()
      setProject(currentProject)
      
      // Compter les séquences du projet
      if (currentProject) {
        try {
          const count = await SequencesService.countByProject(currentProject.id)
          setSequencesCount(count)
        } catch (seqError) {
          console.error('Erreur lors du comptage des séquences:', seqError)
          setSequencesCount(0) // Valeur par défaut
        }
      } else {
        setSequencesCount(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors du chargement du projet courant:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProject()

    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      loadProject()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Écouter les événements personnalisés pour le changement de projet
    const handleProjectChange = () => {
      setRefreshKey(prev => prev + 1) // Force le refresh
    }

    window.addEventListener('projectChanged', handleProjectChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('projectChanged', handleProjectChange)
    }
  }, [refreshKey]) // Dépendance sur refreshKey pour forcer le reload

  const setProjectId = async (id: string) => {
    try {
      setSelectedProjectId(id)
      await loadProject()
      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('projectChanged'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sélection')
    }
  }

  return { project, sequencesCount, setProjectId, isLoading, error, refetch: loadProject }
}