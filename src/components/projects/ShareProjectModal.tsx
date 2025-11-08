// ============================================
// 🔗 MODAL DE PARTAGE DE PROJET
// ============================================
// Ce composant permet de partager un projet avec d'autres utilisateurs

'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, UserPlus, Trash2, Crown, Eye, Edit } from 'lucide-react';
import { useProjectShares } from '@/hooks/useProjectShares';
import { ShareRole } from '@/services/ProjectSharesService';
import Button from '@/components/ui/Button';

interface ShareProjectModalProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareProjectModal({
  projectId,
  projectName,
  isOpen,
  onClose,
}: ShareProjectModalProps) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<ShareRole>('viewer');
  const { shares, isLoading, shareProject, unshareProject, loadProjectShares } =
    useProjectShares(projectId);

  // Charger les partages au montage du composant
  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectShares();
    }
  }, [isOpen, projectId]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    const success = await shareProject(email.trim(), selectedRole);

    if (success) {
      setEmail('');
      setSelectedRole('viewer');
    }
  };

  const handleUnshare = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer cet accès ?')) {
      await unshareProject(userId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Partager le projet
            </h2>
            <p className="text-sm text-zinc-400 mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Formulaire d'ajout */}
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Partager avec un utilisateur
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as ShareRole)}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="viewer">Lecteur</option>
                  <option value="editor">Éditeur</option>
                </select>

                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </div>

            <div className="text-xs text-zinc-500 space-y-1">
              <p>
                <strong className="text-zinc-400">Lecteur :</strong> Peut
                consulter le projet uniquement
              </p>
              <p>
                <strong className="text-zinc-400">Éditeur :</strong> Peut
                consulter et modifier le projet
              </p>
            </div>
          </form>

          {/* Liste des utilisateurs avec accès */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">
              Utilisateurs avec accès ({shares.length})
            </h3>

            {shares.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>Ce projet n&apos;est partagé avec personne</p>
                <p className="text-xs mt-2">
                  Utilisez le formulaire ci-dessus pour partager
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {share.shared_with_email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          {share.shared_with_email || 'Utilisateur inconnu'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {share.role === 'viewer' ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Eye className="w-3 h-3" />
                              Lecteur
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              <Edit className="w-3 h-3" />
                              Éditeur
                            </span>
                          )}
                          <span className="text-xs text-zinc-500">
                            Depuis le{' '}
                            {new Date(share.created_at).toLocaleDateString(
                              'fr-FR'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnshare(share.shared_with_user_id)}
                      disabled={isLoading}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Retirer l'accès"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <Button onClick={onClose} variant="secondary">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
