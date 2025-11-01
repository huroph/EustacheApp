'use client'

export default function CostumeStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">Gestion des costumes et garde-robe</p>
        <div className="w-full h-px bg-blue-500"></div>
      </div>

      <div className="bg-slate-700 p-6 rounded-lg text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">Étape Costume</h3>
          <p className="text-sm">Cette section sera développée prochainement</p>
        </div>
      </div>
    </div>
  )
}