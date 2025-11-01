'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface CreateSequenceFormProps {
  onCancel: () => void
}

export default function CreateSequenceForm({ onCancel }: CreateSequenceFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    tags: [] as string[],
    time: '',
    location: '',
    summary: '',
    roles: [] as string[]
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const availableTags = ['EXT', 'INT', 'JOUR', 'NUIT']
  const availableRoles = ['Acteurs', 'Équipe', 'Silhouette']

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-lg space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Créer une séquence</h2>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>

      {showSuccess && (
        <div className="bg-green-800 text-green-100 p-3 rounded-lg mb-4">
          Séquence créée (mock) ✓
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
            Code *
          </label>
          <input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="SEQ-12"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Titre *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Confrontation dans la rue"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
                aria-pressed={formData.tags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
            Durée / Time
          </label>
          <input
            id="time"
            type="text"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            placeholder="1h30"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lieu */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Lieu
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Rue piétonne animée"
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
            placeholder="Description courte de la séquence..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Équipe / Rôles */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Équipe / Rôles
          </label>
          <div className="space-y-2">
            {availableRoles.map(role => (
              <label key={role} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300 text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="default" className="flex-1">
            Enregistrer (mock)
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}