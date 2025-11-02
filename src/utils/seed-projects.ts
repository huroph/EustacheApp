// Script pour ajouter des projets de test dans Supabase
// src/utils/seed-projects.ts

import { ProjectsService } from '@/lib/services/projects'

export const sampleProjects = [
  {
    title: "Opération Aurora",
    description: "Film d'action futuriste avec des effets spéciaux impressionnants",
    script_file: "Aurora_Script.pdf",
    start_date: "2026-03-10",
    end_date: "2026-05-15",
    status: "En préparation" as const
  },
  {
    title: "Les Sables du Temps",
    description: "Drame historique se déroulant dans le désert",
    script_file: "Sables_Script.pdf", 
    start_date: "2025-09-05",
    end_date: "2025-10-12",
    status: "En cours" as const
  },
  {
    title: "L'Envol du Phénix",
    description: "Film d'aventure sur la reconstruction et l'espoir",
    script_file: "Phoenix_Script.pdf",
    start_date: "2025-02-15", 
    end_date: "2025-04-01",
    status: "Terminé" as const
  }
]

export async function seedProjects() {
  try {
    console.log('🌱 Ajout des projets de test...')
    
    for (const project of sampleProjects) {
      const newProject = await ProjectsService.create(project)
      console.log(`✅ Projet créé: ${newProject.code} - ${newProject.title}`)
    }
    
    console.log('🎉 Tous les projets de test ont été ajoutés !')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des projets:', error)
    return false
  }
}

// Fonction utilitaire pour vider la table (développement uniquement)
export async function clearProjects() {
  try {
    const projects = await ProjectsService.getAll()
    console.log(`🗑️ Suppression de ${projects.length} projets...`)
    
    for (const project of projects) {
      await ProjectsService.delete(project.id)
      console.log(`🗑️ Supprimé: ${project.code}`)
    }
    
    console.log('✅ Tous les projets ont été supprimés')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    return false
  }
}