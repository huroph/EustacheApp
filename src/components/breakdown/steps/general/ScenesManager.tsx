'use client'

import { useState } from 'react'
import { sessionStore, type Scene, type Decor } from '@/lib/sessionData'

interface ScenesManagerProps {
  sequenceId: string
  scenes: Scene[]
  decors: Decor[]
  onUpdate: () => void
}

export default function ScenesManager({ sequenceId, scenes, decors, onUpdate }: ScenesManagerProps) {
  const [isAddingScene, setIsAddingScene] = useState(false)
  const [newScene, setNewScene] = useState({ 
    numero: '', 
    decorId: '', 
    description: '', 
    status: 'A validé' as const 
  })

  const statusOptions = ['A validé', 'En attente', 'Validé', 'Reporté']

  const handleAddScene = () => {
    if (!newScene.numero.trim() || !newScene.decorId) return
    
    const created = sessionStore.createScene(sequenceId, newScene)
    if (created) {
      setNewScene({ numero: '', decorId: '', description: '', status: 'A validé' })
      setIsAddingScene(false)
      onUpdate()
    }
  }

  const handleUpdateScene = (sceneId: string, field: string, value: string) => {
    sessionStore.updateScene(sequenceId, sceneId, { [field]: value })
    onUpdate()
  }

  const handleDeleteScene = (sceneId: string) => {
    if (confirm('Supprimer cette scène ?')) {
      sessionStore.deleteScene(sequenceId, sceneId)
      onUpdate()
    }
  }

  const getDecorTitle = (decorId: string) => {
    const decor = decors.find(d => d.id === decorId)
    return decor ? decor.title : 'Décor supprimé'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">Scènes ({scenes.length})</h3>
        <button 
          onClick={() => setIsAddingScene(true)}
          disabled={decors.length === 0}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      {decors.length === 0 && (
        <div className="bg-orange-600/20 border border-orange-500 rounded-lg p-4">
          <p className="text-orange-300 text-sm">
            Ajoutez d'abord des décors pour pouvoir créer des scènes.
          </p>
        </div>
      )}

      {/* Formulaire d'ajout */}
      {isAddingScene && (
        <div className="bg-slate-700 border-2 border-purple-500 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Nouvelle scène</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Numéro *</label>
              <input
                type="text"
                value={newScene.numero}
                onChange={(e) => setNewScene(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="Numéro de la scène..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Décor *</label>
              <select
                value={newScene.decorId}
                onChange={(e) => setNewScene(prev => ({ ...prev, decorId: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                <option value="">Sélectionner un décor</option>
                {decors.map(decor => (
                  <option key={decor.id} value={decor.id}>{decor.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={newScene.description}
              onChange={(e) => setNewScene(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la scène..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Statut</label>
            <select
              value={newScene.status}
              onChange={(e) => setNewScene(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddScene}
              disabled={!newScene.numero.trim() || !newScene.decorId}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setIsAddingScene(false)
                setNewScene({ numero: '', decorId: '', description: '', status: 'A validé' })
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scenes.map((scene) => (
          <div key={scene.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Numéro</label>
                <input
                  type="text"
                  value={scene.numero}
                  onChange={(e) => handleUpdateScene(scene.id, 'numero', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Décor</label>
                <select
                  value={scene.decorId}
                  onChange={(e) => handleUpdateScene(scene.id, 'decorId', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {decors.map(decor => (
                    <option key={decor.id} value={decor.id}>{decor.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  onClick={() => handleDeleteScene(scene.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={scene.description || ''}
                  onChange={(e) => handleUpdateScene(scene.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value={scene.status}
                  onChange={(e) => handleUpdateScene(scene.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Décor: {getDecorTitle(scene.decorId)}
            </div>
          </div>
        ))}

        {scenes.length === 0 && !isAddingScene && decors.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune scène ajoutée</p>
            <button 
              onClick={() => setIsAddingScene(true)}
              className="mt-2 text-purple-400 hover:text-purple-300"
            >
              Ajouter la première scène
            </button>
          </div>
        )}
      </div>
    </div>
  )
}