'use client'

import { sessionStore, EffetSpecial } from '@/lib/sessionData'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'

interface EffetsSpeciauxListProps {
  sequenceId: string
  onCreateClick: () => void
  onEditClick: (effet: EffetSpecial) => void
}

export function EffetsSpeciauxList({ sequenceId, onCreateClick, onEditClick }: EffetsSpeciauxListProps) {
  const [effets, setEffets] = useState<EffetSpecial[]>([])

  useEffect(() => {
    // Charger les effets spéciaux de la séquence
    const loadEffets = () => {
      const effetsData = sessionStore.getEffetsSpeciaux(sequenceId)
      setEffets(effetsData)
    }

    loadEffets()

    // S'abonner aux changements
    const unsubscribe = sessionStore.subscribe(() => {
      loadEffets()
    })

    return unsubscribe
  }, [sequenceId])

  const handleDelete = (effeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet effet spécial ?')) {
      sessionStore.deleteEffetSpecial(sequenceId, effeId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Liste des Effets Spéciaux de la Séquence</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateClick}
        >
          + Ajouter
        </Button>
      </div>

      {effets.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">✨</div>
          <p className="mb-4">Pas d'effet spécial assigné à cette séquence</p>
        </div>
      ) : (
        <div className="space-y-2">
          {effets.map((effet) => (
            <div
              key={effet.id}
              className="p-4 rounded-lg border border-gray-600 bg-gray-800 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{effet.nom}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      effet.statut === 'A validé' ? 'bg-green-600' : 
                      effet.statut === 'Validé' ? 'bg-blue-600' : 
                      effet.statut === 'En attente' ? 'bg-yellow-600' : 
                      effet.statut === 'Reporté' ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {effet.statut}
                    </span>
                  </div>
                  {effet.description && (
                    <div className="text-gray-400 text-sm">
                      {effet.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditClick(effet)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(effet.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}