// src/lib/currentProject.ts
'use client'

import { projects, type Project } from '@/mock/data'

const STORAGE_KEY = 'selectedProjectId'

export function getSelectedProjectId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setSelectedProjectId(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, id)
}

export function getSelectedProject(): Project | null {
  const id = getSelectedProjectId()
  if (!id) return null
  return projects.find(project => project.id === id) || null
}

// Hook client pour gérer le projet courant
import { useState, useEffect } from 'react'

export function useCurrentProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // S'assurer que le composant est monté côté client
    const loadProject = () => {
      const currentProject = getSelectedProject()
      setProject(currentProject)
      setIsLoading(false)
    }

    loadProject()
  }, [])

  const setProjectId = (id: string) => {
    setSelectedProjectId(id)
    const newProject = getSelectedProject()
    setProject(newProject)
  }

  return { project, setProjectId, isLoading }
}