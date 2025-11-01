// src/app/(app)/breakdown/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function BreakdownPage() {
  const router = useRouter()
  const { project, isLoading } = useCurrentProject()

  useEffect(() => {
    if (!isLoading && !project) {
      router.push('/projects')
    }
  }, [project, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!project) {
    return null
  }
  return (
    <div className="h-full bg-gray-900 p-6 flex flex-col overflow-y-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full overflow-y-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Badge>👑</Badge>
            <h1 className="text-2xl font-bold text-white">Dépouillement</h1>
            <span className="text-gray-400">{project.title}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">1 / 8</span>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-hidden">
          {/* Script viewer (left side) - Scrollable */}
          <div className="bg-white rounded-lg p-6 overflow-y-auto">
            <div className="space-y-4 text-sm">
              <div className="font-bold text-center text-lg mb-6">DEUX PAS SUR TERRE</div>
              
              <div className="space-y-2">
                <p><strong>Genre :</strong> Comédie de science-fiction</p>
                <p><strong>Durée estimée :</strong> 5 minutes</p>
                <p><strong>Lieu unique :</strong> Une rue piétonne animée, en début d'après-midi</p>
              </div>

              <div className="border-t pt-4 mt-6">
                <p className="font-bold">PAGE 1</p>
                <p className="font-bold mt-4">EXT. RUE PIÉTONNE - JOUR</p>
                
                <p className="mt-4 leading-relaxed">
                  Une rue commerçante. Passants, vélos, poussettes. Un MIMÉE (mime) statue vivante. 
                  Un CHIEN renifle une borne de parking. Des panneaux incompréhensibles... pour deux créatures en 
                  manteaux longs, lunettes de soleil : ZOG (méticuleux) et KIP (enthousiaste). 
                  Ils ont l'air presque humains, sauf quand le vent révèle leurs chevilles... bleues.
                </p>

                <p className="mt-4">ZOG vérifie un BRACELET-TRADUCTEUR qui clignote.</p>

                <div className="ml-8 mt-4 space-y-2">
                  <p className="font-bold">ZOG</p>
                  <p className="italic">(chuchote)</p>
                  <p>Protocole d'infiltration : marcher « comme si on connaissait ».</p>
                  
                  <p className="font-bold mt-4">KIP</p>
                  <p className="italic">(large sourire)</p>
                  <p>Je connais ! J'ai binge-watché douze saisons de familles très normales. Je suis prêt à « bonjourer ».</p>
                </div>

                <p className="mt-4">
                  Ils s'engagent. Un FEU PIÉTON passe au rouge. Les humains s'arrêtent.
                </p>
              </div>
            </div>
          </div>

          {/* Actions panel (right side) */}
          <div className="space-y-6 flex flex-col overflow-y-hidden">
            <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
              <h2 className="text-white text-lg font-semibold mb-4">Actions</h2>
              
              <Button variant="default" className="w-full mb-4">
                + Créer une séquence
              </Button>
              
              <p className="text-gray-400 mb-6">
                {project.sequencesCount || 14} séquences créées — voir la liste
              </p>
            </div>

            {/* Additional info panel */}
            <div className="bg-gray-800 rounded-lg p-6 flex-shrink-0">
              <h3 className="text-white text-lg font-semibold mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pages analysées:</span>
                  <span className="text-white">1/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Séquences détectées:</span>
                  <span className="text-white">14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Personnages:</span>
                  <span className="text-white">ZOG, KIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}