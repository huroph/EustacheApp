'use client'

import { useState } from 'react'
import { useDecors } from '@/hooks/useDecors'
import Button from '@/components/ui/Button'

interface SimpleDecorStepProps {
  sequenceId: string
}

export default function SimpleDecorStep({ sequenceId }: SimpleDecorStepProps) {
  const { decors, isLoading, createDecor, deleteDecor } = useDecors(sequenceId)
  const [isAdding, setIsAdding] = useState(false)
  const [newDecorTitle, setNewDecorTitle] = useState('')

  const handleAdd = async () => {
    if (!newDecorTitle.trim()) return
    
    try {
      await createDecor({
        sequence_id: sequenceId,
        title: newDecorTitle.trim(),
        location_type: 'Intérieur'
      })
      setNewDecorTitle('')
      setIsAdding(false)
    } catch (error) {
      console.error('Erreur création décor:', error)
    }
  }

  const handleDelete = async (decorId: string) => {
    if (confirm('Supprimer ce décor ?')) {
      try {
        await deleteDecor(decorId)
      } catch (error) {
        console.error('Erreur suppression décor:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-gray-400">Chargement des décors...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Décors ({decors.length})</h3>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            size="sm"
          >
            + Ajouter
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-3">
          <input
            type="text"
            value={newDecorTitle}
            onChange={(e) => setNewDecorTitle(e.target.value)}
            placeholder="Titre du décor"
            className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm">
              Créer
            </Button>
            <Button 
              onClick={() => {
                setIsAdding(false)
                setNewDecorTitle('')
              }}
              variant="secondary"
              size="sm"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {decors.map((decor) => (
          <div 
            key={decor.id}
            className="bg-gray-800 p-3 rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="text-white font-medium">{decor.title}</div>
              <div className="text-gray-400 text-sm">
                {decor.location_type} • {decor.status}
                {decor.address && ` • ${decor.address}`}
              </div>
            </div>
            <Button
              onClick={() => handleDelete(decor.id)}
              variant="secondary"
              size="sm"
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      {decors.length === 0 && !isAdding && (
        <div className="text-gray-400 text-center py-4">
          Aucun décor créé pour cette séquence
        </div>
      )}
    </div>
  )
}