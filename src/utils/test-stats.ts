// Test rapide du service de stats
// src/utils/test-stats.ts

import { StatsService } from '@/lib/services/stats'

export async function testStats() {
  console.log('🧪 Test du service de statistiques...')
  
  try {
    const stats = await StatsService.getGlobalStats()
    const formatted = StatsService.formatStats(stats)
    
    console.log('📊 Résultats bruts:', stats)
    console.log('📊 Résultats formatés:', formatted)
    
    return { stats, formatted }
  } catch (error) {
    console.error('💥 Erreur dans le test:', error)
    return null
  }
}