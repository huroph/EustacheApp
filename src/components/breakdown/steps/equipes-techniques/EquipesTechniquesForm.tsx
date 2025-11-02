'use client'

import { EquipeTechnique } from '@/lib/types-clean'
import { useEquipesTechniques } from '@/hooks/useEquipesTechniques'
import Button from '@/components/ui/Button'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import toast from 'react-hot-toast'

interface EquipesTechniquesFormProps {
  sequenceId: string
  equipe?: EquipeTechnique
  onCancel: () => void
  onSuccess: () => void
}

export interface EquipesTechniquesFormRef {
  submitForm: () => void
}

export const EquipesTechniquesForm = forwardRef<EquipesTechniquesFormRef, EquipesTechniquesFormProps>(function EquipesTechniquesForm({ sequenceId, equipe, onCancel, onSuccess }, ref) {
  const { createEquipeTechnique, updateEquipeTechnique } = useEquipesTechniques(sequenceId)
  
  const [formData, setFormData] = useState<{
    nom: string
    prenom: string
    type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
    notes: string
  }>({
    nom: '',
    prenom: '',
    type: 'Ingénieur son',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (equipe) {
      setFormData({
        nom: equipe.nom,
        prenom: equipe.prenom,
        type: equipe.type,
        notes: equipe.notes
      })
    }
  }, [equipe])

  const submitForm = async () => {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      toast.error('Le nom et le prénom sont requis')
      return
    }

    setIsSubmitting(true)

    try {
      if (equipe) {
        await updateEquipeTechnique(equipe.id, formData)
        toast.success('Équipe technique modifiée avec succès')
      } else {
        await createEquipeTechnique({
          sequence_id: sequenceId,
          ...formData
        })
        toast.success('Équipe technique créée avec succès')
      }
      onSuccess()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  useImperativeHandle(ref, () => ({
    submitForm
  }), [formData, sequenceId, equipe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitForm()
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'type' ? value as typeof formData.type : value 
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-white mb-2">
            Nom *
          </label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={(e) => updateField('nom', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom de famille"
            required
          />
        </div>

        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-white mb-2">
            Prénom *
          </label>
          <input
            type="text"
            id="prenom"
            value={formData.prenom}
            onChange={(e) => updateField('prenom', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prénom"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
            Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Ingénieur son">Ingénieur son</option>
            <option value="Opérateur confirmé">Opérateur confirmé</option>
            <option value="Assistant">Assistant</option>
            <option value="Technicien">Technicien</option>
            <option value="Superviseur">Superviseur</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Notes supplémentaires..."
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
          {isSubmitting ? 'Sauvegarde...' : (equipe ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  )
})
