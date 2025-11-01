'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface CreateSequenceFormProps {
  onCancel: () => void
}

export default function CreateSequenceForm({ onCancel }: CreateSequenceFormProps) {
  const [formData, setFormData] = useState({
    code: 'SEQ-1',
    title: 'Confrontation dans la rue',
    colorId: 'blue', // Couleur d'identification
    status: 'A validé',
    location: '',
    summary: '',
    preMintage: '00:00',
    ett: '00:00',
    effet: 'JOUR',
    type: 'INT'
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const availableColors = [
    { id: 'blue', color: 'bg-blue-500', name: 'Bleu' },
    { id: 'green', color: 'bg-green-500', name: 'Vert' },
    { id: 'red', color: 'bg-red-500', name: 'Rouge' },
    { id: 'purple', color: 'bg-purple-500', name: 'Violet' },
    { id: 'orange', color: 'bg-orange-500', name: 'Orange' }
  ]

  const statusOptions = ['A validé', 'En attente', 'Validé', 'Reporté']
  const effetOptions = ['JOUR', 'NUIT']
  const typeOptions = ['INT', 'EXT']

  const handleColorChange = (colorId: string) => {
    setFormData(prev => ({ ...prev, colorId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-lg space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nouvelle Séquences</h2>
        <Button variant="secondary" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* Section Général */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500 rounded"></div>
          <h3 className="text-white font-medium">Général</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <p className="text-gray-400 text-sm">Complétez les informations de base de la séquence</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {showSuccess && (
        <div className="bg-green-800 text-green-100 p-3 rounded-lg mb-4">
          Séquence créée (mock) ✓
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre et Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Titre de la séquence <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
              Numéro de la séquences
            </label>
            <input
              id="code"
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Couleur d'identification */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Couleur d'identification
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorChange(color.id)}
                className={`w-12 h-8 rounded ${color.color} border-2 transition-all ${
                  formData.colorId === color.id ? 'border-white scale-110' : 'border-transparent hover:border-gray-400'
                }`}
                aria-label={`Couleur ${color.name}`}
              />
            ))}
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
            statut de la séquence
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Lieu de tournage */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Lieu de tournage
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Adresse ou nom du lieu..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Résumé */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">
            Résumé
          </label>
          <textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Description de la scène..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="preMintage" className="block text-sm font-medium text-gray-300 mb-1">
              Pré-minutage (mm:ss)
            </label>
            <input
              id="preMintage"
              type="text"
              value={formData.preMintage}
              onChange={(e) => setFormData(prev => ({ ...prev, preMintage: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="ett" className="block text-sm font-medium text-gray-300 mb-1">
              E.T.T. (hh:mm)
            </label>
            <input
              id="ett"
              type="text"
              value={formData.ett}
              onChange={(e) => setFormData(prev => ({ ...prev, ett: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="effet" className="block text-sm font-medium text-gray-300 mb-1">
              Effet
            </label>
            <select
              id="effet"
              value={formData.effet}
              onChange={(e) => setFormData(prev => ({ ...prev, effet: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {effetOptions.map(effet => (
                <option key={effet} value={effet}>{effet}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              I/E
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-600">
          <div className="flex items-center space-x-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Précédent
            </Button>
            <span className="text-gray-400 text-sm">1 of 3</span>
          </div>
          
          <Button type="submit" variant="default">
            Suivant
          </Button>
        </div>
      </form>
    </div>
  )
}