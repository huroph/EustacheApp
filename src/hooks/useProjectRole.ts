// src/hooks/useProjectRole.ts
'use client'

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import type { Project } from '@/lib/services/projects'

export type ProjectRole = 'owner' | 'editor' | 'reader' | null

export function useProjectRole(project: Project | null): ProjectRole {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user || !project) return null
    
    // Si l'utilisateur est le créateur du projet, il en est propriétaire
    if (project.user_id === user.id) {
      return 'owner'
    }
    
    // TODO: Ici on checkera plus tard la table project_shares
    // pour déterminer si l'utilisateur a accès en lecture/écriture
    // const sharedRole = getSharedRole(project.id, user.id)
    // return sharedRole // 'editor' | 'reader' | null
    
    return null // Pas d'accès par défaut
  }, [user, project])
}

export function useCanEditProject(project: Project | null): boolean {
  const role = useProjectRole(project)
  return role === 'owner' || role === 'editor'
}

export function useCanViewProject(project: Project | null): boolean {
  const role = useProjectRole(project)
  return role === 'owner' || role === 'editor' || role === 'reader'
}