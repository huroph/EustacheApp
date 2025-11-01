'use client'

import { sessionStore, EffetSpecial } from '@/lib/sessionData'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'

interface EffetsSpeciauxFormProps {
  sequenceId: string
  effet?: EffetSpecial // Pour l'édition
  onCancel: () => void
  onSuccess: () => void
}

export function EffetsSpeciauxForm({ sequenceId, effet, onCancel, onSuccess }: EffetsSpeciauxFormProps) {
  const [formData, setFormData] = useState<{
    nom: string
    statut: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
    description: string
  }>({
    nom: '',
    statut: 'En attente',
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (effet) {
      setFormData({
        nom: effet.nom,
        statut: effet.statut,
        description: effet.description
      })
    }
  }, [effet])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nom.trim()) {
      alert('Le nom est requis')
      return
    }

    setIsSubmitting(true)

    try {
      if (effet) {
        // Modification
        sessionStore.updateEffetSpecial(sequenceId, effet.id, formData)
      } else {
        // Création
        sessionStore.createEffetSpecial(sequenceId, formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'statut' ? value as typeof formData.statut : value 
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">
          {effet ? 'Modifier l\'effet spécial' : 'Créer un Effet Spécial'}
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCancel}
        >
          ← Retour
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-white mb-2">
            Nom de l'effet spécial *
          </label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={(e) => updateField('nom', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Explosion, Fumée, Pluie artificielle..."
            required
          />
        </div>

        <div>
          <label htmlFor="statut" className="block text-sm font-medium text-white mb-2">
            Statut *
          </label>
          <select
            id="statut"
            value={formData.statut}
            onChange={(e) => updateField('statut', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="En attente">En attente</option>
            <option value="A validé">A validé</option>
            <option value="Validé">Validé</option>
            <option value="Reporté">Reporté</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description détaillée de l'effet spécial..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sauvegarde...' : (effet ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  )
}