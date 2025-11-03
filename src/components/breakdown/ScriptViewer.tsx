// src/components/breakdown/ScriptViewer.tsx
'use client'

import { useState, useEffect } from 'react'
import { StorageService } from '@/lib/services/storage'

interface ScriptViewerProps {
  scriptUrl: string | null
  projectTitle: string
  mode?: 'creation' | 'edition' | 'normal'
}

export default function ScriptViewer({ scriptUrl, projectTitle, mode = 'normal' }: ScriptViewerProps) {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getModeText = () => {
    switch (mode) {
      case 'creation': return '(Mode création)'
      case 'edition': return '(Mode édition)'
      default: return ''
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadScript = async () => {
      if (!scriptUrl) return

      setIsDecrypting(true)
      setError(null)

      try {
        console.log('Dechiffrement du script en cours...')
        const url = await StorageService.downloadAndDecryptScript(scriptUrl)
        
        if (isMounted) {
          setDecryptedUrl(url)
        }
      } catch (err: any) {
        console.error('Erreur de dechiffrement:', err)
        if (isMounted) {
          setError(err.message || 'Erreur de dechiffrement')
        }
      } finally {
        if (isMounted) {
          setIsDecrypting(false)
        }
      }
    }

    loadScript()

    // Cleanup : supprimer l'URL blob lors du démontage
    return () => {
      isMounted = false
      if (decryptedUrl) {
        StorageService.cleanupBlobUrl(decryptedUrl)
      }
    }
  }, [scriptUrl])

  // Cleanup l'ancienne URL quand une nouvelle est générée
  useEffect(() => {
    return () => {
      if (decryptedUrl) {
        StorageService.cleanupBlobUrl(decryptedUrl)
      }
    }
  }, [decryptedUrl])

  if (!scriptUrl) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
        <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
          Script : {projectTitle} {getModeText()}
        </div>
        <div className="flex items-center justify-center h-[70vh] min-h-[400px] max-h-[800px] bg-gray-800 rounded border border-slate-600">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-lg mb-1">Aucun script PDF</p>
            <p className="text-sm">Ajoutez un script lors de la création du projet</p>
          </div>
        </div>
      </div>
    )
  }

  if (isDecrypting) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
        <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
          Script : {projectTitle} {getModeText()}
        </div>
        <div className="flex items-center justify-center h-[70vh] min-h-[400px] max-h-[800px] bg-gray-800 rounded border border-slate-600">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-4 animate-spin">🔓</div>
            <p className="text-lg mb-1">Déchiffrement du script...</p>
            <p className="text-sm">Sécurisation en cours</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
        <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
          Script : {projectTitle} {getModeText()}
        </div>
        <div className="flex items-center justify-center h-[70vh] min-h-[400px] max-h-[800px] bg-gray-800 rounded border border-slate-600">
          <div className="text-center text-red-400">
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-lg mb-1">Accès refusé</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
      <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
        Script : {projectTitle} {getModeText()} 🔒
      </div>
      {decryptedUrl ? (
        <iframe
          src={decryptedUrl}
          className="w-full h-[70vh] min-h-[400px] max-h-[800px] rounded border border-slate-600"
          title={`Script ${projectTitle}`}
        />
      ) : (
        <div className="flex items-center justify-center h-[70vh] min-h-[400px] max-h-[800px] bg-gray-800 rounded border border-slate-600">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-lg mb-1">Préparation du script...</p>
            <p className="text-sm">Le déchiffrement va commencer</p>
          </div>
        </div>
      )}
    </div>
  )
}