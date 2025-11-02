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
  onTitleChange?: (title: string) => void  // Nouvelle prop pour gérer le changement de titre
}

const GENERAL_SUB_STEPS = ["Informations", "Décors", "Scènes"] as const
type GeneralSubStep = typeof GENERAL_SUB_STEPS[number]

export default function GeneralStep({ formData, setFormData, showSuccess, sequenceId, onTitleChange }: GeneralStepProps) {
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

  const hasValidSequence = sequenceId && sequenceId !== ''

  return (
    <div className="space-y-6">
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
              onTitleChange={onTitleChange}
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