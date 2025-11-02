// src/app/(app)/sequences/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import { SequencesService } from '@/lib/services/sequences'
import SequenceCard from '@/components/sequences/SequenceCard'
import EquipeRolesSection from '@/components/sequences/EquipeRolesSection'
import BreakdownTechniqueSection from '@/components/sequences/BreakdownTechniqueSection'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function SequencesPage() {
  const router = useRouter()
  const { project, isLoading: projectLoading } = useCurrentProject()
  const { sequences, isLoading: sequencesLoading, error, refetch } = useSequences(project?.id)
  const [selectedSequence, setSelectedSequence] = useState<any>(null)

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
                <div className="space-y-8">
                  {/* Section 1: Général */}
                  <section className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      Général
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Informations générales */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium text-lg mb-3">Informations</h4>
                        
                        <div>
                          <h5 className="text-gray-400 text-sm mb-1">Localisation :</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-white">{selectedSequence.location || 'Non défini'}</span>
                            <Badge>{selectedSequence.location_type || 'INT'}</Badge>
                            <Badge>{selectedSequence.time_of_day || 'JOUR'}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-gray-400 text-sm mb-1">E.T.T. (hh:mm) :</h5>
                            <p className="text-blue-400 font-semibold">{selectedSequence.ett || 'Non défini'}</p>
                          </div>
                          <div>
                            <h5 className="text-gray-400 text-sm mb-1">Pré-minutage :</h5>
                            <p className="text-blue-400 font-semibold">{selectedSequence.pre_montage || 'Non défini'}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-gray-400 text-sm mb-2">Résumé :</h5>
                          <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 p-3 rounded">
                            {selectedSequence.summary || 'Aucun résumé disponible'}
                          </p>
                        </div>
                      </div>

                      {/* Scènes */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium text-lg">Scènes</h4>
                          <Button size="sm">+ Ajouter</Button>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-gray-400 text-sm">
                            <p>🎬 Aucune scène</p>
                            <p className="mt-2">Ajouter des scènes à cette séquence</p>
                          </div>
                        </div>
                      </div>

                      {/* Décors */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium text-lg">Décors</h4>
                          <Button size="sm">+ Ajouter</Button>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-gray-400 text-sm">
                            <p>🏠 Aucun décor</p>
                            <p className="mt-2">Ajouter des décors à cette séquence</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Équipe et Rôles */}
                  <EquipeRolesSection selectedSequence={selectedSequence} />

                  {/* Section 3: Breakdown Technique */}
                  <BreakdownTechniqueSection selectedSequence={selectedSequence} />
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