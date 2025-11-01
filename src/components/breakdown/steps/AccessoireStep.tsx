'use client'

export default function AccessoireStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Configuration des accessoires et props</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      <div className="bg-slate-700 p-6 rounded-lg text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">Étape Accessoire</h3>
          <p className="text-sm">Cette section sera développée prochainement</p>
        </div>
      </div>
    </div>
  )
}