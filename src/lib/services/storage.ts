// src/lib/services/storage.ts
import { supabase } from '@/lib/supabase'
import { EncryptionService } from './encryption'

export class StorageService {
  /**
   * Upload un fichier PDF chiffré vers Supabase Storage
   */
  static async uploadScriptPDF(file: File, projectId: string): Promise<string> {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    // Chiffrer le fichier
    console.log('Chiffrement du fichier PDF...')
    const encryptedBuffer = await EncryptionService.encryptFile(file, user.id)
    
    const fileName = `${user.id}/${projectId}-script.encrypted`

    // Upload du fichier chiffré vers le bucket 'scripts'
    const { data, error } = await supabase.storage
      .from('scripts')
      .upload(fileName, encryptedBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/octet-stream' // Type générique pour fichier chiffré
      })

    if (error) {
      console.error('Erreur upload script chiffré:', error)
      throw new Error(`Erreur lors de l'upload du script: ${error.message}`)
    }

    // Récupérer l'URL publique (fichier chiffré, donc sécurisé)
    const { data: urlData } = supabase.storage
      .from('scripts')
      .getPublicUrl(fileName)

    console.log('✓ Fichier PDF chiffre et uploade')
    return urlData.publicUrl
  }

  /**
   * Télécharge et déchiffre un script PDF
   */
  static async downloadAndDecryptScript(scriptUrl: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      console.log('Telechargement du fichier chiffre...')
      
      // Télécharger le fichier chiffré
      const response = await fetch(scriptUrl)
      if (!response.ok) {
        throw new Error('Impossible de télécharger le fichier')
      }
      
      const encryptedBuffer = await response.arrayBuffer()
      
      console.log('Dechiffrement du fichier...')
      
      // Créer une URL blob temporaire pour le PDF déchiffré
      const decryptedUrl = await EncryptionService.createDecryptedBlobUrl(encryptedBuffer, user.id)
      
      console.log('✓ Fichier dechiffre et pret a l\'affichage')
      return decryptedUrl
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error)
      throw new Error('Impossible de déchiffrer le fichier. Accès non autorisé.')
    }
  }

  /**
   * Nettoie une URL blob temporaire
   */
  static cleanupBlobUrl(url: string): void {
    if (url.startsWith('blob:')) {
      EncryptionService.revokeObjectUrl(url)
    }
  }

  /**
   * Supprimer un script PDF chiffré
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