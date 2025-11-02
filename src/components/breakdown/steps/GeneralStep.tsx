'use client'

import { useState } from 'react'
import InformationsForm from './general/InformationsForm'
import SimpleDecorStep from './general/SimpleDecorStep'
import SimpleSceneStep from './general/SimpleSceneStep'

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
  const [currentSubStep, setCurrentSubStep] = useState<GeneralSubStep>("Informations")

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
        return sequenceId ? (
          <SimpleDecorStep sequenceId={sequenceId} />
        ) : (
          <div className="text-gray-400 text-center py-8">
            Veuillez d'abord créer la séquence pour gérer les décors
          </div>
        )
      
      case "Scènes":
        return sequenceId ? (
          <SimpleSceneStep sequenceId={sequenceId} />
        ) : (
          <div className="text-gray-400 text-center py-8">
            Veuillez d'abord créer la séquence pour gérer les scènes
          </div>
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
    </div>
  )
}