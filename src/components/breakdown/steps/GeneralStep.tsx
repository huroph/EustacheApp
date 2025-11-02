'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import { useDecors } from '@/hooks/useDecors'
import InformationsForm from './general/InformationsForm'
import DecorStepSupabase from './general/DecorStepSupabase'
import SceneStepSupabase from './general/SceneStepSupabase'
import Button from '@/components/ui/Button'

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
  sequenceId?: string  // Pour les composants Supabase
}

const GENERAL_SUB_STEPS = ["Informations", "Décors", "Scènes"] as const
type GeneralSubStep = typeof GENERAL_SUB_STEPS[number]

export default function GeneralStep({ formData, setFormData, showSuccess, sequenceId }: GeneralStepProps) {
  const [activeTab, setActiveTab] = useState<'informations' | 'decors' | 'scenes'>('informations')
  const { project } = useCurrentProject()
  const { createSequence, isLoading } = useSequences()
  const { decors } = useDecors(sequenceId || '')

  // Adaptateur pour convertir les décors Supabase vers le type Decor de l'interface
  const adaptedDecors = decors.map(d => ({
    id: d.id,
    title: d.title,
    address: d.address || '',
    manoir: d.location_type === 'Intérieur' ? 'Intérieur' as const : 'Extérieur' as const,
    status: d.status,
    createdAt: new Date(d.created_at)
  }))

  // Fonction pour créer une séquence de test
  const handleCreateTestSequence = async () => {
    if (!project?.id) {
      toast.error('Aucun projet sélectionné')
      return
    }

    const loadingToast = toast.loading('Création de la séquence...')

    try {
      const sequenceData = {
        project_id: project.id,
        title: `Séquence Test ${Date.now()}`,
        color_id: '#3b82f6',
        status: 'En attente' as const
      }
      
      const newSequence = await createSequence(sequenceData)
      
      if (newSequence) {
        toast.success(`Séquence "${newSequence.title}" créée avec succès !`, {
          id: loadingToast,
        })
        // Vous pouvez maintenant tester les décors/scènes
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      toast.error('Erreur lors de la création de la séquence', {
        id: loadingToast,
      })
    }
  }

  const hasValidSequence = sequenceId && sequenceId !== ''

  return (
    <div className="space-y-6">
      {/* Bouton de test pour créer une séquence */}
      {!hasValidSequence && (
        <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">
            Aucune séquence disponible. Créez une séquence de test pour tester les décors et scènes :
          </p>
          <Button 
            onClick={handleCreateTestSequence}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Création...' : 'Créer une séquence de test'}
          </Button>
        </div>
      )}

      {/* Navigation des onglets */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg border border-gray-600">
        <button
          onClick={() => setActiveTab('informations')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'informations'
              ? 'bg-gray-700 text-white shadow-sm border border-gray-500'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab('decors')}
          disabled={!hasValidSequence}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'decors' && hasValidSequence
              ? 'bg-gray-700 text-white shadow-sm border border-gray-500'
              : !hasValidSequence
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Décors
          {!hasValidSequence && (
            <span className="ml-1 text-xs text-gray-500">🔒</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          disabled={!hasValidSequence}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'scenes' && hasValidSequence
              ? 'bg-gray-700 text-white shadow-sm border border-gray-500'
              : !hasValidSequence
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Scènes
          {!hasValidSequence && (
            <span className="ml-1 text-xs text-gray-500">🔒</span>
          )}
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-gray-800 rounded-lg border border-gray-600">
        {activeTab === 'informations' && (
          <div className="p-6">
            <InformationsForm 
              formData={formData}
              setFormData={setFormData}
              showSuccess={showSuccess}
            />
          </div>
        )}
        
        {activeTab === 'decors' && hasValidSequence && (
          <div className="p-6">
            <DecorStepSupabase sequenceId={sequenceId!} />
          </div>
        )}
        
        {activeTab === 'scenes' && hasValidSequence && (
          <div className="p-6">
            <SceneStepSupabase 
              sequenceId={sequenceId!} 
              decors={adaptedDecors}
            />
          </div>
        )}
        
        {(activeTab === 'decors' || activeTab === 'scenes') && !hasValidSequence && (
          <div className="p-6 text-center text-gray-400">
            <p>Créez d'abord une séquence pour gérer les {activeTab}.</p>
          </div>
        )}
      </div>
    </div>
  )
}