// Seed simple pour créer des données de test
// src/utils/seed-complete-sequence.ts

import { supabase } from '@/lib/supabase'

// Fonction pour générer un code unique
function generateUniqueCode() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 5)
  return `SEQ-${timestamp}-${random}`.toUpperCase()
}

// Données de test simples
export const demoData = {
  sequence: {
    title: "Séquence de Démonstration - La Révélation",
    code: generateUniqueCode(), // Code unique généré dynamiquement
    color_id: "blue", 
    status: "En attente",
    location: "Manoir Dubois - Salon principal",
    summary: "Dans le salon feutré du manoir, Marie découvre la vérité sur son héritage familial.",
    pre_montage: "2:45",
    ett: "1h30",
    time_of_day: "JOUR",
    location_type: "INT"
  },
  role: {
    type: "Principale",
    nom_role: "Marie Dubois", 
    interprete_nom: "Dupont",
    interprete_prenom: "Sophie",
    genre: "Féminin",
    age_personnage: "25-30 ans",
    apparence: "Cheveux châtains, yeux verts",
    description: "Héritière du manoir, personnage principal",
    notes_sequence: "Attention aux jeux de lumière pour les gros plans",
    adresse: "12 rue des Lilas, 75015 Paris",
    email: "sophie.dupont@email.com",
    telephone: "06 12 34 56 78"
  },
  costume: {
    nom_costume: "Robe de jour élégante années 1920",
    statut: "Validé",
    notes_costume: "Couleur bordeaux, style Art Déco"
  },
  accessoire: {
    nom_accessoire: "Lettre manuscrite ancienne", 
    statut: "En attente",
    notes_accessoire: "Papier vieilli, encre sépia"
  },
  effetSpecial: {
    nom: "Jeu de lumières dramatiques",
    description: "Effets d'ombres et de lumière traversant les rideaux. Utiliser des gélatines dorées.",
    statut: "A validé"
  },
  equipeTechnique: {
    prenom: "Jean",
    nom: "Martin", 
    type: "Ingénieur son",
    notes: "Spécialiste des éclairages d'époque - Validé"
  },
  materielSon: {
    nom: "Micro-cravate sans fil",
    statut: "Validé", 
    notes: "Pour dialogue intime"
  },
  machinerie: {
    nom: "Dolly + rails",
    statut: "En attente",
    notes: "Pour travelling d'approche"
  }
}

/**
 * Créer une séquence complète avec toutes les données de test
 */
export async function seedCompleteSequence(projectId: string): Promise<{ success: boolean, sequenceId?: string, error?: string }> {
  try {
    console.log('🎬 Création séquence de démonstration...')

    // Générer des données avec un code unique
    const sequenceData = {
      ...demoData.sequence,
      code: generateUniqueCode(),
      project_id: projectId
    }

    // 1. Créer la séquence
    const { data: sequence, error: seqError } = await supabase
      .from('sequences')
      .insert([sequenceData])
      .select()
      .single()

    if (seqError) throw new Error(`Erreur séquence: ${seqError.message}`)
    console.log('✅ Séquence créée:', sequence.id, 'Code:', sequenceData.code)

    // 2. Créer le rôle  
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert([{
        sequence_id: sequence.id,
        ...demoData.role
      }])
      .select()
      .single()

    if (roleError) throw new Error(`Erreur rôle: ${roleError.message}`)
    console.log('✅ Rôle créé:', role.id)

    // 3. Créer le costume
    const { error: costumeError } = await supabase
      .from('costumes')
      .insert([{
        sequence_id: sequence.id,
        role_id: role.id,
        ...demoData.costume
      }])

    if (costumeError) throw new Error(`Erreur costume: ${costumeError.message}`)
    console.log('✅ Costume créé')

    // 4. Créer l'accessoire
    const { error: accessoireError } = await supabase
      .from('accessoires')
      .insert([{
        sequence_id: sequence.id,
        role_id: role.id,
        ...demoData.accessoire
      }])

    if (accessoireError) throw new Error(`Erreur accessoire: ${accessoireError.message}`)
    console.log('✅ Accessoire créé')

    // 5. Créer l'effet spécial
    const { error: effetError } = await supabase
      .from('effets_speciaux')
      .insert([{
        sequence_id: sequence.id,
        ...demoData.effetSpecial
      }])

    if (effetError) throw new Error(`Erreur effet: ${effetError.message}`)
    console.log('✅ Effet spécial créé')

    // 6. Créer l'équipe technique
    const { data: equipe, error: equipeError } = await supabase
      .from('equipes_techniques')
      .insert([{
        sequence_id: sequence.id,
        ...demoData.equipeTechnique
      }])
      .select()
      .single()

    if (equipeError) throw new Error(`Erreur équipe: ${equipeError.message}`)
    console.log('✅ Équipe technique créée:', equipe.id)

    // 7. Créer le matériel son
    const { error: sonError } = await supabase
      .from('materiel_son')
      .insert([{
        sequence_id: sequence.id,
        referent_id: equipe.id,
        ...demoData.materielSon
      }])

    if (sonError) throw new Error(`Erreur son: ${sonError.message}`)
    console.log('✅ Matériel son créé')

    // 8. Créer la machinerie
    const { error: machinerieError } = await supabase
      .from('machinerie')
      .insert([{
        sequence_id: sequence.id,
        referent_id: equipe.id,
        ...demoData.machinerie
      }])

    if (machinerieError) throw new Error(`Erreur machinerie: ${machinerieError.message}`)
    console.log('✅ Machinerie créée')

    console.log('🎉 Séquence complète créée avec succès!')
    return {
      success: true,
      sequenceId: sequence.id
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}
