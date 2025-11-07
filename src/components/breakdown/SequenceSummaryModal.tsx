'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { 
  Palette, 
  Drama, 
  Users, 
  Shirt, 
  Sparkles, 
  Zap,
  Volume2, 
  Sofa,
  Network
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useDecors } from '@/hooks/useDecors'
import { useScenes } from '@/hooks/useScenes'
import { useRoles } from '@/hooks/useRoles'
import { useCostumes } from '@/hooks/useCostumes'
import { useAccessoires } from '@/hooks/useAccessoires'
import { useEffetsSpeciaux } from '@/hooks/useEffetsSpeciaux'
import { useMaterielSon } from '@/hooks/useMaterielSon'
import { useMachinerie } from '@/hooks/useMachinerie'
import { useEquipesTechniques } from '@/hooks/useEquipesTechniques'

interface SequenceSummaryModalProps {
  isOpen: boolean
  sequenceId: string
  sequenceTitle: string
  onClose: () => void
  onConfirm: () => void
}

export default function SequenceSummaryModal({
  isOpen,
  sequenceId,
  sequenceTitle,
  onClose,
  onConfirm
}: SequenceSummaryModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Récupérer toutes les données avec des valeurs par défaut
  const { decors = [] } = useDecors(sequenceId) || {}
  const { scenes = [] } = useScenes(sequenceId) || {}
  const { roles = [] } = useRoles(sequenceId) || {}
  const { costumes = [] } = useCostumes(sequenceId) || {}
  const { accessoires = [] } = useAccessoires(sequenceId) || {}
  const { effetsSpeciaux = [] } = useEffetsSpeciaux(sequenceId) || {}
  const { materielSon = [] } = useMaterielSon(sequenceId) || {}
  const { machinerie = [] } = useMachinerie(sequenceId) || {}
  // Les équipes techniques ne sont PAS filtrées par sequenceId - récupérer toutes
  const { equipesTechniques = [] } = useEquipesTechniques(sequenceId) || {}

  const handleConfirm = () => {
    onConfirm()
    router.push('/breakdown')
  }

  useEffect(() => {
    // Simuler un temps de chargement minimal
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  const stats = [
    {
      icon: Palette,
      label: 'Décors',
      count: decors.length,
      color: 'text-blue-400',
      items: decors.slice(0, 3),
      displayKey: 'titre'
    },
    {
      icon: Drama,
      label: 'Scènes',
      count: scenes.length,
      color: 'text-purple-400',
      items: scenes.slice(0, 3),
      displayKey: 'numero'
    },
    {
      icon: Users,
      label: 'Rôles',
      count: roles.length,
      color: 'text-green-400',
      items: roles.slice(0, 3),
      displayKey: 'nom_role'
    },
    {
      icon: Shirt,
      label: 'Costumes',
      count: costumes.length,
      color: 'text-pink-400',
      items: costumes.slice(0, 3),
      displayKey: 'nom_costume'
    },
    {
      icon: Sparkles,
      label: 'Accessoires',
      count: accessoires.length,
      color: 'text-yellow-400',
      items: accessoires.slice(0, 3),
      displayKey: 'nom'
    },
    {
      icon: Zap,
      label: 'Effets spéciaux',
      count: effetsSpeciaux.length,
      color: 'text-orange-400',
      items: effetsSpeciaux.slice(0, 3),
      displayKey: 'nom'
    },
    {
      icon: Volume2,
      label: 'Matériel son',
      count: materielSon.length,
      color: 'text-cyan-400',
      items: materielSon.slice(0, 3),
      displayKey: 'nom'
    },
    {
      icon: Sofa,
      label: 'Machineries',
      count: machinerie.length,
      color: 'text-indigo-400',
      items: machinerie.slice(0, 3),
      displayKey: 'nom'
    },
    {
      icon: Network,
      label: 'Équipes techniques',
      count: equipesTechniques.length,
      color: 'text-emerald-400',
      items: equipesTechniques.slice(0, 3),
      displayKey: 'nom'
    }
  ]

  const totalItems = stats.reduce((acc, stat) => acc + stat.count, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Résumé de la séquence</h2>
            <p className="text-gray-400 text-sm mt-1">"{sequenceTitle}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Chargement des informations...</div>
            </div>
          ) : (
            <>
              {/* Total items */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-center text-lg font-semibold text-white">
                  <span className="text-2xl text-blue-400">{totalItems}</span> éléments créés au total
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div
                      key={idx}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <IconComponent className={`w-5 h-5 ${stat.color}`} />
                        <div className="flex-1">
                          <p className="text-gray-300 font-medium">{stat.label}</p>
                          <p className={`text-lg font-bold ${stat.color}`}>{stat.count}</p>
                        </div>
                      </div>

                      {/* Show first 3 items */}
                      {stat.items && stat.items.length > 0 && (
                        <div className="border-t border-gray-600 pt-3 mt-3">
                          <ul className="space-y-1 text-xs text-gray-400">
                            {stat.items.map((item: any, itemIdx: number) => {
                              // Pour les scènes : afficher "numero - description"
                              let displayText = 'Sans titre'
                              if (stat.label === 'Scènes') {
                                const desc = item?.description ? ` - ${item.description}` : ''
                                displayText = `Scène ${item?.numero || '?'}${desc}`
                              }
                              // Pour les rôles : afficher "nom_role (prenom interprete)"
                              else if (stat.label === 'Rôles') {
                                displayText = `${item?.nom_role || 'Sans titre'} (${item?.interprete_prenom || ''} ${item?.interprete_nom || ''})`
                              } 
                              // Pour équipes techniques : afficher "prenom nom (type)"
                              else if (stat.label === 'Équipes techniques') {
                                displayText = `${item?.prenom || ''} ${item?.nom || ''} (${item?.type || ''})`
                              }
                              // Pour costumes
                              else if (stat.label === 'Costumes') {
                                displayText = item?.nom_costume || 'Sans titre'
                              }
                              // Pour autres
                              else {
                                displayText = item?.[stat.displayKey] || item?.title || item?.name || 'Sans titre'
                              }
                              
                              return (
                                <li key={itemIdx} className="text-gray-400 truncate">
                                  • {displayText}
                                </li>
                              )
                            })}
                            {stat.items.length < stat.count && (
                              <li className="text-gray-500 italic pt-1">
                                ... et {stat.count - stat.items.length} de plus
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {!stat.items || stat.items.length === 0 && (
                        <p className="text-xs text-gray-500 italic">Aucun élément créé</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Alert if no items */}
              {totalItems === 0 && (
                <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-orange-400 text-sm font-medium">
                    ⚠️ Attention : Aucun élément n'a été créé pour cette séquence.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            ✓ Valider la séquence
          </Button>
        </div>
      </div>
    </div>
  )
}
