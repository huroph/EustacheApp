'use client'

import { sessionStore, Machinerie } from '@/lib/sessionData'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'

interface MachinerieListProps {
  sequenceId: string
  onCreateClick: () => void
  onEditClick: (machinerie: Machinerie) => void
}

export function MachinerieList({ sequenceId, onCreateClick, onEditClick }: MachinerieListProps) {
  const [machineries, setMachineries] = useState<Machinerie[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Charger les machineries de la séquence
    const loadMachineries = () => {
      const machineriesData = sessionStore.getMachineries(sequenceId)
      setMachineries(machineriesData)
    }

    loadMachineries()

    // S'abonner aux changements
    const unsubscribe = sessionStore.subscribe(() => {
      loadMachineries()
    })

    return unsubscribe
  }, [sequenceId])

  const handleDelete = (machinerieId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette machinerie ?')) {
      sessionStore.deleteMachinerie(sequenceId, machinerieId)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'A validé':
        return 'bg-green-600'
      case 'En attente':
        return 'bg-yellow-600'
      case 'Validé':
        return 'bg-blue-600'
      case 'Reporté':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getReferentName = (referentId: string) => {
    const equipe = sessionStore.getEquipeTechnique(referentId)
    return equipe ? `${equipe.prenom} ${equipe.nom}` : 'Référent inconnu'
  }

  const filteredMachineries = machineries.filter(machinerie => 
    machinerie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getReferentName(machinerie.referentId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Liste de la machinerie de la Séquences</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateClick}
        >
          + Ajouter
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Accessoire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {filteredMachineries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🎬</div>
          <p className="mb-4">Pas de machinerie assignée à cette séquences.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMachineries.map((machinerie) => (
            <div
              key={machinerie.id}
              className="p-4 rounded-lg border border-gray-600 bg-gray-800 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">Costume: {machinerie.nom}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(machinerie.statut)}`}>
                      {machinerie.statut}
                    </span>
                  </div>
                  
                  <div className="text-gray-400 text-sm mb-1">
                    Référent: {getReferentName(machinerie.referentId)} <span className="text-blue-400">●</span>
                  </div>
                  
                  {machinerie.notes && (
                    <div className="text-gray-400 text-sm mb-1">
                      Notes: {machinerie.notes}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Séquences: 1, 5-8, 12
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditClick(machinerie)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(machinerie.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}