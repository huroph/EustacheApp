// Script de récupération pour nettoyer les projets problématiques
// src/utils/fix-projects.ts

import { supabase } from '@/lib/supabase'

export async function fixProjectCodes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('Utilisateur non connecté')
    return
  }

  try {
    console.log('🔧 Début de la réparation des codes de projets...')

    // 1. Récupérer tous les projets de l'utilisateur
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, code, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Erreur lors de la récupération des projets:', fetchError)
      return
    }

    if (!projects || projects.length === 0) {
      console.log('✅ Aucun projet à réparer')
      return
    }

    console.log(`📋 ${projects.length} projets trouvés`)

    // 2. Renuméroter tous les projets
    const updates = []
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      const newCode = `PRJ-${i + 1}`
      
      if (project.code !== newCode) {
        console.log(`🔄 ${project.title}: ${project.code} → ${newCode}`)
        updates.push({
          id: project.id,
          newCode
        })
      } else {
        console.log(`✅ ${project.title}: ${project.code} (OK)`)
      }
    }

    // 3. Appliquer les mises à jour
    if (updates.length > 0) {
      console.log(`🚀 Application de ${updates.length} mises à jour...`)
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ code: update.newCode })
          .eq('id', update.id)
          .eq('user_id', user.id)

        if (updateError) {
          console.error(`❌ Erreur lors de la mise à jour du projet ${update.id}:`, updateError)
        } else {
          console.log(`✅ Projet ${update.id} mis à jour`)
        }
      }
    }

    console.log('🎉 Réparation des codes de projets terminée!')

  } catch (error) {
    console.error('💥 Erreur lors de la réparation:', error)
  }
}

// Script CLI si exécuté directement
if (typeof window === 'undefined' && process.argv[2] === 'fix-projects') {
  fixProjectCodes().then(() => {
    console.log('Script terminé')
    process.exit(0)
  }).catch(err => {
    console.error('Erreur du script:', err)
    process.exit(1)
  })
}