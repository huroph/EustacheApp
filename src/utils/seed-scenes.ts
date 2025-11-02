// Utilitaires pour seeder des scènes de test dans Supabase
// src/utils/seed-scenes.ts

import { ScenesService } from '@/lib/services/scenes'

export const seedScenes = async (sequenceId: string, decorId?: string): Promise<boolean> => {
  try {
    console.log('🌱 Seeding scènes pour la séquence:', sequenceId)

    const testScenes = [
      {
        sequence_id: sequenceId,
        decor_id: decorId || null,
        numero: '1A',
        status: 'A validé' as const,
        description: 'Arrivée des invités dans le salon',
        duree_estimee: '02:30'
      },
      {
        sequence_id: sequenceId,
        decor_id: decorId || null,
        numero: '1B',
        status: 'En attente' as const,
        description: 'Dialogue entre les protagonistes',
        duree_estimee: '05:15'
      },
      {
        sequence_id: sequenceId,
        decor_id: decorId || null,
        numero: '2A',
        status: 'Validé' as const,
        description: 'Mouvement de caméra panoramique',
        duree_estimee: '01:45'
      },
      {
        sequence_id: sequenceId,
        decor_id: decorId || null,
        numero: '2B',
        status: 'A validé' as const,
        description: 'Gros plan émotionnel',
        duree_estimee: '00:30'
      }
    ]

    for (const sceneData of testScenes) {
      await ScenesService.create(sceneData)
    }

    console.log('✅ Scènes créées avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la création des scènes:', error)
    return false
  }
}

export const clearScenes = async (sequenceId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Suppression des scènes pour la séquence:', sequenceId)
    
    const scenes = await ScenesService.getBySequence(sequenceId)
    
    for (const scene of scenes) {
      await ScenesService.delete(scene.id)
    }

    console.log('✅ Scènes supprimées avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des scènes:', error)
    return false
  }
}

export const getScenesStats = async (sequenceId: string) => {
  try {
    const scenes = await ScenesService.getBySequence(sequenceId)
    
    // Calculer la durée totale estimée
    const dureeTotal = scenes.reduce((total, scene) => {
      if (scene.duree_estimee) {
        const [min, sec] = scene.duree_estimee.split(':').map(Number)
        return total + (min * 60) + sec
      }
      return total
    }, 0)

    const dureeFormatted = `${Math.floor(dureeTotal / 60)}:${(dureeTotal % 60).toString().padStart(2, '0')}`

    return {
      total: scenes.length,
      dureeTotal: dureeFormatted,
      parStatut: {
        'A validé': scenes.filter(s => s.status === 'A validé').length,
        'En attente': scenes.filter(s => s.status === 'En attente').length,
        'Validé': scenes.filter(s => s.status === 'Validé').length,
        'Reporté': scenes.filter(s => s.status === 'Reporté').length,
      }
    }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error)
    return null
  }
}