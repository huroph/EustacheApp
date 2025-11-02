'use client'

import RoleStepSupabase from './roles/RoleStepSupabase'

interface RoleStepProps {
  sequenceId?: string
}

export default function RoleStep({ sequenceId }: RoleStepProps) {
  if (!sequenceId) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-4">👥</div>
          <p>Aucune séquence disponible</p>
          <p className="text-sm">Créez d'abord une séquence pour gérer les rôles.</p>
        </div>
      </div>
    )
  }

  return <RoleStepSupabase sequenceId={sequenceId} />
}