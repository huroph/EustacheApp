// src/app/(app)/breakdown/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'
import { sequences } from '@/mock/data'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function BreakdownPage() {
  const router = useRouter()
  const { project, isLoading } = useCurrentProject()

  // Récupérer les séquences du projet sélectionné pour le comptage
  const projectSequences = project ? sequences[project.id as keyof typeof sequences] || [] : []

  useEffect(() => {
    if (!isLoading && !project) {
      router.push('/projects')
    }
  }, [project, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!project) {
    return null
  }
  return (
    <div className="h-full bg-gray-900 p-6 flex flex-col overflow-y-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full overflow-y-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Badge>👑</Badge>
            <h1 className="text-2xl font-bold text-white">Dépouillement</h1>
            <span className="text-gray-400">{project.title}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">1 / 8</span>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-hidden">
          {/* Script viewer (left side) - Scrollable */}
          <div className="bg-white rounded-lg p-6 overflow-y-auto shadow-lg">
            <div className="space-y-4 text-sm">
              <div className="font-bold text-center text-xl mb-6 text-gray-900 border-b border-gray-200 pb-3">{project.title.toUpperCase()}</div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800"><strong className="text-gray-900">Script :</strong> <span className="text-blue-700">{project.scriptFile}</span></p>
                <p className="text-gray-800"><strong className="text-gray-900">Période de tournage :</strong> <span className="text-gray-700">{new Date(project.startDate).toLocaleDateString('fr-FR')} → {new Date(project.endDate).toLocaleDateString('fr-FR')}</span></p>
                <p className="text-gray-800"><strong className="text-gray-900">Année :</strong> <span className="text-gray-700">{project.year}</span></p>
                <p className="text-gray-800"><strong className="text-gray-900">Séquences créées :</strong> <span className="text-green-700 font-semibold">{projectSequences.length}</span></p>
              </div>

              <div className="border-t border-gray-300 pt-4 mt-6">
                <h3 className="font-bold text-gray-900 text-base mb-4">INFORMATIONS PROJET</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="font-semibold text-blue-900 mb-2">📋 Statut : En préparation</p>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Projet en cours d'analyse. Le dépouillement du script permettra d'identifier 
                      toutes les séquences et leurs besoins techniques.
                    </p>
                  </div>

                  {projectSequences.length > 0 && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                      <p className="font-semibold text-green-900 mb-2">🎬 Séquences identifiées :</p>
                      <ul className="text-sm text-green-800 mt-2 space-y-1">
                        {projectSequences.slice(0, 3).map((seq) => (
                          <li key={seq.id} className="text-green-800">
                            • <span className="font-medium text-green-900">{seq.code}</span> - <span className="text-green-700">{seq.title}</span>
                          </li>
                        ))}
                        {projectSequences.length > 3 && (
                          <li className="text-green-600 italic">... et {projectSequences.length - 3} autres séquences</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                    <p className="font-semibold text-amber-900 mb-2">⏭️ Prochaines étapes :</p>
                    <ul className="text-sm text-amber-800 mt-2 space-y-1">
                      <li className="text-amber-800">• Finaliser l'analyse du script</li>
                      <li className="text-amber-800">• Valider toutes les séquences</li>
                      <li className="text-amber-800">• Établir le planning de tournage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions panel (right side) */}
          <div className="space-y-6 flex flex-col overflow-y-hidden">
            <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
              <h2 className="text-white text-lg font-semibold mb-4">Actions</h2>
              
              <Button variant="default" className="w-full mb-4">
                + Créer une séquence
              </Button>
              
              <p className="text-gray-400 mb-6">
                {projectSequences.length} séquences créées — voir la liste
              </p>
            </div>

            {/* Additional info panel */}
            <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
              <h3 className="text-white text-lg font-semibold mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Script:</span>
                  <span className="text-white">{project.scriptFile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Séquences créées:</span>
                  <span className="text-white">{projectSequences.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Année:</span>
                  <span className="text-white">{project.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}