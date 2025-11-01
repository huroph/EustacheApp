// src/app/(app)/projects/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { projects } from '@/mock/data'
import { setSelectedProjectId } from '@/lib/currentProject'
import Badge from '@/components/ui/Badge'

export default function ProjectsPage() {
  const router = useRouter()

  // Grouper les projets par année
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = []
    }
    acc[project.year].push(project)
    return acc
  }, {} as Record<number, typeof projects>)

  // Trier les années (plus récentes en premier)
  const sortedYears = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  const handleProjectClick = async (projectId: string) => {
    try {
      setSelectedProjectId(projectId)
      // Petit délai pour s'assurer que le localStorage est écrit
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/breakdown')
    } catch (error) {
      console.error('Erreur lors de la sélection du projet:', error)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-gray-400">Sélectionnez un projet pour commencer</p>
        </div>

        {/* Projets groupés par année */}
        {sortedYears.map(year => (
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
                      <span className="text-gray-400 text-sm">{project.scriptFile}</span>
                    </div>

                    <div className="text-gray-400 text-sm">
                      {formatDateRange(project.startDate, project.endDate)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        Propriétaire
                      </span>
                      {project.sequencesCount && (
                        <span className="text-gray-400 text-sm">
                          {project.sequencesCount} séquences
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}