// src/app/(app)/sequences/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'
import SequenceCard from '@/components/sequences/SequenceCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

// Mock sequences data
const sequences = [
  {
    id: 'seq-1',
    code: 'SEQ-1',
    tags: ['EXT', 'JOUR'],
    title: 'Confrontation dans le manoir',
    time: '1h30',
    summary:
      "Une rue commerçante. Passants, vélos, poussettes. Un MIMÉE (mime) statue vivante. Un CHIEN renifle une borne de parking. Des panneaux incompréhensibles...",
    roles: ['Acteurs', 'Equipe', 'Silhouette'],
  },
  {
    id: 'seq-2',
    code: 'SEQ-2',
    tags: ['INT', 'NUIT'],
    title: 'Discussion secrète',
    time: '45min',
    summary:
      "Dans un bureau sombre, deux personnages se rencontrent pour échanger des informations cruciales. L'atmosphère est tendue...",
    roles: ['Acteurs', 'Equipe'],
  },
  {
    id: 'seq-3',
    code: 'SEQ-3',
    tags: ['EXT', 'NUIT'],
    title: 'Poursuite nocturne',
    time: '2h15',
    summary:
      "Une course-poursuite effrénée dans les rues de la ville. Voitures, motos, et action pure...",
    roles: ['Acteurs', 'Equipe', 'Cascadeurs', 'Silhouette'],
  },
]

export default function SequencesPage() {
  const router = useRouter()
  const { project, isLoading } = useCurrentProject()
  const [selectedSequence, setSelectedSequence] = useState(sequences[0])

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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Badge>👑</Badge>
            <h1 className="text-2xl font-bold text-white">Séquences</h1>
            <span className="text-gray-400">{project.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sequences list (left side) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Séquences</h2>
              <div className="flex items-center space-x-2">
                <select className="bg-gray-800 text-white text-sm rounded px-3 py-1 border border-gray-600">
                  <option>All</option>
                  <option>EXT</option>
                  <option>INT</option>
                </select>
                <select className="bg-gray-800 text-white text-sm rounded px-3 py-1 border border-gray-600">
                  <option>Recent</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">3 resultat</p>

            <div className="space-y-3">
              {/* Repeat the sequence 3 times with slight variations */}
              {[...Array(3)].map((_, index) => (
                <SequenceCard
                  key={`seq-${index}`}
                  sequence={{
                    ...sequences[0],
                    id: `seq-${index + 1}`,
                    code: `SEQ-${index + 1}`,
                  }}
                  onClick={() => setSelectedSequence(sequences[0])}
                  isSelected={selectedSequence?.id === sequences[0].id}
                />
              ))}
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
                      <span className="text-yellow-400 text-sm">Seq.1</span>
                      <Badge>À préparer</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Confrontation dans le manoire
                    </h2>
                    <p className="text-gray-400 text-sm">20/8/25</p>
                  </div>
                  <Button variant="outline" size="sm">
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
                      <h4 className="text-white font-medium mb-2">Décor :</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">Manoir Dubois - Salon principal</span>
                        <Badge>INT</Badge>
                        <Badge>JOUR</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Lieux de tournages :</h4>
                      <p className="text-gray-300 text-sm">
                        12 Impasse Bompard, 13100 MARSEILLE
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">E.T.T. (hh:mm) :</h4>
                        <p className="text-blue-400 font-semibold">1h20</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Pré-minutage (mm:ss) :</h4>
                        <p className="text-blue-400 font-semibold">1:20 min</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Résumé :</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Une rue commerçante. Passants, vélos, poussettes. Un MIMÉE (mime) statue vivante. 
                        Un CHIEN renifle une borne de parking. Des panneaux incompréhensibles... p...
                      </p>
                    </div>
                  </div>

                  {/* Right column - Team sections */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-3">Equipe et Roles</h4>
                      
                      <div className="bg-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">👤</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">Fumée atmosphérique</p>
                            <p className="text-gray-400 text-sm">Machine Hazer</p>
                          </div>
                        </div>
                      </div>

                      {/* Role tabs */}
                      <div className="flex space-x-4 mb-4">
                        {['Acteurs', 'Silhouette / Figu', 'Equipe', 'Autres'].map((role) => (
                          <button
                            key={role}
                            className="text-gray-400 text-sm hover:text-white"
                          >
                            {role}
                          </button>
                        ))}
                      </div>

                      <div className="flex space-x-4 mb-4">
                        {['Costumes', 'Accessoires', 'Equipe', 'Note'].map((category) => (
                          <button
                            key={category}
                            className="text-gray-400 text-sm hover:text-white"
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        + Ajouter
                      </Button>
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