'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import CollapsibleSection from '@/components/ui/CollapsibleSection'

interface BreakdownTechniqueSectionProps {
  selectedSequence: any
}

export default function BreakdownTechniqueSection({ selectedSequence }: BreakdownTechniqueSectionProps) {
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
       
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'effets' && (
        <div className="space-y-3">
          {/* Exemples d'effets spéciaux avec différents statuts */}
          {[
            { nom: 'Fumée atmosphérique', details: 'Machine Hazer', status: 'préparer' },
            { nom: 'Fumée atmosphérique', details: 'Machine Hazer', status: 'en cours' },
            { nom: 'Fumée atmosphérique', details: 'Machine Hazer', status: 'en cours' },
            { nom: 'Fumée atmosphérique', details: 'Machine Hazer', status: 'en cours' }
          ].map((effet, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <h6 className="text-white text-sm font-medium">{effet.nom}</h6>
                  <p className="text-gray-400 text-xs">{effet.details}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(effet.status)}`}>
                {effet.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'son' && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">
            <p>🎤 Aucun matériel son</p>
            <p className="mt-2">Ajouter du matériel son à cette séquence</p>
          </div>
        </div>
      )}

      {activeTab === 'machinerie' && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">
            <p>📹 Aucune machinerie</p>
            <p className="mt-2">Ajouter de la machinerie à cette séquence</p>
          </div>
        </div>
      )}

      
    </CollapsibleSection>
  )
}