'use client'

import { useState, useEffect } from 'react'
import { Accessoire, Role } from '@/lib/types-clean'
import Button from '@/components/ui/Button'

interface AccessoireFormProps {
  accessoire?: Accessoire | null
  roles: Role[] // Liste des rôles disponibles pour le dropdown
  onSave: (accessoireData: Omit<Accessoire, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function AccessoireForm({ accessoire, roles, onSave, onCancel }: AccessoireFormProps) {
  const [formData, setFormData] = useState<Omit<Accessoire, 'id' | 'createdAt'>>({
    nomAccessoire: '',
    roleId: '',
    statut: 'A validé',
    notesAccessoire: ''
  })

  // Charger les données de l'accessoire en mode édition
  useEffect(() => {
    if (accessoire) {
      setFormData({
        nomAccessoire: accessoire.nomAccessoire,
        roleId: accessoire.roleId || '',
        statut: accessoire.statut,
        notesAccessoire: accessoire.notesAccessoire
      })
    } else {
      // Reset pour nouvel accessoire
      setFormData({
        nomAccessoire: '',
        roleId: '',
        statut: 'A validé',
        notesAccessoire: ''
      })
    }
  }, [accessoire])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      roleId: formData.roleId || undefined // Convertir string vide en undefined
    })
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Nom du costume</label>
          <input
            type="text"
            value={formData.nomAccessoire}
            onChange={(e) => updateField('nomAccessoire', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            placeholder="Bague"
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
              onChange={(e) => updateField('statut', e.target.value as Accessoire['statut'])}
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
          <label className="block text-gray-300 text-sm mb-1">Notes lié à l'accessoire</label>
          <textarea
            value={formData.notesAccessoire}
            onChange={(e) => updateField('notesAccessoire', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={4}
            placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-600">
        <Button variant="outline" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit">
          {accessoire ? 'Valider' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}