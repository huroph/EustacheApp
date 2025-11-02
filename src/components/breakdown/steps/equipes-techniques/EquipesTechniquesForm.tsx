'use client'

import { EquipeTechnique, SequenceFormData } from '@/lib/types-clean'
import { sessionStore } from '@/lib/sessionStore-mock'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'

interface EquipesTechniquesFormProps {
  equipe?: EquipeTechnique // Pour l'édition
  onCancel: () => void
  onSuccess: () => void
}

export function EquipesTechniquesForm({ equipe, onCancel, onSuccess }: EquipesTechniquesFormProps) {
  const [formData, setFormData] = useState<{
    nom: string
    prenom: string
    type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
    sequences: string[]
    notes: string
  }>({
    nom: '',
    prenom: '',
    type: 'Ingénieur son',
    sequences: [],
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableSequences, setAvailableSequences] = useState<SequenceFormData[]>([])

  useEffect(() => {
    // Charger les séquences disponibles
    const sequences = sessionStore.getSequences()
    setAvailableSequences(sequences)

    if (equipe) {
      setFormData({
        nom: equipe.nom,
        prenom: equipe.prenom,
        type: equipe.type,
        sequences: equipe.sequences,
        notes: equipe.notes
      })
    }
  }, [equipe])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }

    if (!formData.type) {
      newErrors.type = 'Le type est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsSubmitting(true)

    try {
      if (equipe) {
        // Modification
        sessionStore.updateEquipeTechnique(equipe.id, formData)
      } else {
        // Création
        sessionStore.createEquipeTechnique(formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const toggleSequence = (sequenceId: string) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.includes(sequenceId)
        ? prev.sequences.filter(id => id !== sequenceId)
        : [...prev.sequences, sequenceId]
    }))
  }

  return (
    <div className="space-y-6">
      

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-1">
            Nom *
          </label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.nom ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Nom de famille"
          />
          {errors.nom && <p className="text-red-400 text-sm mt-1">{errors.nom}</p>}
        </div>

        {/* Prénom */}
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-300 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            id="prenom"
            value={formData.prenom}
            onChange={(e) => handleChange('prenom', e.target.value)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.prenom ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Prénom"
          />
          {errors.prenom && <p className="text-red-400 text-sm mt-1">{errors.prenom}</p>}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
            Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as typeof formData.type)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            <option value="Ingénieur son">Ingénieur son</option>
            <option value="Opérateur confirmé">Opérateur confirmé</option>
            <option value="Assistant">Assistant</option>
            <option value="Technicien">Technicien</option>
            <option value="Superviseur">Superviseur</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
        </div>

        {/* Contacts */}
                {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Address"
          />
          {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
        </div>
        {/* mail */}
        <div>
          <label htmlFor="mail" className="block text-sm font-medium text-gray-300 mb-1">
            Mail *
          </label>
          <input
            type="text"
            id="mail"
            value={formData.mail}
            onChange={(e) => handleChange('mail', e.target.value)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.mail ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Mail"
          />
          {errors.mail && <p className="text-red-400 text-sm mt-1">{errors.mail}</p>}
        </div>
        {/* phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone *
          </label>
          <input
            type="text"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Phone"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>


        

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Notes supplémentaires..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="default"
            size="sm"
          >
            {isSubmitting ? 'Sauvegarde...' : (equipe ? 'Modifier' : 'Créer')}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            size="sm"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}