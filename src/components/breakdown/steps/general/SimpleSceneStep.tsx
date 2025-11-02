'use client'

import { useState } from 'react'
import { useScenes } from '@/hooks/useScenes'
import { useDecors } from '@/hooks/useDecors'
import Button from '@/components/ui/Button'

interface SimpleSceneStepProps {
  sequenceId: string
}

export default function SimpleSceneStep({ sequenceId }: SimpleSceneStepProps) {
  const { scenes, isLoading: scenesLoading, createScene, deleteScene } = useScenes(sequenceId)
  const { decors, isLoading: decorsLoading } = useDecors(sequenceId)
  const [isAdding, setIsAdding] = useState(false)
  const [newSceneData, setNewSceneData] = useState({
    numero: '',
    decor_id: '',
    description: ''
  })

  const handleAdd = async () => {
    if (!newSceneData.numero.trim()) return
    
    try {
      await createScene({
        sequence_id: sequenceId,
        numero: newSceneData.numero.trim(),
        decor_id: newSceneData.decor_id || null,
        description: newSceneData.description || null
      })
      setNewSceneData({ numero: '', decor_id: '', description: '' })
      setIsAdding(false)
    } catch (error) {
      console.error('Erreur création scène:', error)
    }
  }

  const handleDelete = async (sceneId: string) => {
    if (confirm('Supprimer cette scène ?')) {
      try {
        await deleteScene(sceneId)
      } catch (error) {
        console.error('Erreur suppression scène:', error)
      }
    }
  }

  if (scenesLoading || decorsLoading) {
    return <div className="text-gray-400">Chargement des scènes...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Scènes ({scenes.length})</h3>
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
            value={newSceneData.numero}
            onChange={(e) => setNewSceneData(prev => ({ ...prev, numero: e.target.value }))}
            placeholder="Numéro de scène (ex: 1, 2A, 15bis)"
            className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            autoFocus
          />
          
          <select
            value={newSceneData.decor_id}
            onChange={(e) => setNewSceneData(prev => ({ ...prev, decor_id: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Choisir un décor (optionnel)</option>
            {decors.map((decor) => (
              <option key={decor.id} value={decor.id}>
                {decor.title}
              </option>
            ))}
          </select>

          <textarea
            value={newSceneData.description}
            onChange={(e) => setNewSceneData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de la scène (optionnel)"
            className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            rows={2}
          />
          
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm">
              Créer
            </Button>
            <Button 
              onClick={() => {
                setIsAdding(false)
                setNewSceneData({ numero: '', decor_id: '', description: '' })
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
        {scenes.map((scene) => {
          const sceneDecor = decors.find(d => d.id === scene.decor_id)
          return (
            <div 
              key={scene.id}
              className="bg-gray-800 p-3 rounded-lg flex items-center justify-between"
            >
              <div>
                <div className="text-white font-medium">Scène {scene.numero}</div>
                <div className="text-gray-400 text-sm">
                  {sceneDecor ? `Décor: ${sceneDecor.title}` : 'Aucun décor'}
                  {scene.status && ` • ${scene.status}`}
                  {scene.duree_estimee && ` • ${scene.duree_estimee}`}
                </div>
                {scene.description && (
                  <div className="text-gray-300 text-sm mt-1">{scene.description}</div>
                )}
              </div>
              <Button
                onClick={() => handleDelete(scene.id)}
                variant="secondary"
                size="sm"
              >
                ✕
              </Button>
            </div>
          )
        })}
      </div>

      {scenes.length === 0 && !isAdding && (
        <div className="text-gray-400 text-center py-4">
          Aucune scène créée pour cette séquence
        </div>
      )}
    </div>
  )
}