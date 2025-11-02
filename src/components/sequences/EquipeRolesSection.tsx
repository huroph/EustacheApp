'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import CollapsibleSection from '@/components/ui/CollapsibleSection'

interface EquipeRolesSectionProps {
  selectedSequence: any
}

export default function EquipeRolesSection({ selectedSequence }: EquipeRolesSectionProps) {
  const [activeTab, setActiveTab] = useState<'acteurs' | 'silhouette' | 'equipe' | 'autres'>('acteurs')
  const [acteurSubTab, setActeurSubTab] = useState<'costumes' | 'accessoires' | 'equipe' | 'note'>('costumes')

  const tabStyles = (isActive: boolean) => 
    `px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  const subTabStyles = (isActive: boolean) => 
    `px-3 py-1 rounded font-medium text-sm transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  return (
    <CollapsibleSection title="Équipe et Rôles" defaultOpen={true}>
      {/* Navigation principale */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('acteurs')}
          className={tabStyles(activeTab === 'acteurs')}
        >
          Acteurs
        </button>
        <button
          onClick={() => setActiveTab('silhouette')}
          className={tabStyles(activeTab === 'silhouette')}
        >
          Silhouette / Figu
        </button>
        <button
          onClick={() => setActiveTab('equipe')}
          className={tabStyles(activeTab === 'equipe')}
        >
          Equipe
        </button>
        <button
          onClick={() => setActiveTab('autres')}
          className={tabStyles(activeTab === 'autres')}
        >
          Autres
        </button>
        <Button size="sm" className="ml-auto">+ Ajouter</Button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'acteurs' && (
        <div className="space-y-4">
          {/* Exemple d'acteur avec expansion */}
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between hover:bg-gray-600 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt="Acteur" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-white font-medium">Fumée atmosphérique</h5>
                  <p className="text-gray-400 text-sm">Machine Hazer</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Sous-navigation pour cet acteur */}
            <div className="px-4 pb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActeurSubTab('costumes')}
                  className={subTabStyles(acteurSubTab === 'costumes')}
                >
                  Costumes
                </button>
                <button
                  onClick={() => setActeurSubTab('accessoires')}
                  className={subTabStyles(acteurSubTab === 'accessoires')}
                >
                  Accessoires
                </button>
        
                <button
                  onClick={() => setActeurSubTab('note')}
                  className={subTabStyles(acteurSubTab === 'note')}
                >
                  Note
                </button>
                <Button size="sm" className="ml-auto">+ Ajouter</Button>
              </div>

              {/* Contenu des sous-onglets */}
              {acteurSubTab === 'costumes' && (
                <div className="space-y-3">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <h6 className="text-white text-sm">Robe de soirée bordeaux années 30</h6>
                          <p className="text-gray-400 text-xs">COS-001</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">préparer</span>
                    </div>
                  ))}
                </div>
              )}

              {acteurSubTab === 'accessoires' && (
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-gray-400 text-sm">
                    <p>👜 Aucun accessoire</p>
                    <p className="mt-2">Ajouter des accessoires pour cet acteur</p>
                  </div>
                </div>
              )}

             

              {acteurSubTab === 'note' && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <textarea 
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="Notes pour cet acteur..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'silhouette' && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">
            <p>🎭 Aucune silhouette</p>
            <p className="mt-2">Ajouter des figurants à cette séquence</p>
          </div>
        </div>
      )}

      {activeTab === 'equipe' && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">
            <p>👥 Aucune équipe</p>
            <p className="mt-2">Ajouter des membres de l'équipe technique</p>
          </div>
        </div>
      )}

      {activeTab === 'autres' && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-gray-400 text-sm">
            <p>� Autres rôles</p>
            <p className="mt-2">Ajouter d'autres types de rôles</p>
          </div>
        </div>
      )}
    </CollapsibleSection>
  )
}