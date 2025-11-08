// ============================================
// 🔗 SERVICE DE PARTAGE DE PROJETS
// ============================================
// Ce service gère le partage de projets entre utilisateurs
// avec validation d'email et gestion des rôles

import { supabase } from '@/lib/supabase';

// Types
export type ShareRole = 'viewer' | 'editor';

export interface ProjectShare {
  id: string;
  project_id: string;
  shared_with_user_id: string;
  role: ShareRole;
  shared_by_user_id: string;
  created_at: string;
  updated_at: string;
  shared_with_email?: string; // Enrichi par les requêtes
}

export interface ShareProjectParams {
  projectId: string;
  userEmail: string;
  role: ShareRole;
}

export interface ShareResult {
  success: boolean;
  message: string;
  share?: ProjectShare;
}

// ============================================
// SERVICE PRINCIPAL
// ============================================

export const ProjectSharesService = {
  /**
   * Partager un projet avec un utilisateur via son email
   */
  async shareProject(params: ShareProjectParams): Promise<ShareResult> {
    const { projectId, userEmail, role } = params;

    try {
      // 1. Récupérer l'utilisateur actuel
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        return {
          success: false,
          message: 'Vous devez être connecté pour partager un projet',
        };
      }

      // 2. Vérifier que l'email existe dans la base
      const { data: userId, error: lookupError } = await supabase.rpc(
        'get_user_id_by_email',
        { user_email: userEmail }
      );

      if (lookupError) {
        console.error('Erreur lors de la recherche utilisateur:', lookupError);
        return {
          success: false,
          message: 'Erreur lors de la recherche de l\'utilisateur',
        };
      }

      if (!userId) {
        return {
          success: false,
          message: 'Aucun utilisateur trouvé avec cet email',
        };
      }

      // 3. Vérifier qu'on ne partage pas avec soi-même
      if (userId === currentUser.id) {
        return {
          success: false,
          message: 'Vous ne pouvez pas partager un projet avec vous-même',
        };
      }

      // 4. Vérifier que l'utilisateur est bien le propriétaire du projet
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        return {
          success: false,
          message: 'Projet non trouvé',
        };
      }

      if (project.user_id !== currentUser.id) {
        return {
          success: false,
          message: 'Vous devez être le propriétaire du projet pour le partager',
        };
      }

      // 5. Créer le partage (upsert pour éviter les doublons)
      const { data: share, error: shareError } = await supabase
        .from('project_shares')
        .upsert(
          {
            project_id: projectId,
            shared_with_user_id: userId,
            role: role,
            shared_by_user_id: currentUser.id,
          },
          {
            onConflict: 'project_id,shared_with_user_id',
          }
        )
        .select()
        .single();

      if (shareError) {
        console.error('Erreur lors du partage:', shareError);
        return {
          success: false,
          message: 'Erreur lors du partage du projet',
        };
      }

      return {
        success: true,
        message: `Projet partagé avec ${userEmail} en tant que ${
          role === 'viewer' ? 'lecteur' : 'éditeur'
        }`,
        share,
      };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return {
        success: false,
        message: 'Une erreur inattendue s\'est produite',
      };
    }
  },

  /**
   * Retirer le partage d'un projet
   */
  async unshareProject(
    projectId: string,
    sharedWithUserId: string
  ): Promise<ShareResult> {
    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        return {
          success: false,
          message: 'Vous devez être connecté',
        };
      }

      const { error } = await supabase
        .from('project_shares')
        .delete()
        .eq('project_id', projectId)
        .eq('shared_with_user_id', sharedWithUserId);

      if (error) {
        console.error('Erreur lors de la suppression du partage:', error);
        return {
          success: false,
          message: 'Erreur lors de la suppression du partage',
        };
      }

      return {
        success: true,
        message: 'Partage retiré avec succès',
      };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return {
        success: false,
        message: 'Une erreur inattendue s\'est produite',
      };
    }
  },

  /**
   * Obtenir tous les projets partagés AVEC moi
   */
  async getSharedProjects(): Promise<ProjectShare[]> {
    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        console.error('Erreur utilisateur:', userError);
        return [];
      }

      const { data, error } = await supabase
        .from('project_shares')
        .select('*')
        .eq('shared_with_user_id', currentUser.id);

      if (error) {
        console.error('Erreur lors de la récupération des partages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return [];
    }
  },

  /**
   * Obtenir tous les partages d'UN projet spécifique
   * (pour afficher qui a accès au projet)
   */
  async getProjectShares(projectId: string): Promise<ProjectShare[]> {
    try {
      const { data, error } = await supabase
        .from('project_shares')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        console.error('Erreur lors de la récupération des partages:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Récupérer les emails via la fonction SQL
      const sharesWithEmails = await Promise.all(
        data.map(async (share) => {
          try {
            const { data: emailData, error: emailError } = await supabase.rpc(
              'get_user_email_by_id',
              { user_id: share.shared_with_user_id }
            );

            return {
              ...share,
              shared_with_email: emailData || 'Email non disponible',
            };
          } catch (err) {
            console.error('Erreur récupération email:', err);
            return {
              ...share,
              shared_with_email: 'Email non disponible',
            };
          }
        })
      );

      return sharesWithEmails;
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return [];
    }
  },

  /**
   * Vérifier le rôle d'un utilisateur sur un projet
   * Retourne: 'owner' | 'viewer' | 'editor' | 'none'
   */
  async getUserProjectRole(projectId: string): Promise<string> {
    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        return 'none';
      }

      const { data, error } = await supabase.rpc('get_user_project_role', {
        p_project_id: projectId,
        p_user_id: currentUser.id,
      });

      if (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        return 'none';
      }

      return data || 'none';
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return 'none';
    }
  },
};
