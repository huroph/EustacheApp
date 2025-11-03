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
  const [initialFormData, setInitialFormData] = useState({
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
          setIsCreating(true)
          

          const newSequence = await createSequence({
            project_id: project.id,
            title: 'Nouvelle séquence',
            color_id: 'blue',
            status: 'En attente',
          })
          
          if (newSequence) {
            setCreatedSequenceId(newSequence.id)
            
            // Synchroniser le formData avec la séquence créée
            setFormData(prev => ({
              ...prev,
              code: newSequence.code, // Code automatiquement généré
              title: newSequence.title,
              status: newSequence.status,
              color_id: newSequence.color_id
            }))
            
            // Sauvegarder l'état initial pour détecter les changements
            setInitialFormData({
              code: newSequence.code,
              title: newSequence.title,
              colorId: newSequence.color_id || 'blue',
              status: newSequence.status,
              location: '',
              summary: '',
              preMintage: '00:00',
              ett: '00:00',
              effet: 'JOUR',
              type: 'INT'
            })
            
            toast.success(`Séquence ${newSequence.code} créée et prête à être configurée`)
          }
        } catch (error) {
          toast.error('Erreur lors de la création de la séquence initiale')
        } finally {
          setIsCreating(false)
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
        const loadedData = {
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
        }
        
        setFormData(loadedData)
        // Sauvegarder l'état initial pour détecter les changements en mode édition
        setInitialFormData(loadedData)
      }
    }
  }, [editMode, sequenceId, sequences])

  // Détecter les changements dans le formulaire
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)
    setHasUnsavedChanges(hasChanges)
  }, [formData, initialFormData])

  const currentIndex = STEPS.indexOf(currentStep)

  // ÉTAPE 2: Gestion de l'annulation avec suppression de la séquence vide et alerte modifications
  const handleCancel = async () => {
    // Vérifier s'il y a des modifications non enregistrées
    if (hasUnsavedChanges) {
      const confirmExit = window.confirm(
        '⚠️ Vous avez des modifications non enregistrées.\n\nÊtes-vous sûr de vouloir fermer sans enregistrer ?'
      )
      
      if (!confirmExit) {
        return // L'utilisateur a choisi de rester
      }
      
      // Notifier selon le mode
      if (editMode) {
        toast('Modifications annulées - aucune modification n\'a été sauvegardée', { icon: '↩️' })
      }
    }
    
    // Si on a créé une séquence vide (mode création) et qu'on est à la première étape
    if (!editMode && createdSequenceId && currentStep === "Général") {
      try {
        // Utiliser le hook pour supprimer la séquence vide
        await deleteSequence(createdSequenceId)
        toast('Brouillon de séquence supprimé', { icon: '🗑️' })
      } catch (error) {
        toast.error('Erreur lors de la suppression du brouillon')
      }
    }
    
    // Appeler la fonction d'annulation parent
    onCancel()
  }

  // Debug: afficher l'état actuel
  const currentSequence = sessionStore.getCurrentSequence()
  // Removing console.log for cleaner code - state tracking via toast notifications instead

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
    toast('Debug: État des séquences vérifié dans la console', { icon: '🔍' })
    // Log détaillé conservé pour le développement
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
          
          // Mettre à jour l'état initial après sauvegarde réussie
          setInitialFormData(formData)
          setHasUnsavedChanges(false)
          
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
          
          // Réinitialiser l'état des modifications après création réussie
          setHasUnsavedChanges(false)
          
          setTimeout(() => {
            setShowSuccess(false)
            router.push('/sequences')
          }, 1000)
        }
      } else {
        toast.error('Erreur : aucune séquence à finaliser', {
          id: loadingToast,
        })
      }
    } catch (error) {
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
            onFormChange={() => setHasUnsavedChanges(true)}
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
        return <GeneralStep formData={formData} setFormData={setFormData} showSuccess={showSuccess} sequenceId={currentSequenceId} onFormChange={() => setHasUnsavedChanges(true)} />
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
            onCancel={handleCancel}
          />
        </div>
      </div>
    </FooterProvider>
  )
}