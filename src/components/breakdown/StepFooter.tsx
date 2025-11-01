'use client'

import Button from '@/components/ui/Button'
import { sessionStore } from '@/lib/sessionData'

interface StepFooterProps {
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function StepFooter({ currentIndex, total, onPrev, onNext, onSubmit }: StepFooterProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  
  // Informations sur la séquence courante
  const currentSequence = sessionStore.getCurrentSequence()
  
  const sequenceStats = currentSequence ? {
    title: currentSequence.title,
    decorsCount: sessionStore.getDecors(currentSequence.id).length,
    scenesCount: sessionStore.getScenes(currentSequence.id).length,
    rolesCount: sessionStore.getRoles(currentSequence.id).length,
    costumesCount: sessionStore.getCostumes(currentSequence.id).length,
    accessoiresCount: sessionStore.getAccessoires(currentSequence.id).length,
    effetsSpeciauxCount: sessionStore.getEffetsSpeciaux(currentSequence.id).length,
    materielSonCount: sessionStore.getMaterielSon(currentSequence.id).length,
    machineriesCount: sessionStore.getMachineries(currentSequence.id).length
  } : null

  // Informations globales
  const globalStats = {
    equipesTechniquesCount: sessionStore.getEquipesTechniques().length
  }

  return (
    <div className="space-y-3">
      {/* Informations de la séquence */}
      {isLast && sequenceStats && (
        <div className="bg-slate-700 p-3 rounded-lg text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <span className="font-medium">Résumé de la séquence:</span>
            <span className="text-blue-400">"{sequenceStats.title}"</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span>{sequenceStats.decorsCount} décor(s)</span>
            <span>{sequenceStats.scenesCount} scène(s)</span>
            <span>{sequenceStats.rolesCount} rôle(s)</span>
            <span>{sequenceStats.costumesCount} costume(s)</span>
            <span>{sequenceStats.accessoiresCount} accessoire(s)</span>
            <span>{sequenceStats.effetsSpeciauxCount} effet(s) spéciaux</span>
            <span>{sequenceStats.materielSonCount} matériel(s) son</span>
            <span>{sequenceStats.machineriesCount} machinerie(s)</span>
            <span>{globalStats.equipesTechniquesCount} équipe(s) technique(s)</span>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onPrev}
            disabled={isFirst}
          >
            Précédent
          </Button>
          <span className="text-gray-400 text-sm">
            {currentIndex + 1} of {total}
          </span>
        </div>
        
        {isLast ? (
          <Button 
            type="button" 
            variant="default" 
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Créer la séquence
          </Button>
        ) : (
          <Button type="button" variant="default" onClick={onNext}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  )
}