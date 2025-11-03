// src/lib/services/encryption.ts
import { supabase } from '@/lib/supabase'

/**
 * Service de chiffrement simple pour les scripts PDF
 * Utilise Web Crypto API avec une clé dérivée de l'ID utilisateur
 */
export class EncryptionService {
  /**
   * Génère une clé de chiffrement unique pour l'utilisateur
   */
  private static async getUserEncryptionKey(userId: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userId + 'eustache-script-key'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('eustache-salt-2024'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Chiffre un fichier PDF
   */
  static async encryptFile(file: File, userId: string): Promise<ArrayBuffer> {
    const key = await this.getUserEncryptionKey(userId)
    const iv = crypto.getRandomValues(new Uint8Array(12)) // 12 bytes pour AES-GCM
    
    const fileBuffer = await file.arrayBuffer()
    
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      fileBuffer
    )

    // Combiner IV + données chiffrées
    const combinedBuffer = new ArrayBuffer(iv.length + encryptedData.byteLength)
    const combinedArray = new Uint8Array(combinedBuffer)
    combinedArray.set(iv, 0)
    combinedArray.set(new Uint8Array(encryptedData), iv.length)

    return combinedBuffer
  }

  /**
   * Déchiffre un fichier PDF
   */
  static async decryptFile(encryptedBuffer: ArrayBuffer, userId: string): Promise<ArrayBuffer> {
    const key = await this.getUserEncryptionKey(userId)
    
    // Extraire IV (12 premiers bytes) et données chiffrées
    const iv = encryptedBuffer.slice(0, 12)
    const encryptedData = encryptedBuffer.slice(12)

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedData
    )

    return decryptedData
  }

  /**
   * Crée un blob URL temporaire pour afficher le PDF déchiffré
   */
  static async createDecryptedBlobUrl(encryptedBuffer: ArrayBuffer, userId: string): Promise<string> {
    const decryptedBuffer = await this.decryptFile(encryptedBuffer, userId)
    const blob = new Blob([decryptedBuffer], { type: 'application/pdf' })
    return URL.createObjectURL(blob)
  }

  /**
   * Nettoie les URLs temporaires
   */
  static revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}