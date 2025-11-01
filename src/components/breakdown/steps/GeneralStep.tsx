'use client'

import { useState, useEffect } from 'react'
import { sessionStore, type Decor, type Scene } from '@/lib/sessionData'

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

export default function GeneralStep({ formData, setFormData, showSuccess }: GeneralStepProps) {
  const [currentSubStep, setCurrentSubStep] = useState<GeneralSubStep>("Informations")
  const [decors, setDecors] = useState<Decor[]>([])
  const [scenes, setScenesData] = useState<(Scene & { decor?: Decor })[]>([])
  const [isAddingDecor, setIsAddingDecor] = useState(false)
  const [isAddingScene, setIsAddingScene] = useState(false)
  const [newDecor, setNewDecor] = useState({ 
    title: '', 
    address: '', 
    manoir: 'Intérieur' as const, 
    status: 'A validé' as const 
  })
  const [newScene, setNewScene] = useState({ 
    numero: '', 
    decorId: '', 
    status: 'A validé' as const, 
    description: '', 
    dureeEstimee: '' 
  })

  const currentSequence = sessionStore.getCurrentSequence()

  // Charger les données au montage
  useEffect(() => {
    if (currentSequence) {
      setDecors(sessionStore.getDecors(currentSequence.id))
      setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
      
      // Synchroniser les données du formulaire avec la séquence courante
      setFormData((prev: any) => ({
        ...prev,
        code: currentSequence.code,
        title: currentSequence.title,
        colorId: currentSequence.colorId,
        status: currentSequence.status,
        location: currentSequence.location,
        summary: currentSequence.summary,
        preMintage: currentSequence.preMintage,
        ett: currentSequence.ett,
        effet: currentSequence.effet,
        type: currentSequence.type
      }))
    }
  }, [currentSequence, setFormData])

  // Synchroniser les changements du formulaire avec le sessionStore
  useEffect(() => {
    if (currentSequence && formData) {
      sessionStore.updateSequence(currentSequence.id, {
        code: formData.code,
        title: formData.title,
        colorId: formData.colorId,
        status: formData.status as any,
        location: formData.location,
        summary: formData.summary,
        preMintage: formData.preMintage,
        ett: formData.ett,
        effet: formData.effet as any,
        type: formData.type as any
      })
    }
  }, [formData, currentSequence])

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
  const manoirOptions = ['Intérieur', 'Extérieur']

  const handleColorChange = (colorId: string) => {
    setFormData((prev: any) => ({ ...prev, colorId }))
  }

  // CRUD Décors
  const handleAddDecor = () => {
    if (!currentSequence || !newDecor.title.trim()) return
    
    const created = sessionStore.createDecor(currentSequence.id, newDecor)
    if (created) {
      setDecors(sessionStore.getDecors(currentSequence.id))
      setNewDecor({ title: '', address: '', manoir: 'Intérieur', status: 'A validé' })
      setIsAddingDecor(false)
    }
  }

  const handleUpdateDecor = (decorId: string, field: string, value: string) => {
    if (!currentSequence) return
    
    sessionStore.updateDecor(currentSequence.id, decorId, { [field]: value })
    setDecors(sessionStore.getDecors(currentSequence.id))
    setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
  }

  const handleDeleteDecor = (decorId: string) => {
    if (!currentSequence) return
    
    if (confirm('Supprimer ce décor supprimera aussi toutes les scènes associées. Continuer ?')) {
      sessionStore.deleteDecor(currentSequence.id, decorId)
      setDecors(sessionStore.getDecors(currentSequence.id))
      setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
    }
  }

  // CRUD Scènes
  const handleAddScene = () => {
    if (!currentSequence || !newScene.numero.trim() || !newScene.decorId) return
    
    const created = sessionStore.createScene(currentSequence.id, newScene)
    if (created) {
      setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
      setNewScene({ numero: '', decorId: '', status: 'A validé', description: '', dureeEstimee: '' })
      setIsAddingScene(false)
    }
  }

  const handleUpdateScene = (sceneId: string, field: string, value: string) => {
    if (!currentSequence) return
    
    sessionStore.updateScene(currentSequence.id, sceneId, { [field]: value })
    setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
  }

  const handleDeleteScene = (sceneId: string) => {
    if (!currentSequence) return
    
    if (confirm('Supprimer cette scène ?')) {
      sessionStore.deleteScene(currentSequence.id, sceneId)
      setScenesData(sessionStore.getScenesWithDecors(currentSequence.id))
    }
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
        <h3 className="text-gray-400 text-sm">Lieux de tournage ({decors.length})</h3>
        <button 
          onClick={() => setIsAddingDecor(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {isAddingDecor && (
        <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Nouveau décor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Titre *</label>
              <input
                type="text"
                value={newDecor.title}
                onChange={(e) => setNewDecor(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nom du décor..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Statut</label>
              <select
                value={newDecor.status}
                onChange={(e) => setNewDecor(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Adresse</label>
              <input
                type="text"
                value={newDecor.address}
                onChange={(e) => setNewDecor(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse du lieu..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={newDecor.manoir}
                onChange={(e) => setNewDecor(prev => ({ ...prev, manoir: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {manoirOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddDecor}
              disabled={!newDecor.title.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setIsAddingDecor(false)
                setNewDecor({ title: '', address: '', manoir: 'Intérieur', status: 'A validé' })
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {decors.map((decor) => (
          <div key={decor.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre</label>
                <input
                  type="text"
                  value={decor.title}
                  onChange={(e) => handleUpdateDecor(decor.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value={decor.status}
                  onChange={(e) => handleUpdateDecor(decor.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  onClick={() => handleDeleteDecor(decor.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Adresse</label>
              <input
                type="text"
                value={decor.address}
                onChange={(e) => handleUpdateDecor(decor.id, 'address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={decor.manoir}
                onChange={(e) => handleUpdateDecor(decor.id, 'manoir', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {manoirOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {decors.length === 0 && !isAddingDecor && (
          <div className="text-center py-8 text-gray-400">
            <p>Aucun décor ajouté</p>
            <button 
              onClick={() => setIsAddingDecor(true)}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              Ajouter le premier décor
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderScenesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">Scènes ({scenes.length})</h3>
        <button 
          onClick={() => setIsAddingScene(true)}
          disabled={decors.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter</span>
        </button>
      </div>

      {decors.length === 0 && (
        <div className="bg-yellow-900/50 text-yellow-200 p-3 rounded-lg">
          Vous devez d'abord créer au moins un décor pour pouvoir ajouter des scènes.
        </div>
      )}

      {/* Formulaire d'ajout */}
      {isAddingScene && (
        <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Nouvelle scène</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Numéro *</label>
              <input
                type="text"
                value={newScene.numero}
                onChange={(e) => setNewScene(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="Ex: SQ-003"
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Statut</label>
              <select
                value={newScene.status}
                onChange={(e) => setNewScene(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Décor *</label>
              <select
                value={newScene.decorId}
                onChange={(e) => setNewScene(prev => ({ ...prev, decorId: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              >
                <option value="">Sélectionner un décor...</option>
                {decors.map(decor => (
                  <option key={decor.id} value={decor.id}>{decor.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Durée estimée</label>
              <input
                type="text"
                value={newScene.dureeEstimee}
                onChange={(e) => setNewScene(prev => ({ ...prev, dureeEstimee: e.target.value }))}
                placeholder="Ex: 05:30"
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={newScene.description}
              onChange={(e) => setNewScene(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la scène..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm resize-none"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddScene}
              disabled={!newScene.numero.trim() || !newScene.decorId}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setIsAddingScene(false)
                setNewScene({ numero: '', decorId: '', status: 'A validé', description: '', dureeEstimee: '' })
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scenes.map((scene) => (
          <div key={scene.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Numéro</label>
                <input
                  type="text"
                  value={scene.numero}
                  onChange={(e) => handleUpdateScene(scene.id, 'numero', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <select
                  value={scene.status}
                  onChange={(e) => handleUpdateScene(scene.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  onClick={() => handleDeleteScene(scene.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Décor</label>
                <select
                  value={scene.decorId}
                  onChange={(e) => handleUpdateScene(scene.id, 'decorId', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  {decors.map(decor => (
                    <option key={decor.id} value={decor.id}>{decor.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Durée estimée</label>
                <input
                  type="text"
                  value={scene.dureeEstimee || ''}
                  onChange={(e) => handleUpdateScene(scene.id, 'dureeEstimee', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                />
              </div>
            </div>

            {(scene.description || scene.description === '') && (
              <div className="mt-3">
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={scene.description}
                  onChange={(e) => handleUpdateScene(scene.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm resize-none"
                />
              </div>
            )}
          </div>
        ))}

        {scenes.length === 0 && !isAddingScene && decors.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune scène ajoutée</p>
            <button 
              onClick={() => setIsAddingScene(true)}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              Ajouter la première scène
            </button>
          </div>
        )}
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