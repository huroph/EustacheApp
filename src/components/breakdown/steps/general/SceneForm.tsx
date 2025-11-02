'use client'

import { useState, useEffect, useRef } from 'react'
import { Scene, Decor } from '@/lib/types-clean'

interface SceneFormProps {
  scene?: Scene | null
  decors: Decor[]
  onSave: (sceneData: Omit<Scene, 'id' | 'createdAt'>) => void
  onCancel: () => void
  submitTrigger?: number
}

export default function SceneForm({ scene, decors, onSave, onCancel, submitTrigger }: SceneFormProps) {
  const [formData, setFormData] = useState<Omit<Scene, 'id' | 'createdAt'>>({
    numero: '',
    decorId: '',
    description: '',
    status: 'A validé'
  })

  const statusOptions = ['A validé', 'En attente', 'Validé', 'Reporté']

  // Charger les données de la scène en mode édition
  useEffect(() => {
    if (scene) {
      setFormData({
        numero: scene.numero,
        decorId: scene.decorId,
        description: scene.description,
        status: scene.status
      })
    } else {
      // Reset pour nouvelle scène
      setFormData({
        numero: '',
        decorId: '',
        description: '',
        status: 'A validé'
      })
    }
  }, [scene])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Déclencher le submit quand submitTrigger change
  const prevSubmitTrigger = useRef(submitTrigger)
  useEffect(() => {
    if (submitTrigger && submitTrigger !== prevSubmitTrigger.current) {
      prevSubmitTrigger.current = submitTrigger
      onSave(formData)
    }
  }, [submitTrigger, formData, onSave])

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">
          {scene ? 'Modifier la scène' : 'Créer une Scène'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Numéro et Décor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Numéro de scène</label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => updateField('numero', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              placeholder="Ex: 1, 2A, 3B..."
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Décor</label>
            <select
              value={formData.decorId}
              onChange={(e) => updateField('decorId', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              required
            >
              <option value="">Sélectionner un décor</option>
              {decors.map(decor => (
                <option key={decor.id} value={decor.id}>{decor.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description et Statut */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={3}
            placeholder="Description de la scène..."
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Statut</label>
          <select
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
    </form>
  )
}