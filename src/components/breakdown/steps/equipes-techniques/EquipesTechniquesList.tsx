'use client'

import { EquipeTechnique } from '@/lib/types-clean'
import { useEquipesTechniques } from '@/hooks/useEquipesTechniques'
import Button from '@/components/ui/Button'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface EquipesTechniquesListProps {
  sequenceId: string
  onCreateClick: () => void
  onEditClick: (equipe: EquipeTechnique) => void
}

export function EquipesTechniquesList({ sequenceId, onCreateClick, onEditClick }: EquipesTechniquesListProps) {
  const { equipesTechniques, deleteEquipeTechnique, loading } = useEquipesTechniques(sequenceId)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingIds, setDeletingIds] = useState<string[]>([])

  const handleDelete = async (equipeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe technique ?')) {
      setDeletingIds(prev => [...prev, equipeId])
      
      try {
        const success = await deleteEquipeTechnique(equipeId)
        if (success) {
          toast.success('Équipe technique supprimée avec succès')
        } else {
          toast.error('Erreur lors de la suppression de l\'équipe technique')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression de l\'équipe technique')
      } finally {
        setDeletingIds(prev => prev.filter(id => id !== equipeId))
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Ingénieur son':
        return 'bg-blue-600'
      case 'Opérateur confirmé':
        return 'bg-orange-600'
      case 'Assistant':
        return 'bg-gray-600'
      case 'Technicien':
        return 'bg-green-600'
      case 'Superviseur':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  const filteredEquipes = equipesTechniques.filter(equipe => 
    equipe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipe.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Liste de l'équipe technique de la Séquences</h3>
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
          placeholder="Search Roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {filteredEquipes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🎬</div>
          <p className="mb-4">
            {searchTerm ? 'Aucune équipe technique trouvée' : 'Pas d\'équipe technique assignée à cette scène.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEquipes.map((equipe) => (
            <div
              key={equipe.id}
              className="p-4 rounded-lg border border-gray-600 bg-gray-800 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">
                      Nom et Prénom: {equipe.prenom} {equipe.nom}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getTypeColor(equipe.type)}`}>
                      {equipe.type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-1">
                    <span className="text-gray-400">Séquences:</span> {equipe.sequences.join(', ')}
                  </div>
                  
                  {equipe.notes && (
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">Notes:</span> {equipe.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditClick(equipe)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(equipe.id)}
                    disabled={deletingIds.includes(equipe.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingIds.includes(equipe.id) ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
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