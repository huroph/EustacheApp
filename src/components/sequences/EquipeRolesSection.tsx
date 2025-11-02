'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface EquipeRolesSectionProps {
  selectedSequence: any
}

export default function EquipeRolesSection({ selectedSequence }: EquipeRolesSectionProps) {
  const [activeTab, setActiveTab] = useState<'acteurs' | 'silhouette' | 'equipe'>('acteurs')
  const [acteurSubTab, setActeurSubTab] = useState<'info' | 'costumes' | 'accessoires'>('info')

  const tabStyles = (isActive: boolean) => 
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  const subTabStyles = (isActive: boolean) => 
    `px-3 py-1 rounded font-medium text-sm transition-colors ${
      isActive 
        ? 'bg-green-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  return (
    <section className="bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm mr-3">2</span>
        Équipe et Rôles
      </h3>

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
          Silhouette / Figurants
        </button>
        <button
          onClick={() => setActiveTab('equipe')}
          className={tabStyles(activeTab === 'equipe')}
        >
          Équipe Technique
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'acteurs' && (
        <div className="space-y-4">
          {/* Sous-navigation pour les acteurs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActeurSubTab('info')}
              className={subTabStyles(acteurSubTab === 'info')}
            >
              Informations
            </button>
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
          </div>

          {/* Contenu des sous-onglets acteurs */}
          {acteurSubTab === 'info' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Liste des acteurs</h4>
                <Button size="sm">+ Ajouter acteur</Button>
              </div>
              
              {/* Exemple d'acteur */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      👤
                    </div>
                    <div>
                      <h5 className="text-white font-medium">Fumée atmosphérique</h5>
                      <p className="text-gray-400 text-sm">Machine Hazer</p>
                      <div className="flex space-x-2 mt-1">
                        <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">préparer</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {acteurSubTab === 'costumes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Costumes des acteurs</h4>
                <Button size="sm">+ Ajouter costume</Button>
              </div>
              
              {/* Liste des costumes */}
              <div className="space-y-3">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <h5 className="text-white">Robe de soirée bordeaux années 30</h5>
                          <p className="text-gray-400 text-sm">COS-001</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">préparer</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {acteurSubTab === 'accessoires' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Accessoires des acteurs</h4>
                <Button size="sm">+ Ajouter accessoire</Button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm">
                  <p>👜 Aucun accessoire</p>
                  <p className="mt-2">Ajouter des accessoires pour les acteurs</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'silhouette' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Silhouettes / Figurants</h4>
            <Button size="sm">+ Ajouter figurant</Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">
              <p>🎭 Aucune silhouette</p>
              <p className="mt-2">Ajouter des figurants à cette séquence</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'equipe' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Équipe technique</h4>
            <Button size="sm">+ Ajouter membre</Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">
              <p>👥 Aucune équipe</p>
              <p className="mt-2">Ajouter des membres de l'équipe technique</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}