'use client'

import { useEffect, useState } from 'react'
import { useCurrentProject } from '@/lib/currentProject-supabase'
import { useSequences } from '@/hooks/useSequences'
import RoleStepSupabase from '@/components/breakdown/steps/roles/RoleStepSupabase'

export default function TestRolesPage() {
  const { project } = useCurrentProject()
  const { sequences } = useSequences(project?.id)
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('')

  useEffect(() => {
    if (sequences.length > 0 && !selectedSequenceId) {
      setSelectedSequenceId(sequences[0].id)
    }
  }, [sequences, selectedSequenceId])

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-400">
          <p>Aucun projet sélectionné</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Test Rôles Supabase</h1>
        
        {sequences.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Aucune séquence disponible</p>
            <p className="text-sm">Créez d'abord une séquence pour tester les rôles.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Séquence sélectionnée
              </label>
              <select
                value={selectedSequenceId}
                onChange={(e) => setSelectedSequenceId(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              >
                {sequences.map((sequence) => (
                  <option key={sequence.id} value={sequence.id}>
                    {sequence.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedSequenceId && (
              <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
                <RoleStepSupabase sequenceId={selectedSequenceId} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}