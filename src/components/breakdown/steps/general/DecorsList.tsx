'use client'

import { Decor } from '@/lib/sessionData'
import Button from '@/components/ui/Button'

interface DecorsListProps {
  decors: Decor[]
  onCreateDecor: () => void
  onEditDecor: (decor: Decor) => void
  onDeleteDecor: (decorId: string) => void
}

export default function DecorsList({
  decors,
  onCreateDecor,
  onEditDecor,
  onDeleteDecor
}: DecorsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Liste des Décors de la Séquence</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateDecor}
        >
          + Ajouter
        </Button>
      </div>

      {decors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🏢</div>
          <p className="mb-4">Aucun décor ajouté pour cette séquence</p>
        </div>
      ) : (
        <div className="space-y-2">
          {decors.map((decor) => (
            <div
              key={decor.id}
              className="p-4 rounded-lg border border-gray-600 bg-gray-800 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{decor.title}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      decor.status === 'Validé' ? 'bg-green-600' : 
                      decor.status === 'En attente' ? 'bg-yellow-600' : 
                      decor.status === 'Reporté' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {decor.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      decor.manoir === 'Intérieur' ? 'bg-purple-600' : 'bg-orange-600'
                    }`}>
                      {decor.manoir}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {decor.address && <span>{decor.address}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditDecor(decor)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer ce décor ?')) {
                        onDeleteDecor(decor.id)
                      }
                    }}
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