'use client'

import { useState } from 'react'
import StepHeader from './StepHeader'
import StepFooter from './StepFooter'
import GeneralStep from './steps/GeneralStep'
import RoleStep from './steps/RoleStep'
import CostumeStep from './steps/CostumeStep'
import AccessoireStep from './steps/AccessoireStep'
import EffetsSpeciauxStep from './steps/EffetsSpeciauxStep'
import EquipeTechniqueStep from './steps/EquipeTechniqueStep'
import SonStep from './steps/SonStep'
import MachinerieStep from './steps/MachinerieStep'

const STEPS = [
  "Général",
  "Rôle",
  "Costume",
  "Accessoire",
  "Effets spéciaux",
  "Équipe technique",
  "Son",
  "Machinerie",
] as const

type StepKey = typeof STEPS[number]

interface CreateSequenceFormProps {
  onCancel: () => void
}

export default function CreateSequenceForm({ onCancel }: CreateSequenceFormProps) {
  const [currentStep, setCurrentStep] = useState<StepKey>("Général")
  const [formData, setFormData] = useState({
    code: 'SEQ-1',
    title: 'Confrontation dans la rue',
    colorId: 'blue',
    status: 'A validé',
    location: '',
    summary: '',
    preMintage: '00:00',
    ett: '00:00',
    effet: 'JOUR',
    type: 'INT'
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const currentIndex = STEPS.indexOf(currentStep)

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1])
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1])
    }
  }

  const goTo = (step: StepKey) => {
    setCurrentStep(step)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "Général":
        return (
          <GeneralStep 
            formData={formData} 
            setFormData={setFormData}
            showSuccess={showSuccess}
          />
        )
      case "Rôle":
        return <RoleStep />
      case "Costume":
        return <CostumeStep />
      case "Accessoire":
        return <AccessoireStep />
      case "Effets spéciaux":
        return <EffetsSpeciauxStep />
      case "Équipe technique":
        return <EquipeTechniqueStep />
      case "Son":
        return <SonStep />
      case "Machinerie":
        return <MachinerieStep />
      default:
        return <GeneralStep formData={formData} setFormData={setFormData} showSuccess={showSuccess} />
    }
  }

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-lg space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <StepHeader
        current={currentStep}
        steps={STEPS}
        onSelect={goTo}
        onClose={onCancel}
      />

      {/* Content */}
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <StepFooter
        currentIndex={currentIndex}
        total={STEPS.length}
        onPrev={goPrev}
        onNext={goNext}
        onSubmit={handleSubmit}
      />
    </div>
  )
}