'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { sessionStore } from '@/lib/sessionStore-mock'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import { FooterProvider } from '@/contexts/FooterContext'
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
  const { project } = useCurrentProject()
  const { sequences, createSequence, updateSequence, deleteSequence } = useSequences(project?.id)
  const [currentStep, setCurrentStep] = useState<StepKey>("Général")
  const [createdSequenceId, setCreatedSequenceId] = useState<string | null>(sequenceId || null)
  const [isCreating, setIsCreating] = useState(false) // Flag pour éviter la création multiple
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    colorId: 'blue',
    status: 'En attente',
    location: '',
    summary: '',
    preMintage: '00:00',
    ett: '00:00',
    effet: 'JOUR',
    type: 'INT'
  })
  const [showSuccess, setShowSuccess] = useState(false)

  // ÉTAPE 1: Créer automatiquement une séquence vide à l'ouverture (mode création seulement)
  useEffect(() => {
    const createInitialSequence = async () => {
      // Conditions strictes pour éviter la création multiple
      if (!editMode && !sequenceId && !createdSequenceId && !isCreating && project?.id) {
        setIsCreating(true) // Bloquer les créations multiples
        
        console.log('🔄 Tentative de création séquence, conditions:', {
          editMode,
          sequenceId,
          createdSequenceId,
          isCreating,
          projectId: project.id,
          sequencesCount: sequences.length
        })

        try {
          // Forcer le rechargement des séquences depuis la base pour avoir les données à jour
          console.log('🔄 Rechargement des séquences depuis la base...')
          const { SequencesService } = await import('@/lib/services/sequences')
          const currentSequences = await SequencesService.getByProject(project.id)
          
          // Générer le prochain code de séquence disponible
          const generateNextSequenceCode = () => {
            console.log('📊 Séquences actuelles pour génération code:', currentSequences.map(s => ({ id: s.id, code: s.code, title: s.title })))
            
            if (currentSequences.length === 0) {
              console.log('🎯 Aucune séquence, génération SEQ-1')
              return 'SEQ-1'
            }
            
            // Extraire les numéros existants et trouver le max
            const existingNumbers = currentSequences
              .map(seq => {
                const match = seq.code?.match(/SEQ-(\d+)/)
                const num = match?.[1]
                console.log(`📝 Séquence ${seq.code} → ${num}`)
                return num
              })
              .filter(num => num !== undefined)
              .map(num => parseInt(num as string, 10))
            
            console.log('🔢 Numéros extraits:', existingNumbers)
            const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0
            const nextCode = `SEQ-${maxNumber + 1}`
            console.log('🎯 Prochain code généré:', nextCode)
            return nextCode
          }

          const sequenceCode = generateNextSequenceCode()

          const newSequence = await createSequence({
            project_id: project.id,
            title: `Séquence ${sequenceCode.replace('SEQ-', '')}`,
            color_id: 'blue',
            status: 'En attente',
          })
          
          if (newSequence && updateSequence) {
            // Mettre à jour avec le code généré
            await updateSequence(newSequence.id, {
              code: sequenceCode
            })
            
            setCreatedSequenceId(newSequence.id)
            
            // Synchroniser le formData avec la séquence créée
            setFormData(prev => ({
              ...prev,
              code: sequenceCode,
              title: `Séquence ${sequenceCode.replace('SEQ-', '')}`
            }))
            
            console.log('✅ Séquence vide créée:', sequenceCode, newSequence.id)
          }
        } catch (error) {
          console.error('❌ Erreur création séquence vide:', error)
          setIsCreating(false) // Débloquer en cas d'erreur
        }
      }
    }

    createInitialSequence()
  }, [editMode, sequenceId, project?.id]) // Plus de délai, suppression de sequences des dépendances

  // Charger les données en mode édition depuis Supabase
  useEffect(() => {
    if (editMode && sequenceId && sequences.length > 0) {
      const sequence = sequences.find(s => s.id === sequenceId)
      if (sequence) {
        setFormData({
          code: sequence.code || 'SEQ-1',
          title: sequence.title,
          colorId: sequence.color_id || 'blue',
          status: sequence.status || 'A validé',
          location: sequence.location || '',
          summary: sequence.summary || '',
          preMintage: sequence.pre_montage || '00:00',
          ett: sequence.ett || '00:00',
          effet: sequence.time_of_day || 'JOUR',
          type: sequence.location_type || 'INT'
        })
      }
    }
  }, [editMode, sequenceId, sequences])

  const currentIndex = STEPS.indexOf(currentStep)

  // ÉTAPE 2: Gestion de l'annulation avec suppression de la séquence vide
  const handleCancel = async () => {
    // Si on a créé une séquence vide (mode création) et qu'on est à la première étape
    if (!editMode && createdSequenceId && currentStep === "Général") {
      try {
        // Utiliser le hook pour supprimer la séquence vide
        await deleteSequence(createdSequenceId)
        console.log('🗑️ Séquence vide supprimée:', createdSequenceId)
      } catch (error) {
        console.error('❌ Erreur suppression séquence vide:', error)
      }
    }
    
    // Appeler la fonction d'annulation parent
    onCancel()
  }

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const isEditing = editMode && sequenceId
    const loadingToast = toast.loading(isEditing ? 'Modification de la séquence...' : 'Finalisation de la séquence...')
    
    try {
      // Mode édition : mettre à jour une séquence existante
      if (editMode && sequenceId && updateSequence) {
        const updatedSequence = await updateSequence(sequenceId, {
          title: formData.title,
          color_id: formData.colorId,
          status: formData.status as any,
          location: formData.location,
          summary: formData.summary,
          pre_montage: formData.preMintage,
          ett: formData.ett,
          time_of_day: formData.effet as any,
          location_type: formData.type as any
        })
        
        if (updatedSequence) {
          toast.success(`Séquence "${formData.title}" modifiée avec succès`, {
            id: loadingToast,
          })
          setShowSuccess(true)
          console.log('Séquence mise à jour:', updatedSequence)
          
          setTimeout(() => {
            setShowSuccess(false)
            // Ne pas rediriger pour permettre l'édition des décors/scènes
          }, 1000)
        }
      }
      // Mode création : mettre à jour la séquence vide créée au début
      else if (createdSequenceId && updateSequence) {
        const updatedSequence = await updateSequence(createdSequenceId, {
          title: formData.title,
          color_id: formData.colorId,
          status: formData.status as any,
          location: formData.location,
          summary: formData.summary,
          pre_montage: formData.preMintage,
          ett: formData.ett,
          time_of_day: formData.effet as any,
          location_type: formData.type as any
        })
        
        if (updatedSequence) {
          toast.success(`Séquence "${formData.title}" finalisée avec succès`, {
            id: loadingToast,
          })
          setShowSuccess(true)
          console.log('✅ Séquence finalisée (mise à jour de la séquence vide):', updatedSequence)
          
          setTimeout(() => {
            setShowSuccess(false)
            router.push('/sequences')
          }, 1000)
        }
      } else {
        toast.error('Erreur : aucune séquence à finaliser', {
          id: loadingToast,
        })
        console.error('❌ Aucune séquence créée à finaliser')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la séquence:', error)
      toast.error('Erreur lors de la sauvegarde de la séquence', {
        id: loadingToast,
      })
    }
  }

  const renderStepContent = () => {
    // Utiliser l'ID de séquence créée ou fourni en prop
    const currentSequenceId = createdSequenceId || sequenceId
    
    switch (currentStep) {
      case "Général":
        return (
          <GeneralStep 
            formData={formData} 
            setFormData={setFormData}
            showSuccess={showSuccess}
            sequenceId={currentSequenceId}
          />
        )
      case "Rôle":
        return <RoleStep sequenceId={currentSequenceId} />
      case "Costume":
        return <CostumeStep sequenceId={currentSequenceId || ''} />
      case "Accessoire":
        return <AccessoireStep sequenceId={currentSequenceId || ''} />
      case "Effets spéciaux":
        return <EffetsSpeciauxStep sequenceId={currentSequenceId || ''} />
      case "Équipe technique":
        return <EquipesTechniquesStep sequenceId={currentSequenceId || ''} />
      case "Son":
        return <SonStep sequenceId={currentSequenceId || ''} />
      case "Machinerie":
        return <MachinerieStep sequenceId={currentSequenceId || ''} />
      default:
        return <GeneralStep formData={formData} setFormData={setFormData} showSuccess={showSuccess} sequenceId={currentSequenceId} />
    }
  }

  return (
    <FooterProvider>
      <div className="bg-slate-800 rounded-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <StepHeader
              current={currentStep}
              steps={STEPS}
              onSelect={goTo}
              onClose={handleCancel}
            />
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
            editMode={editMode}
            onCancel={!editMode ? handleCancel : undefined}
          />
        </div>
      </div>
    </FooterProvider>
  )
}