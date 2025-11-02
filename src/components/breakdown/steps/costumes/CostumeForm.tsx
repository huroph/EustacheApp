'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Costume, Role } from '@/lib/types-clean'
import Button from '@/components/ui/Button'

interface CostumeFormProps {
  costume?: Costume | null
  roles: Role[] // Liste des rôles disponibles pour le dropdown
  onSave: (costumeData: Omit<Costume, 'id' | 'createdAt'>) => void
  onCancel: () => void
  submitTrigger?: number
}

export interface CostumeFormRef {
  submitForm: () => void
}

const CostumeForm = forwardRef<CostumeFormRef, CostumeFormProps>(({ costume, roles, onSave, onCancel, submitTrigger }, ref) => {
  const [formData, setFormData] = useState<Omit<Costume, 'id' | 'createdAt'>>({
    nomCostume: '',
    roleId: '',
    statut: 'A validé',
    notesCostume: ''
  })

  // Charger les données du costume en mode édition
  useEffect(() => {
    if (costume) {
      setFormData({
        nomCostume: costume.nomCostume,
        roleId: costume.roleId || '',
        statut: costume.statut,
        notesCostume: costume.notesCostume
      })
    } else {
      // Reset pour nouveau costume
      setFormData({
        nomCostume: '',
        roleId: '',
        statut: 'A validé',
        notesCostume: ''
      })
    }
  }, [costume])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSave({
      ...formData,
      roleId: formData.roleId || undefined // Convertir string vide en undefined
    })
  }

  // Exposer la méthode submitForm via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit()
  }))

  // Déclencher le submit quand submitTrigger change
  const prevSubmitTrigger = useRef(submitTrigger)
  useEffect(() => {
    if (submitTrigger && submitTrigger !== prevSubmitTrigger.current) {
      prevSubmitTrigger.current = submitTrigger
      onSave({
        ...formData,
        roleId: formData.roleId || undefined
      })
    }
  }, [submitTrigger, formData, onSave])

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">
          {costume ? 'Modifier le costume' : 'Créer un Costumes'}
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
        <div>
          <label className="block text-gray-300 text-sm mb-1">Nom du costume</label>
          <input
            type="text"
            value={formData.nomCostume}
            onChange={(e) => updateField('nomCostume', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            placeholder="Robe noire"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Pour</label>
            <select
              value={formData.roleId}
              onChange={(e) => updateField('roleId', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value="">Aucun rôle assigné</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nomRole} ({role.interpretePrenom} {role.interpreteNom})
                </option>
              ))}
            </select>
            {formData.roleId && (
              <div className="mt-1">
                {(() => {
                  const selectedRole = roles.find(r => r.id === formData.roleId)
                  return selectedRole ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white">
                      ● {selectedRole.nomRole}
                    </span>
                  ) : null
                })()}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Statut de la séquence</label>
            <select
              value={formData.statut}
              onChange={(e) => updateField('statut', e.target.value as Costume['statut'])}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value="A validé">A validé</option>
              <option value="En attente">En attente</option>
              <option value="Validé">Validé</option>
              <option value="Reporté">Reporté</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Notes lié au costume</label>
          <textarea
            value={formData.notesCostume}
            onChange={(e) => updateField('notesCostume', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={4}
            placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
          />
        </div>
      </div>
    </form>
  )
})

CostumeForm.displayName = 'CostumeForm'

export default CostumeForm