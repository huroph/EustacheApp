// Configuration du client Supabase
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Types pour TypeScript (seront étendus plus tard)
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          script_file: string | null
          start_date: string | null
          end_date: string | null
          cover_url: string | null
          status: 'En préparation' | 'En cours' | 'Terminé' | 'Archivé'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code?: string
          title: string
          description?: string | null
          script_file?: string | null
          start_date?: string | null
          end_date?: string | null
          cover_url?: string | null
          status?: 'En préparation' | 'En cours' | 'Terminé' | 'Archivé'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          script_file?: string | null
          start_date?: string | null
          end_date?: string | null
          cover_url?: string | null
          status?: 'En préparation' | 'En cours' | 'Terminé' | 'Archivé'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client typé
export type SupabaseClient = typeof supabase