'use client'

import { Machinerie, EquipeTechnique } from '@/lib/types-clean'
import Button from '@/components/ui/Button'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useMachinerie } from '@/hooks/useMachinerie'
import { useEquipesTechniques } from '@/hooks/useEquipesTechniques'
import toast from 'react-hot-toast'

interface MachinerieFormProps {
  sequenceId: string
  machinerie?: Machinerie // Pour l'édition
  onCancel: () => void
  onSuccess: () => void
}

export interface MachinerieFormRef {
  submitForm: () => Promise<void>
}

export const MachinerieForm = forwardRef<MachinerieFormRef, MachinerieFormProps>(
  ({ sequenceId, machinerie, onCancel, onSuccess }, ref) => {
    const [formData, setFormData] = useState<{
      nom: string
      statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
      referentId: string
      notes: string
    }>({
      nom: '',
      statut: 'En attente',
      referentId: '',
      notes: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    
    const { createMachinerie, updateMachinerie } = useMachinerie(sequenceId)
    const { equipesTechniques } = useEquipesTechniques(sequenceId)

    useEffect(() => {
      if (machinerie) {
        setFormData({
          nom: machinerie.nom,
          statut: machinerie.statut,
          referentId: machinerie.referentId,
          notes: machinerie.notes
        })
      } else if (equipesTechniques.length > 0) {
        // Prendre la première équipe par défaut si pas d'édition
        setFormData(prev => ({ ...prev, referentId: equipesTechniques[0].id }))
      }
    }, [machinerie, equipesTechniques])

    const validate = () => {
      const newErrors: Record<string, string> = {}

      if (!formData.nom.trim()) {
        newErrors.nom = 'Le nom de la machinerie est requis'
      }

      if (!formData.statut) {
        newErrors.statut = 'Le statut est requis'
      }

      if (!formData.referentId) {
        newErrors.referentId = 'Le référent est requis'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const submitForm = async () => {
      if (!validate()) return
      
      setIsSubmitting(true)

      try {
        if (machinerie) {
          // Modification
          const success = await updateMachinerie(machinerie.id, formData)
          if (success) {
            toast.success('Machinerie modifiée avec succès', {
              style: { background: '#374151', color: '#ffffff' }
            })
            onSuccess()
          } else {
            toast.error('Erreur lors de la modification', {
              style: { background: '#374151', color: '#ffffff' }
            })
          }
        } else {
          // Création
          const newMachinerie = await createMachinerie({
            sequence_id: sequenceId,
            nom: formData.nom,
            statut: formData.statut,
            referent_id: formData.referentId,
            notes: formData.notes
          })
          
          if (newMachinerie) {
            toast.success('Machinerie créée avec succès', {
              style: { background: '#374151', color: '#ffffff' }
            })
            onSuccess()
          } else {
            toast.error('Erreur lors de la création', {
              style: { background: '#374151', color: '#ffffff' }
            })
          }
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        toast.error('Erreur lors de la sauvegarde', {
          style: { background: '#374151', color: '#ffffff' }
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    // Exposer la méthode submitForm via ref
    useImperativeHandle(ref, () => ({
      submitForm
    }))

    const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      // Effacer l'erreur quand l'utilisateur commence à taper
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

    const getReferentName = (referentId: string) => {
      const equipe = equipesTechniques.find(e => e.id === referentId)
      return equipe ? `${equipe.prenom} ${equipe.nom}` : ''
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">
            {machinerie ? 'Modifier la machinerie' : 'Nouvelle machinerie'}
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            ← Retour à la liste
          </Button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Nom de la machinerie */}
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-400 mb-1">
              Nom de la machinerie *
            </label>
            <input
              type="text"
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ex: Caméra RED, Steadicam, Drone..."
            />
            {errors.nom && <p className="text-red-400 text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Statut demandé */}
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-400 mb-1">
              Statut demandé *
            </label>
            <select
              id="statut"
              value={formData.statut}
              onChange={(e) => handleChange('statut', e.target.value as typeof formData.statut)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 ${
                errors.statut ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="A validé">A validé</option>
              <option value="En attente">En attente</option>
              <option value="Validé">Validé</option>
              <option value="Reporté">Reporté</option>
            </select>
            {errors.statut && <p className="text-red-400 text-sm mt-1">{errors.statut}</p>}
          </div>

          {/* Référent */}
          <div>
            <label htmlFor="referentId" className="block text-sm font-medium text-gray-400 mb-1">
              Référent *
            </label>
            <select
              id="referentId"
              value={formData.referentId}
              onChange={(e) => handleChange('referentId', e.target.value)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 ${
                errors.referentId ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Sélectionner un référent</option>
              {equipesTechniques.map((equipe) => (
                <option key={equipe.id} value={equipe.id}>
                  {equipe.prenom} {equipe.nom} ({equipe.type})
                </option>
              ))}
            </select>
            {errors.referentId && <p className="text-red-400 text-sm mt-1">{errors.referentId}</p>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
              Notes sur la machinerie
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Notes supplémentaires sur la machinerie..."
            />
          </div>
        </form>
      </div>
    )
  }
)

MachinerieForm.displayName = 'MachinerieForm'
