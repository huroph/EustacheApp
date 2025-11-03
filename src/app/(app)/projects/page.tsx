// src/app/(app)/projects/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useProjects } from '@/hooks/useProjects'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { Project } from '@/lib/services/projects'
import { fixProjectCodes } from '@/utils/fix-projects'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectForm, { ProjectFormData } from '@/components/projects/ProjectForm'
import Button from '@/components/ui/Button'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, isLoading, error, refetch, createProject, updateProject, deleteProject } = useProjects()
  const { setProjectId } = useCurrentProject()
  
  // États pour la gestion des modales
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  

  

  // Grouper les projets par année (basé sur start_date)
  const projectsByYear = projects.reduce((acc, project) => {
    const year = project.start_date ? new Date(project.start_date).getFullYear() : new Date().getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(project)
    return acc
  }, {} as Record<number, typeof projects>)

  // Trier les années (plus récentes en premier)
  const sortedYears = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  const handleProjectClick = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    const loadingToast = toast.loading('Sélection du projet...')
    
    try {
      await setProjectId(projectId)
      // Petit délai pour s'assurer que le localStorage est écrit
      await new Promise(resolve => setTimeout(resolve, 100))
      
      toast.success(`Projet "${project?.title}" sélectionné`, {
        id: loadingToast,
      })
      
      router.push('/sequences')
    } catch (error) {
      console.error('Erreur lors de la sélection du projet:', error)
      toast.error('Erreur lors de la sélection du projet', {
        id: loadingToast,
      })
    }
  }

  const handleCreateProject = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ?`)) {
      return
    }

    const loadingToast = toast.loading('Suppression du projet...')
    
    try {
      await deleteProject(projectId)
      toast.success(`Projet "${project.title}" supprimé avec succès`, {
        id: loadingToast,
      })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du projet', {
        id: loadingToast,
      })
    }
  }

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    const loadingToast = toast.loading(editingProject ? 'Modification...' : 'Création...')

    try {
      if (editingProject) {
        await updateProject(editingProject.id, data)
        toast.success('Projet modifié avec succès', {
          id: loadingToast,
        })
      } else {
        await createProject(data)
        toast.success('Projet créé avec succès', {
          id: loadingToast,
        })
      }
      setShowForm(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast.error('Erreur lors de la sauvegarde', {
        id: loadingToast,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProject(null)
  }

  const handleFixProjects = async () => {
    const loadingToast = toast.loading('Réparation des codes de projets...')
    try {
      await fixProjectCodes()
      await refetch() // Recharger les projets
      toast.success('Codes de projets réparés avec succès', {
        id: loadingToast,
      })
    } catch (error) {
      console.error('Erreur lors de la réparation:', error)
      toast.error('Erreur lors de la réparation', {
        id: loadingToast,
      })
    }
  }

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

  // Si on affiche le formulaire
  if (showForm) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <ProjectForm
            project={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          Chargement des projets...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">❌ Erreur</div>
          <div className="text-gray-300 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 p-6 flex flex-col overflow-y-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full overflow-y-hidden">
        {/* Header */}
        <div className="mb-8 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">Projets</h1>
              <p className="text-gray-400">Sélectionnez un projet pour commencer</p>
            </div>
            
            {/* Boutons de gestion */}
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateProject}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Nouveau projet
              </Button>
              
              {/* Bouton de débogage temporaire */}
              <Button
                onClick={handleFixProjects}
                className="bg-yellow-600 hover:bg-yellow-700 text-xs"
              >
                🔧 Réparer codes
              </Button>
            </div>
          </div>
        </div>

        {/* Projets groupés par année - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-400 text-lg mb-4">Aucun projet trouvé</div>
              <div className="text-gray-500 text-sm mb-6">
                Commencez par ajouter des projets de test ou créez votre premier projet
              </div>
              <button
                onClick={handleCreateProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Créer votre premier projet
              </button>
            </div>
          ) : (
            sortedYears.map(year => (
              <div key={year} className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">{year}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectsByYear[year].map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={handleProjectClick}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  )
}