// src/components/breakdown/ScriptViewer.tsx
'use client'

interface ScriptViewerProps {
  scriptUrl: string | null
  projectTitle: string
  mode?: 'creation' | 'edition' | 'normal'
}

export default function ScriptViewer({ scriptUrl, projectTitle, mode = 'normal' }: ScriptViewerProps) {
  const getModeText = () => {
    switch (mode) {
      case 'creation': return '(Mode création)'
      case 'edition': return '(Mode édition)'
      default: return ''
    }
  }

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

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-full">
      <div className="text-white text-lg font-semibold mb-4 border-b border-slate-600 pb-2">
        Script : {projectTitle} {getModeText()}
      </div>
      <iframe
        src={scriptUrl}
        className="w-full h-[70vh] min-h-[400px] max-h-[800px] rounded border border-slate-600"
        title={`Script ${projectTitle}`}
      />
    </div>
  )
}