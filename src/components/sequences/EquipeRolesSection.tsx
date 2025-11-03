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

interface EquipeRolesSectionProps {
  selectedSequence: any
  sequenceData: SequenceData
}

export default function EquipeRolesSection({ selectedSequence, sequenceData }: EquipeRolesSectionProps) {
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
          {/* Vérification de chargement et erreurs */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement des rôles...
            </div>
          )}
          
          {sequenceData.error && (
            <div className="text-center text-red-400 py-4">
              Erreur: {sequenceData.error}
            </div>
          )}

          {/* Liste des rôles réels */}
          {sequenceData.roles.length === 0 && !sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-8">
              Aucun rôle défini pour cette séquence
            </div>
          )}

          {sequenceData.roles.map((role) => (
            <div key={role.id} className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between hover:bg-gray-600 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {role.nom?.charAt(0) || 'R'}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{role.nom}</h5>
                    <p className="text-gray-400 text-sm">{role.type}</p>
                    {role.notes && (
                      <p className="text-gray-500 text-xs mt-1">{role.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    role.statut === 'Validé' ? 'bg-green-600 text-white' :
                    role.statut === 'En attente' ? 'bg-yellow-600 text-white' :
                    role.statut === 'A validé' ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {role.statut}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                    {/* Affichage des costumes liés à ce rôle */}
                    {sequenceData.costumes
                      .filter(costume => costume.roleId === role.id)
                      .map((costume) => (
                        <div key={costume.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              costume.statut === 'Validé' ? 'bg-green-500' :
                              costume.statut === 'En attente' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <div>
                              <h6 className="text-white text-sm">{costume.nom}</h6>
                              <p className="text-gray-400 text-xs">{costume.reference}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            costume.statut === 'Validé' ? 'bg-green-600 text-white' :
                            costume.statut === 'En attente' ? 'bg-yellow-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {costume.statut}
                          </span>
                        </div>
                      ))}
                    {sequenceData.costumes.filter(costume => costume.roleId === role.id).length === 0 && (
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-gray-400 text-sm">
                          <p>👗 Aucun costume</p>
                          <p className="mt-2">Ajouter des costumes pour ce rôle</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {acteurSubTab === 'accessoires' && (
                  <div className="space-y-3">
                    {/* Affichage des accessoires liés à ce rôle */}
                    {sequenceData.accessoires
                      .filter(accessoire => accessoire.roleId === role.id)
                      .map((accessoire) => (
                        <div key={accessoire.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              accessoire.statut === 'Validé' ? 'bg-green-500' :
                              accessoire.statut === 'En attente' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <div>
                              <h6 className="text-white text-sm">{accessoire.nom}</h6>
                              <p className="text-gray-400 text-xs">{accessoire.reference}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            accessoire.statut === 'Validé' ? 'bg-green-600 text-white' :
                            accessoire.statut === 'En attente' ? 'bg-yellow-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {accessoire.statut}
                          </span>
                        </div>
                      ))}
                    {sequenceData.accessoires.filter(accessoire => accessoire.roleId === role.id).length === 0 && (
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-gray-400 text-sm">
                          <p>👜 Aucun accessoire</p>
                          <p className="mt-2">Ajouter des accessoires pour ce rôle</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {acteurSubTab === 'note' && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <textarea 
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="Notes pour cet acteur..."
                      rows={3}
                      defaultValue={role.notes}
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
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
        <div className="space-y-4">
          {/* Vérification de chargement */}
          {sequenceData.isLoading && (
            <div className="text-center text-gray-400 py-4">
              Chargement de l'équipe technique...
            </div>
          )}

          {/* Liste des équipes techniques réelles */}
          {sequenceData.equipesTechniques.length === 0 && !sequenceData.isLoading && (
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm">
                <p>👥 Aucune équipe technique</p>
                <p className="mt-2">Ajouter des membres de l'équipe technique</p>
              </div>
            </div>
          )}

          {sequenceData.equipesTechniques.map((equipe) => (
            <div key={equipe.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {equipe.prenom?.charAt(0) || 'E'}{equipe.nom?.charAt(0) || 'T'}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{equipe.prenom} {equipe.nom}</h5>
                    <p className="text-gray-400 text-sm">{equipe.type}</p>
                    {equipe.notes && (
                      <p className="text-gray-500 text-xs mt-1">{equipe.notes}</p>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  equipe.statut === 'Validé' ? 'bg-green-600 text-white' :
                  equipe.statut === 'En attente' ? 'bg-yellow-600 text-white' :
                  equipe.statut === 'A validé' ? 'bg-orange-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {equipe.statut}
                </span>
              </div>
            </div>
          ))}
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