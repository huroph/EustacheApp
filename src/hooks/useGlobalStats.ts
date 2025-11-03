// Hook pour récupérer et gérer les statistiques globales
// src/hooks/useGlobalStats.ts

'use client'

import { useState, useEffect } from 'react'
import { StatsService, type GlobalStats } from '@/lib/services/stats'

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalSequences: 0,
    totalRoles: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔄 Hook useGlobalStats: début chargement...')
        const globalStats = await StatsService.getGlobalStats()
        console.log('🔄 Hook useGlobalStats: stats reçues:', globalStats)
        setStats(globalStats)
      } catch (err) {
        console.error('❌ Erreur dans useGlobalStats:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        
        // Garder les valeurs par défaut en cas d'erreur
        setStats({
          totalUsers: 0,
          totalProjects: 0,
          totalSequences: 0,
          totalRoles: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  // Formatage pour l'affichage
  const formattedStats = StatsService.formatStats(stats)

  return {
    stats,
    formattedStats,
    isLoading,
    error
  }
}