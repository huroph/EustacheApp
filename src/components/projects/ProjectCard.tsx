// src/components/projects/ProjectCard.tsx
import React from 'react'
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
  }
  onSelect?: (projectId: string) => void
  onEdit?: (project: any) => void
  onDelete?: (projectId: string) => void
}

export default function ProjectCard({ project, onSelect, onEdit, onDelete }: ProjectCardProps) {
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
    // Éviter le clic si on clique sur un bouton d'action
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onSelect?.(project.id)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 cursor-pointer hover:bg-gray-750 transition-colors relative group"
    >
      {/* Boutons d'action */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 z-10">
        {onEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(project)
            }}
            className="text-xs"
          >
            ✏️
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
            className="text-xs text-red-400 border-red-600 hover:bg-red-600"
          >
            🗑️
          </Button>
        )}
      </div>

      {/* Image placeholder */}
      <div className="w-full h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center overflow-hidden">
        {project.cover_url ? (
          <img 
            src={project.cover_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Image du projet</span>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-lg pr-16">{project.title}</h3>
        
        {project.description && (
          <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">{project.script_file || 'Aucun script'}</span>
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
          <span className="text-gray-400 text-sm">
            {project.code}
          </span>
        </div>
      </div>
    </div>
  )
}
