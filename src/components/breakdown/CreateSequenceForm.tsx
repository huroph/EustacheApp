'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sessionStore } from '@/lib/sessionData'
import StepHeader from './StepHeader'
import StepFooter from './StepFooter'
import GeneralStep from './steps/GeneralStep'
import RoleStep from './steps/RoleStep'
import CostumeStep from './steps/CostumeStep'
import AccessoireStep from './steps/AccessoireStep'
import { EffetsSpeciauxStep } from './steps/EffetsSpeciauxStep'
import { EquipesTechniquesStep } from './steps/EquipesTechniquesStep'
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
  editMode?: boolean
  sequenceId?: string
}

export default function CreateSequenceForm({ onCancel, editMode = false, sequenceId }: CreateSequenceFormProps) {
  const router = useRouter()
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

  // Charger les données en mode édition
  useEffect(() => {
    if (editMode && sequenceId) {
      const sequence = sessionStore.getSequence(sequenceId)
      if (sequence) {
        sessionStore.setCurrentSequence(sequence.id)
        setFormData({
          code: sequence.code,
          title: sequence.title,
          colorId: sequence.colorId,
          status: sequence.status,
          location: sequence.location,
          summary: sequence.summary,
          preMintage: sequence.preMintage,
          ett: sequence.ett,
          effet: sequence.effet,
          type: sequence.type
        })
      }
    }
  }, [editMode, sequenceId])

  const currentIndex = STEPS.indexOf(currentStep)

  // Debug: afficher l'état actuel
  const currentSequence = sessionStore.getCurrentSequence()
  console.log('État actuel du stepper:', {
    currentStep,
    currentSequence: currentSequence ? {
      id: currentSequence.id,
      title: currentSequence.title,
      decorsCount: sessionStore.getDecors(currentSequence.id).length,
      scenesCount: sessionStore.getScenes(currentSequence.id).length
    } : 'Aucune séquence courante',
    formData
  })

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

  // Fonction de debug pour vérifier les données
  const debugSequence = () => {
    const allSequences = sessionStore.getSequences()
    const current = sessionStore.getCurrentSequence()
    console.log('=== DEBUG SEQUENCE ===')
    console.log('Toutes les séquences:', allSequences)
    console.log('Séquence courante:', current)
    console.log('FormData:', formData)
    console.log('======================')
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    try {
      // Récupérer la séquence courante avec tous ses décors et scènes
      const currentSequence = sessionStore.getCurrentSequence()
      
      if (currentSequence) {
        // Mettre à jour les données générales de la séquence existante
        const updatedSequence = sessionStore.updateSequence(currentSequence.id, {
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
        
        if (updatedSequence) {
          setShowSuccess(true)
          const stats = sessionStore.getSequenceStats(updatedSequence.id)
          console.log('Séquence créée/mise à jour:', {
            ...updatedSequence,
            totalDecors: stats.decorsCount,
            totalScenes: stats.scenesCount
          })
          
          // Simuler la sauvegarde et rediriger
          setTimeout(() => {
            setShowSuccess(false)
            router.push('/sequences')
          }, 1000)
        }
      } else {
        // Créer une nouvelle séquence si aucune n'existe
        const newSequence = sessionStore.createSequence({
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
        
        setShowSuccess(true)
        console.log('Nouvelle séquence créée:', newSequence)
        
        setTimeout(() => {
          setShowSuccess(false)
          router.push('/sequences')
        }, 1000)
      }
    } catch (error) {
      console.error('Erreur lors de la création de la séquence:', error)
      alert('Erreur lors de la création de la séquence. Vérifiez la console pour plus de détails.')
    }
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
        return <EffetsSpeciauxStep sequenceId={currentSequence?.id || ''} />
      case "Équipe technique":
        return <EquipesTechniquesStep />
      case "Son":
        return <SonStep />
      case "Machinerie":
        return <MachinerieStep />
      default:
        return <GeneralStep formData={formData} setFormData={setFormData} showSuccess={showSuccess} />
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <StepHeader
            current={currentStep}
            steps={STEPS}
            onSelect={goTo}
            onClose={onCancel}
          />
          {/* Bouton debug temporaire */}
          <button
            onClick={debugSequence}
            className="ml-4 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
          >
            Debug
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 md:p-6 border-t border-slate-600">
        <StepFooter
          currentIndex={currentIndex}
          total={STEPS.length}
          onPrev={goPrev}
          onNext={goNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}