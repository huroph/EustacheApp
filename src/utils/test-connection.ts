// src/utils/test-connection.ts
import { supabase } from '@/lib/supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Test de connexion Supabase...')
    
    // Test 1: Vérifier la connexion de base
    const { data: healthCheck, error: healthError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)

    if (healthError) {
      console.error('❌ Erreur de connexion:', healthError)
      return false
    }

    console.log('✅ Connexion Supabase OK')

    // Test 2: Vérifier les tables existent
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)

    if (projectsError) {
      console.error('❌ Erreur table projects:', projectsError)
      return false
    }

    console.log('✅ Table projects accessible')

    const { data: sequences, error: sequencesError } = await supabase
      .from('sequences')
      .select('*')
      .limit(1)

    if (sequencesError) {
      console.error('❌ Erreur table sequences:', sequencesError)
      return false
    }

    console.log('✅ Table sequences accessible')

    // Test 3: Compter les données existantes
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    const { count: sequenceCount } = await supabase
      .from('sequences')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Données actuelles: ${projectCount || 0} projets, ${sequenceCount || 0} séquences`)

    return true
  } catch (error) {
    console.error('💥 Erreur globale:', error)
    return false
  }
}

// Test direct si exécuté comme script
if (typeof window === 'undefined') {
  testSupabaseConnection()
}