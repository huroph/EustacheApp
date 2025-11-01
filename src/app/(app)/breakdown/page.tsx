// src/app/(app)/breakdown/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'
import { sequences } from '@/mock/data'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CreateSequenceForm from '@/components/breakdown/CreateSequenceForm'

export default function BreakdownPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { project, isLoading } = useCurrentProject()
  
  // Mode création basé sur l'URL
  const isCreateMode = searchParams.get('create') === '1'

  // Récupérer les séquences du projet sélectionné pour le comptage
  const projectSequences = project ? sequences[project.id as keyof typeof sequences] || [] : []

  useEffect(() => {
    if (!isLoading && !project) {
      router.push('/projects')
    }
  }, [project, isLoading, router])

  const handleCreateClick = () => {
    router.push('/breakdown?create=1')
  }

  const handleCancel = () => {
    router.push('/breakdown')
  }

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
        <div className={`grid gap-6 flex-1 min-h-0 overflow-y-hidden ${
          isCreateMode ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {/* Script viewer (left side) - Scrollable */}
          <div className={`rounded-lg overflow-y-auto ${
            isCreateMode ? 'md:col-span-7' : ''
          }`}>
            {isCreateMode ? (
              // Mode création : affichage du PDF
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
                <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
                  Script : Joyeux Noël
                </div>
                <iframe
                  src="/scenarios/Joyeux-Noël.pdf"
                  className="w-full h-full min-h-[600px] rounded border border-slate-600"
                  title="Script Joyeux Noël"
                />
              </div>
            ) : (
              // Mode normal : infos générales
              <div className="bg-white rounded-lg p-6 overflow-y-auto shadow-lg border border-gray-200">
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-center text-xl mb-6 text-gray-900 border-b border-gray-200 pb-3" style={{color: '#111827'}}>{project.title.toUpperCase()}</div>
                  
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Script :</strong> <span className="text-blue-700" style={{color: '#1d4ed8'}}>{project.scriptFile}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Période de tournage :</strong> <span className="text-gray-700" style={{color: '#374151'}}>{new Date(project.startDate).toLocaleDateString('fr-FR')} → {new Date(project.endDate).toLocaleDateString('fr-FR')}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Année :</strong> <span className="text-gray-700" style={{color: '#374151'}}>{project.year}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Séquences créées :</strong> <span className="text-green-700 font-semibold" style={{color: '#15803d'}}>{projectSequences.length}</span></p>
                  </div>

                  <div className="border-t border-gray-300 pt-4 mt-6">
                    <h3 className="font-bold text-gray-900 text-base mb-4" style={{color: '#111827'}}>INFORMATIONS PROJET</h3>
                    
                    <div className="mt-4 space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="font-semibold text-blue-900 mb-2" style={{color: '#1e3a8a'}}>📋 Statut : En préparation</p>
                        <p className="text-blue-800 text-sm leading-relaxed" style={{color: '#1e40af'}}>
                          Projet en cours d'analyse. Le dépouillement du script permettra d'identifier 
                          toutes les séquences et leurs besoins techniques.
                        </p>
                      </div>

                      {projectSequences.length > 0 && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                          <p className="font-semibold text-green-900 mb-2" style={{color: '#14532d'}}>🎬 Séquences identifiées :</p>
                          <ul className="text-sm text-green-800 mt-2 space-y-1">
                            {projectSequences.slice(0, 3).map((seq) => (
                              <li key={seq.id} className="text-green-800" style={{color: '#166534'}}>
                                • <span className="font-medium text-green-900" style={{color: '#14532d'}}>{seq.code}</span> - <span className="text-green-700" style={{color: '#15803d'}}>{seq.title}</span>
                              </li>
                            ))}
                            {projectSequences.length > 3 && (
                              <li className="text-green-600 italic" style={{color: '#16a34a'}}>... et {projectSequences.length - 3} autres séquences</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                        <p className="font-semibold text-amber-900 mb-2" style={{color: '#78350f'}}>⏭️ Prochaines étapes :</p>
                        <ul className="text-sm text-amber-800 mt-2 space-y-1">
                          <li className="text-amber-800" style={{color: '#92400e'}}>• Finaliser l'analyse du script</li>
                          <li className="text-amber-800" style={{color: '#92400e'}}>• Valider toutes les séquences</li>
                          <li className="text-amber-800" style={{color: '#92400e'}}>• Établir le planning de tournage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions panel or Create form (right side) */}
          {isCreateMode ? (
            <div className="md:col-span-5 overflow-y-hidden">
              <CreateSequenceForm onCancel={handleCancel} />
            </div>
          ) : (
            <div className="space-y-6 flex flex-col overflow-y-hidden">
              <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
                <h2 className="text-white text-lg font-semibold mb-4">Actions</h2>
                
                <Button variant="default" className="w-full mb-4" onClick={handleCreateClick}>
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
          )}
        </div>
      </div>
    </div>
  )
}