'use client'

export default function SonStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Configuration de l'audio et du son</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      <div className="bg-slate-700 p-6 rounded-lg text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v5a3 3 0 11-6 0v-5z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">Étape Son</h3>
          <p className="text-sm">Cette section sera développée prochainement</p>
        </div>
      </div>
    </div>
  )
}