'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface BreakdownTechniqueSectionProps {
  selectedSequence: any
}

export default function BreakdownTechniqueSection({ selectedSequence }: BreakdownTechniqueSectionProps) {
  const [activeTab, setActiveTab] = useState<'effets' | 'son' | 'machinerie'>('effets')

  const tabStyles = (isActive: boolean) => 
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'A validé': { variant: 'warning' as const, color: 'bg-yellow-600' },
      'En attente': { variant: 'secondary' as const, color: 'bg-gray-600' },
      'Validé': { variant: 'success' as const, color: 'bg-green-600' },
      'Reporté': { variant: 'error' as const, color: 'bg-red-600' }
    }
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['En attente']
  }

  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm mr-3">3</span>
        Breakdown Technique
      </h3>

      {/* Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('effets')}
          className={tabStyles(activeTab === 'effets')}
        >
          ✨ Effets Spéciaux
        </button>
        <button
          onClick={() => setActiveTab('son')}
          className={tabStyles(activeTab === 'son')}
        >
          🎵 Son
        </button>
        <button
          onClick={() => setActiveTab('machinerie')}
          className={tabStyles(activeTab === 'machinerie')}
        >
          📹 Machinerie
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'effets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Effets spéciaux</h4>
            <Button size="sm">+ Ajouter effet</Button>
          </div>
          
          {/* Exemple d'effet spécial */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <h5 className="text-white">Fumée atmosphérique</h5>
                  <p className="text-gray-400 text-sm">Machine Hazer - Référent: John Doe</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">préparer</span>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'son' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Matériel son</h4>
            <Button size="sm">+ Ajouter matériel</Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">
              <p>🎤 Aucun matériel son</p>
              <p className="mt-2">Ajouter du matériel son à cette séquence</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'machinerie' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Machinerie</h4>
            <Button size="sm">+ Ajouter machinerie</Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">
              <p>📹 Aucune machinerie</p>
              <p className="mt-2">Ajouter de la machinerie à cette séquence</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h5 className="text-gray-400 text-sm mb-3">Résumé technique</h5>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">1</div>
            <div className="text-xs text-gray-400">Effets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">0</div>
            <div className="text-xs text-gray-400">Son</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-xs text-gray-400">Machinerie</div>
          </div>
        </div>
      </div>
    </section>
  )
}