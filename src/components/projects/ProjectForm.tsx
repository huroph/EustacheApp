// src/components/projects/ProjectForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/services/projects'
import { StorageService } from '@/lib/services/storage'
import Button from '@/components/ui/Button'

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (data: ProjectFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export interface ProjectFormData {
  title: string
  description: string
  script_file: string
  start_date: string
  end_date: string
  cover_url: string
  status: 'En préparation' | 'En cours' | 'Terminé' | 'Archivé'
}

export default function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    script_file: '',
    start_date: '',
    end_date: '',
    cover_url: '',
    status: 'En préparation'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [scriptFile, setScriptFile] = useState<File | null>(null)
  const [isUploadingScript, setIsUploadingScript] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        script_file: project.script_file || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        cover_url: project.cover_url || '',
        status: project.status || 'En préparation'
      })
    }
  }, [project])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'La date de fin doit être après la date de début'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      let scriptUrl = formData.script_file

      // Upload du script PDF si un nouveau fichier est sélectionné
      if (scriptFile) {
        setIsUploadingScript(true)
        // Créer un ID temporaire pour le projet si c'est une création
        const projectId = project?.id || `temp-${Date.now()}`
        scriptUrl = await StorageService.uploadScriptPDF(scriptFile, projectId)
      }

      await onSubmit({
        ...formData,
        script_file: scriptUrl
      })
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsUploadingScript(false)
    }
  }

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleScriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = StorageService.validatePDFFile(file)
    if (validationError) {
      setErrors(prev => ({ ...prev, script_file: validationError }))
      return
    }

    setScriptFile(file)
    setErrors(prev => ({ ...prev, script_file: '' }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg">
          {project ? 'Modifier le projet' : 'Nouveau projet'}
        </h3>
        <Button variant="outline" size="sm" onClick={onCancel}>
          ✕ Annuler
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
            Titre du projet *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Ex: Film court-métrage 2025"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Description du projet..."
          />
        </div>

        {/* Script PDF */}
        <div>
          <label htmlFor="script_file" className="block text-sm font-medium text-gray-400 mb-1">
            Script PDF
          </label>
          <input
            type="file"
            id="script_file"
            accept=".pdf"
            onChange={handleScriptFileChange}
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 ${
              errors.script_file ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {formData.script_file && !scriptFile && (
            <p className="text-sm text-green-400 mt-1">
              ✓ Script actuel : {formData.script_file.split('/').pop()}
            </p>
          )}
          {scriptFile && (
            <p className="text-sm text-blue-400 mt-1">
              📄 Nouveau fichier : {scriptFile.name}
            </p>
          )}
          {errors.script_file && <p className="text-red-400 text-sm mt-1">{errors.script_file}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-400 mb-1">
              Date de début
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-400 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 ${
                errors.end_date ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.end_date && <p className="text-red-400 text-sm mt-1">{errors.end_date}</p>}
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
            Statut
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProjectFormData['status'])}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="En préparation">En préparation</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Archivé">Archivé</option>
          </select>
        </div>

        {/* URL de couverture */}
        <div>
          <label htmlFor="cover_url" className="block text-sm font-medium text-gray-400 mb-1">
            URL de l'image de couverture
          </label>
          <input
            type="url"
            id="cover_url"
            value={formData.cover_url}
            onChange={(e) => handleChange('cover_url', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="https://..."
          />
        </div>

        {/* Boutons */}
        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading || isUploadingScript}
            className="flex-1"
          >
            {isUploadingScript ? 'Upload du script...' : isLoading ? 'Enregistrement...' : (project ? 'Modifier' : 'Créer')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading || isUploadingScript}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}