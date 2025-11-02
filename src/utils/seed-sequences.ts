// Utilitaires pour créer des séquences de test
// src/utils/seed-sequences.ts

import { SequencesService } from '@/lib/services/sequences'
import { ProjectsService } from '@/lib/services/projects'

export const sampleSequences = [
  {
    title: "Confrontation dans la rue",
    color_id: "blue",
    status: "A validé" as const,
    location: "Studio A, Paris",
    summary: "Une scène d'action intense dans les rues de Paris avec poursuites et effets spéciaux",
    pre_montage: "02:30",
    ett: "01:45",
    time_of_day: "JOUR" as const,
    location_type: "EXT" as const
  },
  {
    title: "Laboratoire secret",
    color_id: "green",
    status: "En attente" as const,
    location: "Studio B, intérieur",
    summary: "Expérience scientifique, flammes bleutées, révélations importantes",
    pre_montage: "01:30",
    ett: "02:00",
    time_of_day: "NUIT" as const,
    location_type: "INT" as const
  },
  {
    title: "Premier envol",
    color_id: "orange",
    status: "Validé" as const,
    location: "Extérieur, falaises",
    summary: "Falaises ensoleillées, prototype prend son envol, émerveillement collectif",
    pre_montage: "03:00",
    ett: "02:15",
    time_of_day: "JOUR" as const,
    location_type: "EXT" as const
  }
]

export async function seedSequences(projectId?: string) {
  try {
    console.log('🎬 Ajout des séquences de test...')
    
    let targetProjectId = projectId
    
    // Si pas de project ID fourni, prendre le premier projet disponible
    if (!targetProjectId) {
      const projects = await ProjectsService.getAll()
      if (projects.length === 0) {
        throw new Error('Aucun projet disponible. Créez d\'abord un projet.')
      }
      targetProjectId = projects[0].id
      console.log(`📁 Utilisation du projet: ${projects[0].title} (${projects[0].code})`)
    }
    
    for (const sequenceData of sampleSequences) {
      const newSequence = await SequencesService.create({
        ...sequenceData,
        project_id: targetProjectId
      })
      console.log(`✅ Séquence créée: ${newSequence.code} - ${newSequence.title}`)
    }
    
    console.log('🎉 Toutes les séquences de test ont été ajoutées !')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des séquences:', error)
    return false
  }
}

// Fonction pour supprimer toutes les séquences d'un projet (développement uniquement)
export async function clearSequences(projectId?: string) {
  try {
    const sequences = projectId 
      ? await SequencesService.getByProject(projectId)
      : await SequencesService.getAll()
      
    console.log(`🗑️ Suppression de ${sequences.length} séquences...`)
    
    for (const sequence of sequences) {
      await SequencesService.delete(sequence.id)
      console.log(`🗑️ Supprimé: ${sequence.code}`)
    }
    
    console.log('✅ Toutes les séquences ont été supprimées')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    return false
  }
}

// Fonction pour obtenir des statistiques sur les séquences
export async function getSequencesStats(projectId?: string) {
  try {
    const sequences = projectId 
      ? await SequencesService.getByProject(projectId)
      : await SequencesService.getAll()
    
    const stats = {
      total: sequences.length,
      byStatus: {
        'A validé': sequences.filter(s => s.status === 'A validé').length,
        'En attente': sequences.filter(s => s.status === 'En attente').length,
        'Validé': sequences.filter(s => s.status === 'Validé').length
      },
      byType: {
        'INT': sequences.filter(s => s.location_type === 'INT').length,
        'EXT': sequences.filter(s => s.location_type === 'EXT').length,
        'Non défini': sequences.filter(s => !s.location_type).length
      },
      byTimeOfDay: {
        'JOUR': sequences.filter(s => s.time_of_day === 'JOUR').length,
        'NUIT': sequences.filter(s => s.time_of_day === 'NUIT').length,
        'Non défini': sequences.filter(s => !s.time_of_day).length
      }
    }
    
    return stats
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error)
    return null
  }
}