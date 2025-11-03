'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import CollapsibleSection from '@/components/ui/CollapsibleSection'

interface SequenceData {
  roles: any[]
  costumes: any[]
  accessoires: any[]
  effetsSpeciaux: any[]
  equipesTechniques: any[]
  materielSon: any[]
  machinerie: any[]
  isLoading: boolean
  error: string | null
}

interface BreakdownTechniqueSectionProps {
  selectedSequence: any
  sequenceData: SequenceData
}

export default function BreakdownTechniqueSection({ selectedSequence, sequenceData }: BreakdownTechniqueSectionProps) {
  const [activeTab, setActiveTab] = useState<'effets' | 'son' | 'machinerie' | 'accessoires'>('effets')

  const tabStyles = (isActive: boolean) => 
    `px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'préparer':
        return 'bg-green-600'
      case 'en cours':
        return 'bg-yellow-600'
      case 'fini':
        return 'bg-blue-600'
      case 'reporté':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <CollapsibleSection title="Breakdown Technique" defaultOpen={true}>
      {/* Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('effets')}
          className={tabStyles(activeTab === 'effets')}
        >
          Effets
        </button>
        <button
          onClick={() => setActiveTab('son')}
          className={tabStyles(activeTab === 'son')}
        >
          Son
        </button>
        <button
          onClick={() => setActiveTab('machinerie')}
          className={tabStyles(activeTab === 'machinerie')}
        >
          Machinerie
        </button>
        <button
          onClick={() => setActiveTab('accessoires')}
          className={tabStyles(activeTab === 'accessoires')}
        >
          Accessoires
        </button>
       
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'effets' && (
        <div className="space-y-3">
          {/* Vérification de chargement */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement des effets spéciaux...
            </div>
          )}

          {/* Liste des effets spéciaux réels */}
          {sequenceData.effetsSpeciaux.length === 0 && !sequenceData.isLoading && (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm">
                <p>✨ Aucun effet spécial</p>
                <p className="mt-2">Ajouter des effets spéciaux à cette séquence</p>
              </div>
            </div>
          )}

          {sequenceData.effetsSpeciaux.map((effet) => (
            <div key={effet.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <h6 className="text-white text-sm font-medium">{effet.nom}</h6>
                  <p className="text-gray-400 text-xs">{effet.description}</p>
                  {effet.notes && (
                    <p className="text-gray-500 text-xs mt-1">{effet.notes}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                effet.statut === 'Validé' ? 'bg-green-600' :
                effet.statut === 'En attente' ? 'bg-yellow-600' :
                effet.statut === 'A validé' ? 'bg-orange-600' :
                'bg-gray-600'
              }`}>
                {effet.statut}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'son' && (
        <div className="space-y-3">
          {/* Vérification de chargement */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement du matériel son...
            </div>
          )}

          {/* Liste du matériel son réel */}
          {sequenceData.materielSon.length === 0 && !sequenceData.isLoading && (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm">
                <p>🎤 Aucun matériel son</p>
                <p className="mt-2">Ajouter du matériel son à cette séquence</p>
              </div>
            </div>
          )}

          {sequenceData.materielSon.map((materiel) => (
            <div key={materiel.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <h6 className="text-white text-sm font-medium">{materiel.nom}</h6>
                  <p className="text-gray-400 text-xs">Réf. par {sequenceData.equipesTechniques.find(e => e.id === materiel.referentId)?.prenom} {sequenceData.equipesTechniques.find(e => e.id === materiel.referentId)?.nom}</p>
                  {materiel.notes && (
                    <p className="text-gray-500 text-xs mt-1">{materiel.notes}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                materiel.statut === 'Validé' ? 'bg-green-600' :
                materiel.statut === 'En attente' ? 'bg-yellow-600' :
                materiel.statut === 'A validé' ? 'bg-orange-600' :
                'bg-gray-600'
              }`}>
                {materiel.statut}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'machinerie' && (
        <div className="space-y-3">
          {/* Vérification de chargement */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement de la machinerie...
            </div>
          )}

          {/* Liste de la machinerie réelle */}
          {sequenceData.machinerie.length === 0 && !sequenceData.isLoading && (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm">
                <p>📹 Aucune machinerie</p>
                <p className="mt-2">Ajouter de la machinerie à cette séquence</p>
              </div>
            </div>
          )}

          {sequenceData.machinerie.map((machine) => (
            <div key={machine.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <h6 className="text-white text-sm font-medium">{machine.nom}</h6>
                  <p className="text-gray-400 text-xs">Réf. par {sequenceData.equipesTechniques.find(e => e.id === machine.referentId)?.prenom} {sequenceData.equipesTechniques.find(e => e.id === machine.referentId)?.nom}</p>
                  {machine.notes && (
                    <p className="text-gray-500 text-xs mt-1">{machine.notes}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                machine.statut === 'Validé' ? 'bg-green-600' :
                machine.statut === 'En attente' ? 'bg-yellow-600' :
                machine.statut === 'A validé' ? 'bg-orange-600' :
                'bg-gray-600'
              }`}>
                {machine.statut}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'accessoires' && (
        <div className="space-y-3">
          {/* Vérification de chargement */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement des accessoires...
            </div>
          )}

          {/* Liste des accessoires réels */}
          {sequenceData.accessoires.length === 0 && !sequenceData.isLoading && (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm">
                <p>🎭 Aucun accessoire</p>
                <p className="mt-2">Ajouter des accessoires à cette séquence</p>
              </div>
            </div>
          )}

          {sequenceData.accessoires.map((accessoire) => (
            <div key={accessoire.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <h6 className="text-white text-sm font-medium">{accessoire.nom}</h6>
                  <p className="text-gray-400 text-xs">{accessoire.reference}</p>
                  {accessoire.notes && (
                    <p className="text-gray-500 text-xs mt-1">{accessoire.notes}</p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                accessoire.statut === 'Validé' ? 'bg-green-600' :
                accessoire.statut === 'En attente' ? 'bg-yellow-600' :
                accessoire.statut === 'A validé' ? 'bg-orange-600' :
                'bg-gray-600'
              }`}>
                {accessoire.statut}
              </span>
            </div>
          ))}
        </div>
      )}

      
    </CollapsibleSection>
  )
}