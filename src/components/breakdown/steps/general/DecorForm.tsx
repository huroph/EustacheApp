'use client'

import { useState, useEffect, useRef } from 'react'
import { Decor } from '@/lib/sessionData'

interface DecorFormProps {
  decor?: Decor | null
  onSave: (decorData: Omit<Decor, 'id' | 'createdAt'>) => void
  onCancel: () => void
  submitTrigger?: number
}

export default function DecorForm({ decor, onSave, onCancel, submitTrigger }: DecorFormProps) {
  const [formData, setFormData] = useState<Omit<Decor, 'id' | 'createdAt'>>({
    title: '',
    address: '',
    manoir: 'Intérieur',
    status: 'A validé'
  })

  const statusOptions = ['A validé', 'En attente', 'Validé', 'Reporté']
  const manoirOptions = ['Intérieur', 'Extérieur']

  // Charger les données du décor en mode édition
  useEffect(() => {
    if (decor) {
      setFormData({
        title: decor.title,
        address: decor.address,
        manoir: decor.manoir,
        status: decor.status
      })
    } else {
      // Reset pour nouveau décor
      setFormData({
        title: '',
        address: '',
        manoir: 'Intérieur',
        status: 'A validé'
      })
    }
  }, [decor])

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
          {decor ? 'Modifier le décor' : 'Créer un Décor'}
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
        {/* Titre et Statut */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Titre du décor</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              placeholder="Nom du décor"
              required
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

        {/* Type et Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Type</label>
            <select
              value={formData.manoir}
              onChange={(e) => updateField('manoir', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            >
              {manoirOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              placeholder="Adresse du lieu de tournage"
            />
          </div>
        </div>
      </div>
    </form>
  )
}