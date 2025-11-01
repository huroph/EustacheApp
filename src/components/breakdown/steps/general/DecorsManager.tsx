'use client'

import { useState } from 'react'
import { sessionStore, type Decor } from '@/lib/sessionData'

interface DecorsManagerProps {
  sequenceId: string
  decors: Decor[]
  onUpdate: () => void
}

export default function DecorsManager({ sequenceId, decors, onUpdate }: DecorsManagerProps) {
  const [isAddingDecor, setIsAddingDecor] = useState(false)
  const [newDecor, setNewDecor] = useState({ 
    title: '', 
    address: '', 
    manoir: 'Intérieur' as const, 
    status: 'A validé' as const 
  })

  const statusOptions = ['A validé', 'En attente', 'Validé', 'Reporté']
  const manoirOptions = ['Intérieur', 'Extérieur']

  const handleAddDecor = () => {
    if (!newDecor.title.trim()) return
    
    const created = sessionStore.createDecor(sequenceId, newDecor)
    if (created) {
      setNewDecor({ title: '', address: '', manoir: 'Intérieur', status: 'A validé' })
      setIsAddingDecor(false)
      onUpdate()
    }
  }

  const handleUpdateDecor = (decorId: string, field: string, value: string) => {
    sessionStore.updateDecor(sequenceId, decorId, { [field]: value })
    onUpdate()
  }

  const handleDeleteDecor = (decorId: string) => {
    if (confirm('Supprimer ce décor supprimera aussi toutes les scènes associées. Continuer ?')) {
      sessionStore.deleteDecor(sequenceId, decorId)
      onUpdate()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">Lieux de tournage ({decors.length})</h3>
        <button 
          onClick={() => setIsAddingDecor(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {isAddingDecor && (
        <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Nouveau décor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Titre *</label>
              <input
                type="text"
                value={newDecor.title}
                onChange={(e) => setNewDecor(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nom du décor..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Statut</label>
              <select
                value={newDecor.status}
                onChange={(e) => setNewDecor(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Adresse</label>
              <input
                type="text"
                value={newDecor.address}
                onChange={(e) => setNewDecor(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse du lieu..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={newDecor.manoir}
                onChange={(e) => setNewDecor(prev => ({ ...prev, manoir: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {manoirOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddDecor}
              disabled={!newDecor.title.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setIsAddingDecor(false)
                setNewDecor({ title: '', address: '', manoir: 'Intérieur', status: 'A validé' })
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {decors.map((decor) => (
          <div key={decor.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre</label>
                <input
                  type="text"
                  value={decor.title}
                  onChange={(e) => handleUpdateDecor(decor.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value={decor.status}
                  onChange={(e) => handleUpdateDecor(decor.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  onClick={() => handleDeleteDecor(decor.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Adresse</label>
              <input
                type="text"
                value={decor.address}
                onChange={(e) => handleUpdateDecor(decor.id, 'address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={decor.manoir}
                onChange={(e) => handleUpdateDecor(decor.id, 'manoir', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {manoirOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {decors.length === 0 && !isAddingDecor && (
          <div className="text-center py-8 text-gray-400">
            <p>Aucun décor ajouté</p>
            <button 
              onClick={() => setIsAddingDecor(true)}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              Ajouter le premier décor
            </button>
          </div>
        )}
      </div>
    </div>
  )
}