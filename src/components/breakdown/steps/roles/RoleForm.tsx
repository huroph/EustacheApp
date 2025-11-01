'use client'

import { useState, useEffect, useRef } from 'react'
import { Role } from '@/lib/sessionData'
import Button from '@/components/ui/Button'

interface RoleFormProps {
  role?: Role | null
  onSave: (roleData: Omit<Role, 'id' | 'createdAt'>) => void
  onCancel: () => void
  submitTrigger?: number
}

export default function RoleForm({ role, onSave, onCancel, submitTrigger }: RoleFormProps) {
  const [formData, setFormData] = useState<Omit<Role, 'id' | 'createdAt'>>({
    type: 'Principale',
    nomRole: '',
    interpreteNom: '',
    interpretePrenom: '',
    genre: 'Féminin',
    agePersonnage: '',
    apparence: '',
    description: '',
    notesSequence: '',
    adresse: '',
    email: '',
    telephone: '',
    doublureNom: '',
    doublurePrenom: '',
    doublureType: 'Image',
    doublureAdresse: '',
    doublureEmail: '',
    doublureTelephone: '',
    doublureNotes: ''
  })

  // Charger les données du rôle en mode édition
  useEffect(() => {
    if (role) {
      setFormData({
        type: role.type,
        nomRole: role.nomRole,
        interpreteNom: role.interpreteNom,
        interpretePrenom: role.interpretePrenom,
        genre: role.genre,
        agePersonnage: role.agePersonnage,
        apparence: role.apparence,
        description: role.description,
        notesSequence: role.notesSequence,
        adresse: role.adresse,
        email: role.email,
        telephone: role.telephone,
        doublureNom: role.doublureNom || '',
        doublurePrenom: role.doublurePrenom || '',
        doublureType: role.doublureType || 'Image',
        doublureAdresse: role.doublureAdresse || '',
        doublureEmail: role.doublureEmail || '',
        doublureTelephone: role.doublureTelephone || '',
        doublureNotes: role.doublureNotes || ''
      })
    } else {
      // Reset pour nouveau rôle
      setFormData({
        type: 'Principale',
        nomRole: '',
        interpreteNom: '',
        interpretePrenom: '',
        genre: 'Féminin',
        agePersonnage: '',
        apparence: '',
        description: '',
        notesSequence: '',
        adresse: '',
        email: '',
        telephone: '',
        doublureNom: '',
        doublurePrenom: '',
        doublureType: 'Image',
        doublureAdresse: '',
        doublureEmail: '',
        doublureTelephone: '',
        doublureNotes: ''
      })
    }
  }, [role])

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
          {role ? 'Modifier le rôle' : 'Créer un Roles'}
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
        {/* Type et nom du rôle */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Rôle</label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value as Role['type'])}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value="Principale">Principale</option>
              <option value="Secondaire">Secondaire</option>
              <option value="Figurant">Figurant</option>
              <option value="Voix Off">Voix Off</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Genre</label>
            <select
              value={formData.genre}
              onChange={(e) => updateField('genre', e.target.value as Role['genre'])}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value="Féminin">Féminin</option>
              <option value="Masculin">Masculin</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Nom du rôle</label>
          <input
            type="text"
            value={formData.nomRole}
            onChange={(e) => updateField('nomRole', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            placeholder="Claire Dubois"
            required
          />
        </div>

        {/* Interprète */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Interprèter par</label>
            <input
              type="text"
              value={formData.interpretePrenom}
              onChange={(e) => updateField('interpretePrenom', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              placeholder="Justine"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">&nbsp;</label>
            <input
              type="text"
              value={formData.interpreteNom}
              onChange={(e) => updateField('interpreteNom', e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              placeholder="Martin"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Age du personnage</label>
          <input
            type="text"
            value={formData.agePersonnage}
            onChange={(e) => updateField('agePersonnage', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            placeholder="38 ans"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Apparence</label>
          <textarea
            value={formData.apparence}
            onChange={(e) => updateField('apparence', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={2}
            placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={2}
            placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Notes lié à la séquences</label>
          <textarea
            value={formData.notesSequence}
            onChange={(e) => updateField('notesSequence', e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            rows={2}
            placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
          />
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gray-300 font-medium mb-2">Contact</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Addresse</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => updateField('adresse', e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                placeholder="39 rue des long prets 94100, PARIS"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="Claire.DUBOIS@gmail.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => updateField('telephone', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="+33070707007"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doublure */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 font-medium">Doublure</h4>
            <Button variant="outline" size="sm">+ Ajouter</Button>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nom Prénom</label>
                <input
                  type="text"
                  value={formData.doublurePrenom}
                  onChange={(e) => updateField('doublurePrenom', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="Fleurs"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">&nbsp;</label>
                <input
                  type="text"
                  value={formData.doublureNom}
                  onChange={(e) => updateField('doublureNom', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="Bonner"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Type</label>
                <select
                  value={formData.doublureType || 'Image'}
                  onChange={(e) => updateField('doublureType', e.target.value || 'Image')}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                >
                  <option value="Image">Image</option>
                  <option value="Voix">Voix</option>
                  <option value="Cascades">Cascades</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Addresse</label>
              <input
                type="text"
                value={formData.doublureAdresse}
                onChange={(e) => updateField('doublureAdresse', e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                placeholder="39 rue des long prets 94100, PARIS"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Mail</label>
                <input
                  type="email"
                  value={formData.doublureEmail}
                  onChange={(e) => updateField('doublureEmail', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="Claire.DUBOIS@gmail.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.doublureTelephone}
                  onChange={(e) => updateField('doublureTelephone', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  placeholder="+33070707007"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Notes</label>
              <textarea
                value={formData.doublureNotes}
                onChange={(e) => updateField('doublureNotes', e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                rows={2}
                placeholder="Médecin urgentiste brillant mais tourmenté par un drame personne"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}