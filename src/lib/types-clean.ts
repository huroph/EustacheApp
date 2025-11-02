// Types de base pour l'application EustacheApp
// Préparation pour l'intégration Supabase

export interface Sequence {
  id: string
  titre: string
  description?: string
  duree_estimee?: number
  lieu?: string
  moment_journee?: string
  interieur_exterieur?: string
  notes?: string
  created_at?: string
}

export interface Role {
  id: string
  type: 'Principale' | 'Secondaire' | 'Figurant' | 'Voix Off'
  nomRole: string
  interpreteNom: string
  interpretePrenom: string
  genre: 'Masculin' | 'Féminin' | 'Autre'
  agePersonnage: string
  apparence: string
  description: string
  notesSequence: string
  // Contact
  adresse: string
  email: string
  telephone: string
  // Doublure
  doublureNom?: string
  doublurePrenom?: string
  doublureType?: 'Image' | 'Voix' | 'Cascades'
  doublureAdresse?: string
  doublureEmail?: string
  doublureTelephone?: string
  doublureNotes?: string
  createdAt: Date
}

export interface Costume {
  id: string
  nomCostume: string
  roleId?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notesCostume: string
  createdAt: Date
}

export interface Decor {
  id: string
  title: string
  address: string
  manoir: 'Intérieur' | 'Extérieur'
  status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  createdAt: Date
}

export interface Scene {
  id: string
  numero: string
  decorId: string // Lié au décor
  status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  description?: string
  dureeEstimee?: string
  createdAt: Date
}

export interface Accessoire {
  id: string
  nomAccessoire: string
  roleId?: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notesAccessoire: string
  createdAt: Date
}

export interface EffetSpecial {
  id: string
  nom: string
  statut: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
  description: string
  createdAt: Date
}

export interface EquipeTechnique {
  id: string
  nom: string
  prenom: string
  type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
  sequences: string[]
  notes: string
  createdAt: Date
}

export interface MaterielSon {
  id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referentId: string
  notes: string
  createdAt: Date
}

export interface Machinerie {
  id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referentId: string
  notes: string
  createdAt: Date
}

export interface SequenceFormData {
  code: string
  title: string
  colorId: string
  status: string
  location: string
  summary: string
  preMintage: string
  ett: string
  effet: string
  type: string
}

// Fonctions utilitaires
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Types pour les formulaires
export type CreateSequenceData = Omit<Sequence, 'id' | 'created_at'>
export type CreateRoleData = Omit<Role, 'id' | 'created_at'>
export type CreateCostumeData = Omit<Costume, 'id' | 'created_at'>
export type CreateDecorData = Omit<Decor, 'id' | 'created_at'>
export type CreateSceneData = Omit<Scene, 'id' | 'created_at'>