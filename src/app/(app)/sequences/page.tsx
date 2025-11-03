// src/app/(app)/sequences/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import { useSequenceData } from '@/hooks/useSequenceData'
import { SequencesService } from '@/lib/services/sequences'
import { seedCompleteSequence } from '@/utils/seed-complete-sequence'
import SequenceCard from '@/components/sequences/SequenceCard'
import EquipeRolesSection from '@/components/sequences/EquipeRolesSection'
import BreakdownTechniqueSection from '@/components/sequences/BreakdownTechniqueSection'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function SequencesPage() {
  const router = useRouter()
  const { project, isLoading: projectLoading } = useCurrentProject()
  const { sequences, isLoading: sequencesLoading, error, refetch } = useSequences(project?.id)
  const [selectedSequence, setSelectedSequence] = useState<any>(null)
  const [seedLoading, setSeedLoading] = useState(false)
  
  // Hook pour récupérer toutes les données de la séquence sélectionnée
  const sequenceData = useSequenceData(selectedSequence?.id)

  useEffect(() => {
    if (!projectLoading && !project) {
      router.push('/projects')
    }
  }, [project, projectLoading, router])

  // Initialiser la première séquence sélectionnée quand les données changent
  useEffect(() => {
    if (sequences.length > 0 && !selectedSequence) {
      setSelectedSequence(sequences[0])
    } else if (sequences.length === 0) {
      setSelectedSequence(null)
    }
  }, [sequences, selectedSequence])

  const handleEditSequence = (sequence: any) => {
    // Rediriger vers la page de création/modification avec l'ID de la séquence
    router.push(`/breakdown?edit=${sequence.id}`)
  }

  const handleDeleteSequence = async (sequenceId: string) => {
    const sequence = sequences.find(s => s.id === sequenceId)
    if (confirm('Supprimer cette séquence ?')) {
      const loadingToast = toast.loading('Suppression de la séquence...')
      try {
        await SequencesService.delete(sequenceId)
        toast.success(`Séquence "${sequence?.title}" supprimée avec succès`, {
          id: loadingToast,
        })
        await refetch() // Recharger immédiatement
        
        // Si la séquence supprimée était sélectionnée, réinitialiser la sélection
        if (selectedSequence?.id === sequenceId) {
          const remainingSequences = sequences.filter(s => s.id !== sequenceId)
          setSelectedSequence(remainingSequences.length > 0 ? remainingSequences[0] : null)
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression de la séquence', {
          id: loadingToast,
        })
      }
    }
  }

  const handleCreateSequence = () => {
    router.push('/breakdown')
  }

  const handleCreateTestData = async () => {
    if (!project?.id) {
      toast.error('Aucun projet sélectionné')
      return
    }

    setSeedLoading(true)
    const loadingToast = toast.loading('Création des données de test...')
    
    try {
      await seedCompleteSequence(project.id)
      toast.success('Données de test créées avec succès !', {
        id: loadingToast,
      })
      // Recharger les séquences après la création
      await refetch()
    } catch (error: any) {
      console.error('Erreur lors de la création des données de test:', error)
      toast.error(`Erreur: ${error.message}`, {
        id: loadingToast,
      })
    } finally {
      setSeedLoading(false)
    }
  }

  if (projectLoading || sequencesLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400">Erreur : {error}</div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="h-full bg-gray-900 p-6 flex flex-col overflow-y-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full overflow-y-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Badge>👑</Badge>
            <h1 className="text-2xl font-bold text-white">Séquences</h1>
            <span className="text-gray-400">{project.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-y-hidden">
          {/* Sequences list (left side) - Scrollable */}
          <div className="lg:col-span-1 flex flex-col overflow-y-hidden">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-white font-semibold">Séquences</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refetch}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded px-2 py-1"
                  title="Recharger"
                >
                  ↻
                </button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCreateTestData}
                  disabled={seedLoading}
                  className="text-xs"
                >
                  {seedLoading ? '...' : '🎬 Test'}
                </Button>
                <select className="bg-gray-800 text-white text-sm rounded px-3 py-1 border border-gray-600">
                  <option>All</option>
                  <option>EXT</option>
                  <option>INT</option>
                </select>
                <select className="bg-gray-800 text-white text-sm rounded px-3 py-1 border border-gray-600">
                  <option>Recent</option>
                  <option>Oldest</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleCreateSequence}>
                  + Créer
                </Button>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{sequences.length} résultat{sequences.length > 1 ? 's' : ''}</p>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
              {sequences.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  sequence={{
                    id: sequence.id,
                    code: sequence.code,
                    title: sequence.title,
                    status: sequence.status,
                    colorId: sequence.color_id || 'gray',
                    location: sequence.location || '',
                    type: sequence.location_type || 'INT',
                    effet: sequence.time_of_day || 'JOUR',
                    summary: sequence.summary || undefined,
                    createdAt: new Date(sequence.created_at)
                  }}
                  onClick={() => setSelectedSequence(sequence)}
                  isSelected={selectedSequence?.id === sequence.id}
                  onEdit={handleEditSequence}
                  onDelete={handleDeleteSequence}
                />
              ))}
              
              {sequences.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">Aucune séquence créée</p>
                  <Button onClick={handleCreateSequence}>
                    Créer ma première séquence
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sequence details panel (right side) */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 overflow-y-auto">
            {selectedSequence ? (
              <div className="space-y-6">
                {/* Header with sequence info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400 text-sm">{selectedSequence.code}</span>
                      <Badge>{selectedSequence.status}</Badge>
                      <Badge>{selectedSequence.location_type || 'INT'}</Badge>
                      <Badge>{selectedSequence.time_of_day || 'JOUR'}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedSequence.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {selectedSequence.created_at && new Date(selectedSequence.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditSequence(selectedSequence)}
                  >
                    Modifier
                  </Button>
                </div>

                {/* Main Content with 3 Sections */}
                <div className="space-y-4">
                  {/* Section 1: Général */}
                  <CollapsibleSection title="Général" defaultOpen={true}>
                    <div className="space-y-4">
                      {/* Header avec code et statut */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-white font-medium text-lg">{selectedSequence.title}</h4>
                          <span className="px-2 py-1 rounded text-xs bg-gray-600 text-white font-mono">
                            {selectedSequence.code}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedSequence.status === 'Validé' ? 'bg-green-600 text-white' :
                          selectedSequence.status === 'En attente' ? 'bg-yellow-600 text-white' :
                          selectedSequence.status === 'A validé' ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {selectedSequence.status}
                        </span>
                      </div>

                      {/* Décor */}
                      <div>
                        <h5 className="text-gray-400 text-sm mb-2">Décor :</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{selectedSequence.location || 'Lieu non défini'}</span>
                          {selectedSequence.location_type && (
                            <span className="px-2 py-1 rounded text-xs bg-purple-600 text-white">
                              {selectedSequence.location_type}
                            </span>
                          )}
                          {selectedSequence.time_of_day && (
                            <span className="px-2 py-1 rounded text-xs bg-purple-600 text-white">
                              {selectedSequence.time_of_day}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* E.T.T. et Pré-minutage */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-gray-400 text-sm mb-1">E.T.T. :</h5>
                          <p className="text-blue-400 font-semibold text-lg">
                            {selectedSequence.ett || 'Non défini'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-gray-400 text-sm mb-1">Pré-minutage :</h5>
                          <p className="text-blue-400 font-semibold text-lg">
                            {selectedSequence.pre_montage || 'Non défini'}
                          </p>
                        </div>
                      </div>

                      {/* Résumé */}
                      {selectedSequence.summary && (
                        <div>
                          <h5 className="text-gray-400 text-sm mb-2">Résumé :</h5>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {selectedSequence.summary}
                          </p>
                        </div>
                      )}

                      {/* Statistiques rapides */}
                      {sequenceData && (
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold text-lg">
                              {sequenceData.roles.length}
                            </div>
                            <div className="text-gray-400 text-xs">Rôles</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-semibold text-lg">
                              {sequenceData.effetsSpeciaux.length}
                            </div>
                            <div className="text-gray-400 text-xs">Effets</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-semibold text-lg">
                              {sequenceData.equipesTechniques.length}
                            </div>
                            <div className="text-gray-400 text-xs">Équipe</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-400 font-semibold text-lg">
                              {sequenceData.costumes.length + sequenceData.accessoires.length}
                            </div>
                            <div className="text-gray-400 text-xs">Items</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* Section 2: Équipe et Rôles */}
                  <EquipeRolesSection 
                    selectedSequence={selectedSequence} 
                    sequenceData={sequenceData}
                  />

                  {/* Section 3: Breakdown Technique */}
                  <BreakdownTechniqueSection 
                    selectedSequence={selectedSequence}
                    sequenceData={sequenceData}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Sélectionnez une séquence pour voir les détails
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}