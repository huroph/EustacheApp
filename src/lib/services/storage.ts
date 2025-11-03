// src/lib/services/storage.ts
import { supabase } from '@/lib/supabase'

export class StorageService {
  /**
   * Upload un fichier PDF vers Supabase Storage
   */
  static async uploadScriptPDF(file: File, projectId: string): Promise<string> {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${projectId}-script.${fileExt}`

    // Upload vers le bucket 'scripts'
    const { data, error } = await supabase.storage
      .from('scripts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Remplace le fichier existant
      })

    if (error) {
      console.error('Erreur upload script:', error)
      throw new Error(`Erreur lors de l'upload du script: ${error.message}`)
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from('scripts')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  /**
   * Supprimer un script PDF
   */
  static async deleteScriptPDF(scriptUrl: string): Promise<void> {
    // Extraire le path depuis l'URL
    const url = new URL(scriptUrl)
    const pathParts = url.pathname.split('/scripts/')
    const path = pathParts[1]

    if (!path) return

    const { error } = await supabase.storage
      .from('scripts')
      .remove([path])

    if (error) {
      console.error('Erreur suppression script:', error)
      throw new Error(`Erreur lors de la suppression du script: ${error.message}`)
    }
  }

  /**
   * Vérifier si un fichier est un PDF valide
   */
  static validatePDFFile(file: File): string | null {
    if (!file.type.includes('pdf')) {
      return 'Le fichier doit être au format PDF'
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      return 'Le fichier doit faire moins de 10MB'
    }

    return null
  }
}