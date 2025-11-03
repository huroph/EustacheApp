// src/app/(app)/breakdown/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import { useSidebar } from '@/hooks/useSidebar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CreateSequenceForm from '@/components/breakdown/CreateSequenceForm'
import ScriptViewer from '@/components/breakdown/ScriptViewer'

export default function BreakdownPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { project, isLoading: projectLoading } = useCurrentProject()
  const { sequences, isLoading: sequencesLoading } = useSequences(project?.id)
  const { isCollapsed } = useSidebar()
  
  // Mode création ou édition basé sur l'URL
  const isCreateMode = searchParams.get('create') === '1'
  const editSequenceId = searchParams.get('edit')
  const isEditMode = !!editSequenceId
  
  // Détermine si on a une séquence à éditer (depuis l'URL ou depuis les séquences existantes)
  const hasSequenceToEdit = isEditMode && editSequenceId && sequences.some(seq => seq.id === editSequenceId)

  useEffect(() => {
    if (!projectLoading && !project) {
      router.push('/projects')
    }
  }, [project, projectLoading, router])

  // Si on est en mode édition, charger la séquence
  useEffect(() => {
    if (isEditMode && editSequenceId) {
      // TODO: Implémenter la logique de chargement de séquence pour l'édition
      console.log('Mode édition pour la séquence:', editSequenceId)
    }
  }, [isEditMode, editSequenceId])

  const handleCreateClick = () => {
    router.push('/breakdown?create=1')
  }

  const handleEditClick = () => {
    // Si on a des séquences, éditer la première pour l'exemple
    // En réalité, ceci viendrait d'une sélection utilisateur
    if (sequences.length > 0) {
      router.push(`/breakdown?edit=${sequences[0].id}`)
    }
  }

  const handleCancel = () => {
    router.push('/breakdown')
  }

  if (projectLoading || sequencesLoading) {
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
      <div className="w-full flex flex-col h-full overflow-y-hidden">
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
          isCreateMode || isEditMode
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {/* Script viewer (left side) - Scrollable */}
          <div className={`rounded-lg overflow-y-auto ${
            isCreateMode || isEditMode ? 'lg:col-span-7' : ''
          }`}>
            {isCreateMode || isEditMode ? (
              // Mode création/édition : affichage du PDF dynamique
              <ScriptViewer 
                scriptUrl={project.script_file}
                projectTitle={project.title}
                mode={isEditMode ? 'edition' : 'creation'}
              />
            ) : (
              // Mode normal : infos générales
              <div className="bg-white rounded-lg p-6 overflow-y-auto shadow-lg border border-gray-200">
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-center text-xl mb-6 text-gray-900 border-b border-gray-200 pb-3" style={{color: '#111827'}}>{project.title.toUpperCase()}</div>
                  
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Script :</strong> <span className="text-blue-700" style={{color: '#1d4ed8'}}>{project.script_file ? project.script_file.split('/').pop() : 'Non défini'}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Période de tournage :</strong> <span className="text-gray-700" style={{color: '#374151'}}>{project.start_date && project.end_date ? `${new Date(project.start_date).toLocaleDateString('fr-FR')} → ${new Date(project.end_date).toLocaleDateString('fr-FR')}` : 'Non définie'}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Année :</strong> <span className="text-gray-700" style={{color: '#374151'}}>{project.start_date ? new Date(project.start_date).getFullYear() : new Date().getFullYear()}</span></p>
                    <p className="text-gray-800" style={{color: '#1f2937'}}><strong className="text-gray-900" style={{color: '#111827'}}>Séquences créées :</strong> <span className="text-green-700 font-semibold" style={{color: '#15803d'}}>{sequences.length}</span></p>
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

                      {sequences.length > 0 && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                          <p className="font-semibold text-green-900 mb-2" style={{color: '#14532d'}}>🎬 Séquences identifiées :</p>
                          <ul className="text-sm text-green-800 mt-2 space-y-1">
                            {sequences.slice(0, 3).map((seq) => (
                              <li key={seq.id} className="text-green-800" style={{color: '#166534'}}>
                                • <span className="font-medium text-green-900" style={{color: '#14532d'}}>{seq.code}</span> - <span className="text-green-700" style={{color: '#15803d'}}>{seq.title}</span>
                              </li>
                            ))}
                            {sequences.length > 3 && (
                              <li className="text-green-600 italic" style={{color: '#16a34a'}}>... et {sequences.length - 3} autres séquences</li>
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
          {isCreateMode || isEditMode ? (
            <div className="lg:col-span-5 overflow-y-hidden">
              <CreateSequenceForm 
                onCancel={handleCancel} 
                editMode={isEditMode}
                sequenceId={editSequenceId || undefined}
              />
            </div>
          ) : (
            <div className="space-y-6 flex flex-col overflow-y-hidden">
              <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
                <h2 className="text-white text-lg font-semibold mb-4">Actions</h2>
                
                <Button variant="default" className="w-full mb-4" onClick={handleCreateClick}>
                  + Créer une séquence
                </Button>
                
                {sequences.length > 0 && (
                  <Button variant="default" className="w-full mb-4" onClick={handleEditClick}>
                    ✏️ Modifier une séquence
                  </Button>
                )}

                <p className="text-gray-400 mb-6">
                  {sequences.length} séquences créées — voir la liste
                </p>
              </div>

              {/* Additional info panel */}
              <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
                <h3 className="text-white text-lg font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Script:</span>
                    <span className="text-white">{project.script_file || 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Séquences créées:</span>
                    <span className="text-white">{sequences.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Année:</span>
                    <span className="text-white">{project.start_date ? new Date(project.start_date).getFullYear() : new Date().getFullYear()}</span>
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