'use client'

import { useState } from 'react'

interface GeneralStepProps {
  formData: {
    code: string
    title: string
    colorId: string
    status: string
    location: string
    summary: string
    preMintage: string
    ett: string
    effet: string
    type: string
  }
  setFormData: (data: any) => void
  showSuccess: boolean
}

const GENERAL_SUB_STEPS = ["Informations", "Décors", "Scènes"] as const
type GeneralSubStep = typeof GENERAL_SUB_STEPS[number]

// Mock data pour les décors
const mockDecors = [
  { id: 1, title: "Salon moderne", address: "Studio A", manoir: "Intérieur" },
  { id: 2, title: "Rue parisienne", address: "Ext. Paris 15e", manoir: "Extérieur" },
  { id: 3, title: "Bureau direction", address: "Tour Montparnasse", manoir: "Intérieur" }
]

// Mock data pour les scènes
const mockScenes = [
  { id: 1, numero: "SQ-001", statut: "A validé", decors: "Salon moderne", manoir: "Intérieur" },
  { id: 2, numero: "SQ-002", statut: "A validé", decors: "Rue parisienne", manoir: "Extérieur" }
]

export default function GeneralStep({ formData, setFormData, showSuccess }: GeneralStepProps) {
  const [currentSubStep, setCurrentSubStep] = useState<GeneralSubStep>("Informations")

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
    setFormData((prev: any) => ({ ...prev, colorId }))
  }

  const renderSubStepContent = () => {
    switch (currentSubStep) {
      case "Informations":
        return renderInformationsStep()
      case "Décors":
        return renderDecorsStep()
      case "Scènes":
        return renderScenesStep()
      default:
        return renderInformationsStep()
    }
  }

  const renderInformationsStep = () => (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-800 text-green-100 p-3 rounded-lg">
          Séquence créée (mock) ✓
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, code: e.target.value }))}
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
            onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
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
            onChange={(e) => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
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
            onChange={(e) => setFormData((prev: any) => ({ ...prev, summary: e.target.value }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, preMintage: e.target.value }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, ett: e.target.value }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, effet: e.target.value }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDecorsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">Lieux de tournage</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockDecors.map((decor, index) => (
          <div key={decor.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre</label>
                <input
                  type="text"
                  value={decor.title}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value="A validé"
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  <option>A validé</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button className="text-red-400 hover:text-red-300 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">adresse</label>
              <input
                type="text"
                value={decor.address}
                readOnly
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Manoir</label>
              <select
                value={decor.manoir}
                disabled
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                <option>{decor.manoir}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderScenesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">Scènes</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockScenes.map((scene, index) => (
          <div key={scene.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Numéro</label>
                <select
                  value={scene.numero}
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  <option>{scene.numero}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value={scene.statut}
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  <option>{scene.statut}</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button className="text-red-400 hover:text-red-300 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Décors</label>
              <input
                type="text"
                value={scene.decors}
                readOnly
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Manoir</label>
              <select
                value={scene.manoir}
                disabled
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                <option>{scene.manoir}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Sub-step Navigation */}
      <div className="space-y-2">
        <div className="flex space-x-1">
          {GENERAL_SUB_STEPS.map((subStep) => (
            <button
              key={subStep}
              onClick={() => setCurrentSubStep(subStep)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentSubStep === subStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {subStep}
            </button>
          ))}
        </div>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      {/* Sub-step Content */}
      {renderSubStepContent()}
    </div>
  )
}