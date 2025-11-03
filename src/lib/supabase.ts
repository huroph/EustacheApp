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
          user_id: string
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
          user_id: string
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
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      sequences: {
        Row: {
          id: string
          code: string
          title: string
          project_id: string
          color_id: string | null
          status: 'A validé' | 'En attente' | 'Validé'
          location: string | null
          summary: string | null
          pre_montage: string | null
          ett: string | null
          time_of_day: 'JOUR' | 'NUIT' | null
          location_type: 'INT' | 'EXT' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code?: string
          title: string
          project_id: string
          color_id?: string | null
          status?: 'A validé' | 'En attente' | 'Validé'
          location?: string | null
          summary?: string | null
          pre_montage?: string | null
          ett?: string | null
          time_of_day?: 'JOUR' | 'NUIT' | null
          location_type?: 'INT' | 'EXT' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          project_id?: string
          color_id?: string | null
          status?: 'A validé' | 'En attente' | 'Validé'
          location?: string | null
          summary?: string | null
          pre_montage?: string | null
          ett?: string | null
          time_of_day?: 'JOUR' | 'NUIT' | null
          location_type?: 'INT' | 'EXT' | null
          created_at?: string
          updated_at?: string
        }
      }
      decors: {
        Row: {
          id: string
          sequence_id: string
          title: string
          address: string | null
          location_type: 'Intérieur' | 'Extérieur'
          status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sequence_id: string
          title: string
          address?: string | null
          location_type?: 'Intérieur' | 'Extérieur'
          status?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sequence_id?: string
          title?: string
          address?: string | null
          location_type?: 'Intérieur' | 'Extérieur'
          status?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          created_at?: string
          updated_at?: string
        }
      }
      scenes: {
        Row: {
          id: string
          sequence_id: string
          decor_id: string | null
          numero: string
          status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          description: string | null
          duree_estimee: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sequence_id: string
          decor_id?: string | null
          numero: string
          status?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          description?: string | null
          duree_estimee?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sequence_id?: string
          decor_id?: string | null
          numero?: string
          status?: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
          description?: string | null
          duree_estimee?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client typé
export type SupabaseClient = typeof supabase