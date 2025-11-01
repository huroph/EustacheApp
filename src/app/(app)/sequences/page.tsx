// src/app/(app)/sequences/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'
import { sessionStore } from '@/lib/sessionData'
import SequenceCard from '@/components/sequences/SequenceCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function SequencesPage() {
  const router = useRouter()
  const { project, isLoading } = useCurrentProject()
  const [selectedSequence, setSelectedSequence] = useState<any>(null)
  const [sequences, setSequences] = useState<any[]>([])

  // Fonction pour recharger les séquences
  const loadSequences = () => {
    const allSequences = sessionStore.getSequences()
    setSequences(allSequences)
    console.log('Séquences rechargées:', allSequences)
  }

  // Debug: afficher le sessionStore au montage
  useEffect(() => {
    console.log('=== DEBUG SEQUENCES PAGE ===')
    sessionStore.debugLog()
    loadSequences()
  }, [])

  // Charger les séquences depuis sessionStore
  useEffect(() => {
    loadSequences()
    
    // Recharger les séquences quand la page reprend le focus
    const handleFocus = () => {
      loadSequences()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Effet pour recharger les séquences quand on revient sur cette page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSequences()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Subscribe to sessionStore changes so the list refreshes immediately after create/update/delete
  useEffect(() => {
    const unsubscribe = sessionStore.subscribe(() => {
      loadSequences()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !project) {
      router.push('/projects')
    }
  }, [project, isLoading, router])

  // Initialiser la première séquence sélectionnée quand les données changent
  useEffect(() => {
    if (sequences.length > 0 && !selectedSequence) {
      setSelectedSequence(sequences[0])
    }
  }, [sequences, selectedSequence])

  const handleEditSequence = (sequence: any) => {
    // Rediriger vers la page de création/modification avec l'ID de la séquence
    router.push(`/breakdown?edit=${sequence.id}`)
  }

  const handleDeleteSequence = (sequenceId: string) => {
    sessionStore.deleteSequence(sequenceId)
    loadSequences() // Recharger immédiatement
    
    // Si la séquence supprimée était sélectionnée, réinitialiser la sélection
    if (selectedSequence?.id === sequenceId) {
      const remainingSequences = sessionStore.getSequences()
      setSelectedSequence(remainingSequences.length > 0 ? remainingSequences[0] : null)
    }
  }

  const handleCreateSequence = () => {
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
                  onClick={loadSequences}
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
                  sequence={sequence}
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
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            {selectedSequence ? (
              <div className="space-y-6">
                {/* Header with sequence info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400 text-sm">{selectedSequence.code}</span>
                      <Badge>{selectedSequence.status}</Badge>
                      <Badge>{selectedSequence.type}</Badge>
                      <Badge>{selectedSequence.effet}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedSequence.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {selectedSequence.createdAt && new Date(selectedSequence.createdAt).toLocaleDateString('fr-FR')}
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

                {/* Tabs */}
                <div className="border-b border-gray-600">
                  <div className="flex space-x-8">
                    <button className="text-white border-b-2 border-white pb-2 text-sm font-medium">
                      Générale
                    </button>
                    <button className="text-gray-400 pb-2 text-sm">
                      Scènes associées
                    </button>
                  </div>
                </div>

                {/* Content sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Localisation :</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">{selectedSequence.location || 'Non défini'}</span>
                        <Badge>{selectedSequence.type}</Badge>
                        <Badge>{selectedSequence.effet}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">E.T.T. (hh:mm) :</h4>
                        <p className="text-blue-400 font-semibold">{selectedSequence.ett || 'Non défini'}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Pré-minutage (mm:ss) :</h4>
                        <p className="text-blue-400 font-semibold">{selectedSequence.preMintage || 'Non défini'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Résumé :</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedSequence.summary || 'Aucun résumé disponible'}
                      </p>
                    </div>

                    {/* Décors et scènes */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Décors :</h4>
                      <div className="space-y-2">
                        {sessionStore.getDecors(selectedSequence.id).map((decor) => (
                          <div key={decor.id} className="bg-gray-700 rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">{decor.title}</span>
                              <Badge>{decor.manoir}</Badge>
                            </div>
                            {decor.address && (
                              <p className="text-gray-400 text-xs mt-1">{decor.address}</p>
                            )}
                          </div>
                        ))}
                        {sessionStore.getDecors(selectedSequence.id).length === 0 && (
                          <p className="text-gray-400 text-sm">Aucun décor défini</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Scènes :</h4>
                      <div className="space-y-2">
                        {sessionStore.getScenes(selectedSequence.id).map((scene) => (
                          <div key={scene.id} className="bg-gray-700 rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Scène {scene.numero}</span>
                              <Badge>{scene.status}</Badge>
                            </div>
                            {scene.description && (
                              <p className="text-gray-400 text-xs mt-1">{scene.description}</p>
                            )}
                          </div>
                        ))}
                        {sessionStore.getScenes(selectedSequence.id).length === 0 && (
                          <p className="text-gray-400 text-sm">Aucune scène définie</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right column - Placeholder for future features */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-3">Équipe et Rôles</h4>
                      <div className="text-center text-gray-400 py-8">
                        <p>Fonctionnalité à venir</p>
                        <p className="text-sm mt-2">Gestion d'équipe, acteurs, costumes...</p>
                      </div>
                    </div>
                  </div>
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