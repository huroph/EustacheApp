// Utilitaires pour seeder des décors de test dans Supabase
// src/utils/seed-decors.ts

import { DecorsService } from '@/lib/services/decors'

export const seedDecors = async (sequenceId: string): Promise<boolean> => {
  try {
    console.log('🌱 Seeding décors pour la séquence:', sequenceId)

    const testDecors = [
      {
        sequence_id: sequenceId,
        title: 'Salon bourgeois',
        address: '123 Avenue des Champs-Élysées, Paris',
        location_type: 'Intérieur' as const,
        status: 'A validé' as const
      },
      {
        sequence_id: sequenceId,
        title: 'Jardin du château',
        address: 'Château de Versailles, Versailles',
        location_type: 'Extérieur' as const,
        status: 'En attente' as const
      },
      {
        sequence_id: sequenceId,
        title: 'Cuisine moderne',
        address: 'Studio A, 42 Rue de la Production, Boulogne',
        location_type: 'Intérieur' as const,
        status: 'Validé' as const
      }
    ]

    for (const decorData of testDecors) {
      await DecorsService.create(decorData)
    }

    console.log('✅ Décors créés avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la création des décors:', error)
    return false
  }
}

export const clearDecors = async (sequenceId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Suppression des décors pour la séquence:', sequenceId)
    
    const decors = await DecorsService.getBySequence(sequenceId)
    
    for (const decor of decors) {
      await DecorsService.delete(decor.id)
    }

    console.log('✅ Décors supprimés avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des décors:', error)
    return false
  }
}

export const getDecorsStats = async (sequenceId: string) => {
  try {
    const decors = await DecorsService.getBySequence(sequenceId)
    
    return {
      total: decors.length,
      parStatut: {
        'A validé': decors.filter(d => d.status === 'A validé').length,
        'En attente': decors.filter(d => d.status === 'En attente').length,
        'Validé': decors.filter(d => d.status === 'Validé').length,
        'Reporté': decors.filter(d => d.status === 'Reporté').length,
      },
      parType: {
        'Intérieur': decors.filter(d => d.location_type === 'Intérieur').length,
        'Extérieur': decors.filter(d => d.location_type === 'Extérieur').length,
      }
    }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error)
    return null
  }
}