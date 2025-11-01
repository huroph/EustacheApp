// src/app/(app)/planning/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentProject } from '@/lib/currentProject'

export default function PlanningPage() {
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
        <div className="mb-8 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white">Planning</h1>
          <p className="text-gray-400">{project.title}</p>
        </div>

        {/* Placeholder content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 flex-1 flex items-center justify-center overflow-y-hidden">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Planning en cours</h2>
            <p className="text-gray-400">
              Le module de planning sera bientôt disponible pour organiser vos séquences dans le temps.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}