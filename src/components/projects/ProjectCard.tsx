// src/components/projects/ProjectCard.tsx
import React from 'react'
import { CheckCircle, Lock, AlertCircle, Pencil, Trash2, Crown, Eye } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description?: string | null
    script_file?: string | null
    start_date?: string | null
    end_date?: string | null
    status: string
    code: string
    cover_url?: string | null
    user_id?: string | null
    user_role?: 'owner' | 'viewer' | 'editor' | 'none' // Nouveau: rôle de l'utilisateur
  }
  currentUserId?: string | null
  onSelect?: (projectId: string) => void
  onEdit?: (project: any) => void
  onDelete?: (projectId: string) => void
  // Nouveaux props pour le mode sélection
  isSelectionMode?: boolean
  isSelected?: boolean
  onToggleSelection?: (projectId: string) => void
}

export default function ProjectCard({ 
  project, 
  currentUserId, 
  onSelect, 
  onEdit, 
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}: ProjectCardProps) {
  // Déterminer si c'est le propriétaire du projet
  const isOwner = !project.user_role || project.user_role === 'owner'
  const isViewer = project.user_role === 'viewer'
  
  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return 'Dates non définies'
    
    const start = new Date(startDate).toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'short'
    })
    const end = new Date(endDate).toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    return `${start} → ${end}`
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // En mode sélection, gérer le toggle
    if (isSelectionMode && onToggleSelection) {
      onToggleSelection(project.id)
      return
    }

    // Éviter le clic si on clique sur un bouton d'action
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onSelect?.(project.id)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-gray-800 rounded-lg border p-6 cursor-pointer transition-all relative group ${
        isSelectionMode 
          ? isSelected 
            ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50' 
            : 'border-gray-700 hover:border-blue-400/50'
          : 'border-gray-700 hover:bg-gray-750'
      }`}
    >
      {/* Checkbox en mode sélection */}
      {isSelectionMode && (
        <div className="absolute top-4 left-4 z-10">
          <div 
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-600 bg-gray-900'
            }`}
          >
            {isSelected && (
              <CheckCircle className="w-4 h-4 text-white" fill="white" />
            )}
          </div>
        </div>
      )}

      {/* Boutons d'action (seulement si pas en mode sélection ET si propriétaire/éditeur) */}
      {!isSelectionMode && !isViewer && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(project)
              }}
              className="text-xs cursor-pointer bg-blue-500/10 border-blue-400/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
              title="Éditer le projet"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project.id)
              }}
              className="text-xs cursor-pointer bg-orange-500/10 border-orange-400/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400/50 transition-all"
              title="Supprimer le projet"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className={`space-y-3 ${isSelectionMode ? 'ml-9' : ''}`}>
        <div className="flex items-center space-x-2 pr-16">
          <h3 className="text-white font-semibold text-lg">{project.title}</h3>
          {isOwner && (
            <div className="flex items-center space-x-1 bg-yellow-500/10 border border-yellow-400/30 rounded-full px-2 py-0.5">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Propriétaire</span>
            </div>
          )}
          {isViewer && (
            <div className="flex items-center space-x-1 bg-blue-500/10 border border-blue-400/30 rounded-full px-2 py-0.5">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Lecteur</span>
            </div>
          )}
        </div>
        
        {project.description && (
          <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex items-center space-x-2">
          {project.script_file ? (
            <div className="flex items-center space-x-2">
               <span className="text-green-400 text-sm font-medium">Script</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
             
              <Lock className="w-4 h-4 text-green-400" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              
              <span className="text-gray-400 text-sm">Aucun script transmis</span>
              <AlertCircle className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>

        <div className="text-gray-400 text-sm">
          {formatDateRange(project.start_date || null, project.end_date || null)}
        </div>

        <div className="flex items-center justify-between">
          <span 
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white ${
              project.status === 'En cours' ? 'bg-green-600' :
              project.status === 'Terminé' ? 'bg-blue-600' :
              project.status === 'Archivé' ? 'bg-gray-600' :
              'bg-orange-600'
            }`}
          >
            {project.status}
          </span>
          
        </div>
      </div>
    </div>
  )
}
