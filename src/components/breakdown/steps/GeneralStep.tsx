'use client'

import { useState, useEffect } from 'react'
import { sessionStore, type Decor, type Scene } from '@/lib/sessionData'
import InformationsForm from './general/InformationsForm'
import DecorsManager from './general/DecorsManager'
import ScenesManager from './general/ScenesManager'

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
          <DecorsManager 
            sequenceId={currentSequence?.id || ''}
            decors={decors}
            onUpdate={loadData}
          />
        )
      
      case "Scènes":
        return (
          <ScenesManager 
            sequenceId={currentSequence?.id || ''}
            scenes={scenes}
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
      <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
        {GENERAL_SUB_STEPS.map((subStep) => (
          <button
            key={subStep}
            onClick={() => setCurrentSubStep(subStep)}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${currentSubStep === subStep 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-slate-600'
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
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <h3 className="text-gray-300 font-medium mb-3">Résumé</h3>
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