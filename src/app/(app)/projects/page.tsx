// src/app/(app)/projects/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import Badge from '@/components/ui/Badge'
import { seedProjects, clearProjects } from '@/utils/seed-projects'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, isLoading, error, refetch } = useProjects()
  const { setProjectId } = useCurrentProject()

  const handleSeedProjects = async () => {
    const success = await seedProjects()
    if (success) {
      refetch() // Recharger la liste
    }
  }

  const handleClearProjects = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les projets ?')) {
      const success = await clearProjects()
      if (success) {
        refetch() // Recharger la liste
      }
    }
  }

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
    try {
      await setProjectId(projectId)
      // Petit délai pour s'assurer que le localStorage est écrit
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/sequences')
    } catch (error) {
      console.error('Erreur lors de la sélection du projet:', error)
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
            
            {/* Boutons de test (temporaires) */}
            <div className="flex space-x-2">
              <button
                onClick={handleSeedProjects}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                + Ajouter projets test
              </button>
              <button
                onClick={handleClearProjects}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                🗑️ Vider
              </button>
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
                onClick={handleSeedProjects}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Ajouter des projets de test
              </button>
            </div>
          ) : (
            sortedYears.map(year => (
              <div key={year} className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">{year}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectsByYear[year].map(project => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    {/* Image placeholder */}
                    <div className="w-full h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Image du projet</span>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{project.script_file || 'Aucun script'}</span>
                      </div>

                      <div className="text-gray-400 text-sm">
                        {formatDateRange(project.start_date, project.end_date)}
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