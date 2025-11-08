// ============================================
// 🎣 HOOK POUR LE PARTAGE DE PROJETS
// ============================================
// Ce hook gère l'état et les opérations de partage de projets

'use client';

import { useState } from 'react';
import {
  ProjectSharesService,
  ProjectShare,
  ShareProjectParams,
  ShareRole,
} from '@/services/ProjectSharesService';
import toast from 'react-hot-toast';

export interface UseProjectSharesReturn {
  shares: ProjectShare[];
  isLoading: boolean;
  error: string | null;
  shareProject: (email: string, role: ShareRole) => Promise<boolean>;
  unshareProject: (sharedWithUserId: string) => Promise<boolean>;
  loadProjectShares: () => Promise<void>;
  refreshShares: () => Promise<void>;
}

/**
 * Hook pour gérer le partage d'un projet spécifique
 */
export function useProjectShares(projectId: string): UseProjectSharesReturn {
  const [shares, setShares] = useState<ProjectShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les partages du projet
   */
  const loadProjectShares = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProjectSharesService.getProjectShares(projectId);
      setShares(data);
    } catch (err) {
      const message = 'Erreur lors du chargement des partages';
      setError(message);
      console.error(message, err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Partager le projet avec un utilisateur
   */
  const shareProject = async (
    email: string,
    role: ShareRole
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const params: ShareProjectParams = {
      projectId,
      userEmail: email,
      role,
    };

    try {
      const result = await ProjectSharesService.shareProject(params);

      if (result.success) {
        toast.success(result.message);
        // Recharger la liste des partages
        await loadProjectShares();
        return true;
      } else {
        toast.error(result.message);
        setError(result.message);
        return false;
      }
    } catch (err) {
      const message = 'Erreur lors du partage du projet';
      toast.error(message);
      setError(message);
      console.error(message, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retirer le partage d'un projet
   */
  const unshareProject = async (
    sharedWithUserId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ProjectSharesService.unshareProject(
        projectId,
        sharedWithUserId
      );

      if (result.success) {
        toast.success(result.message);
        // Recharger la liste des partages
        await loadProjectShares();
        return true;
      } else {
        toast.error(result.message);
        setError(result.message);
        return false;
      }
    } catch (err) {
      const message = 'Erreur lors de la suppression du partage';
      toast.error(message);
      setError(message);
      console.error(message, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Rafraîchir la liste des partages
   */
  const refreshShares = async () => {
    await loadProjectShares();
  };

  return {
    shares,
    isLoading,
    error,
    shareProject,
    unshareProject,
    loadProjectShares,
    refreshShares,
  };
}

/**
 * Hook pour obtenir les projets partagés AVEC moi
 */
export function useSharedProjects() {
  const [sharedProjects, setSharedProjects] = useState<ProjectShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSharedProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProjectSharesService.getSharedProjects();
      setSharedProjects(data);
    } catch (err) {
      const message = 'Erreur lors du chargement des projets partagés';
      setError(message);
      console.error(message, err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sharedProjects,
    isLoading,
    error,
    loadSharedProjects,
  };
}
