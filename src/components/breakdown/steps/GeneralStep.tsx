'use client'

import { useState, useEffect } from 'react'
import { Decor, Scene } from '@/lib/types-clean'
import { sessionStore } from '@/lib/sessionStore-mock'
import InformationsForm from './general/InformationsForm'
import DecorStep from './general/DecorStep'
import SceneStep from './general/SceneStep'

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
  const [scenes, setScenesData] = useState<Scene[]>([])

  const currentSequence = sessionStore.getCurrentSequence()

  // Charger les données au montage
  useEffect(() => {
    if (currentSequence) {
      loadData()
    }
  }, [currentSequence])

  const loadData = () => {
    if (!currentSequence) return
    
    const sequenceDecors = sessionStore.getDecors(currentSequence.id)
    const sequenceScenes = sessionStore.getScenes(currentSequence.id)
    
    setDecors(sequenceDecors)
    setScenesData(sequenceScenes)
  }

  const renderSubStepContent = () => {
    switch (currentSubStep) {
      case "Informations":
        return (
          <InformationsForm 
            formData={formData}
            setFormData={setFormData}
            showSuccess={showSuccess}
          />
        )
      
      case "Décors":
        return (
          <DecorStep 
            sequenceId={currentSequence?.id || ''}
            onUpdate={loadData}
          />
        )
      
      case "Scènes":
        return (
          <SceneStep 
            sequenceId={currentSequence?.id || ''}
            decors={decors}
            onUpdate={loadData}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub-step Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {GENERAL_SUB_STEPS.map((subStep) => (
          <button
            key={subStep}
            onClick={() => setCurrentSubStep(subStep)}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${currentSubStep === subStep 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            {subStep}
          </button>
        ))}
      </div>

      {/* Sub-step Content */}
      <div className="min-h-[400px]">
        {renderSubStepContent()}
      </div>

      {/* Summary if data exists */}
      {(decors.length > 0 || scenes.length > 0) && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h3 className="text-white font-medium mb-3">Résumé</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Décors:</span>
              <span className="text-white ml-2">{decors.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Scènes:</span>
              <span className="text-white ml-2">{scenes.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}