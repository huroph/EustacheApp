import { supabase } from '@/lib/supabase'
import { Role } from '@/lib/types-clean'
import { SupabaseRole, CreateRoleData } from '@/hooks/useRoles'

/**
 * Service pour gérer les opérations CRUD des rôles
 * Gère la conversion entre les types Supabase et les types de l'interface
 */

// Adaptateur : Supabase → Interface
export const adaptSupabaseToRole = (supabaseRole: SupabaseRole): Role => ({
  id: supabaseRole.id,
  type: supabaseRole.type,
  nomRole: supabaseRole.nom_role,
  interpreteNom: supabaseRole.interprete_nom,
  interpretePrenom: supabaseRole.interprete_prenom,
  genre: supabaseRole.genre,
  agePersonnage: supabaseRole.age_personnage || '',
  apparence: supabaseRole.apparence || '',
  description: supabaseRole.description || '',
  notesSequence: supabaseRole.notes_sequence || '',
  adresse: supabaseRole.adresse || '',
  email: supabaseRole.email || '',
  telephone: supabaseRole.telephone || '',
  doublureNom: supabaseRole.doublure_nom,
  doublurePrenom: supabaseRole.doublure_prenom,
  doublureType: supabaseRole.doublure_type,
  doublureAdresse: supabaseRole.doublure_adresse,
  doublureEmail: supabaseRole.doublure_email,
  doublureTelephone: supabaseRole.doublure_telephone,
  doublureNotes: supabaseRole.doublure_notes,
  createdAt: new Date(supabaseRole.created_at)
})

// Adaptateur : Interface → Supabase
export const adaptRoleToSupabase = (
  role: Omit<Role, 'id' | 'createdAt'>, 
  sequenceId: string
): CreateRoleData => ({
  sequence_id: sequenceId,
  type: role.type,
  nom_role: role.nomRole,
  interprete_nom: role.interpreteNom,
  interprete_prenom: role.interpretePrenom,
  genre: role.genre,
  age_personnage: role.agePersonnage || undefined,
  apparence: role.apparence || undefined,
  description: role.description || undefined,
  notes_sequence: role.notesSequence || undefined,
  adresse: role.adresse || undefined,
  email: role.email || undefined,
  telephone: role.telephone || undefined,
  doublure_nom: role.doublureNom || undefined,
  doublure_prenom: role.doublurePrenom || undefined,
  doublure_type: role.doublureType || undefined,
  doublure_adresse: role.doublureAdresse || undefined,
  doublure_email: role.doublureEmail || undefined,
  doublure_telephone: role.doublureTelephone || undefined,
  doublure_notes: role.doublureNotes || undefined
})

export class RolesService {
  /**
   * Récupérer tous les rôles d'une séquence
   */
  static async getRolesBySequence(sequenceId: string): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Erreur lors de la récupération des rôles: ${error.message}`)
    }

    return (data || []).map(adaptSupabaseToRole)
  }

  /**
   * Récupérer un rôle par son ID
   */
  static async getRoleById(roleId: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Rôle non trouvé
      }
      throw new Error(`Erreur lors de la récupération du rôle: ${error.message}`)
    }

    return data ? adaptSupabaseToRole(data) : null
  }

  /**
   * Créer un nouveau rôle
   */
  static async createRole(
    roleData: Omit<Role, 'id' | 'createdAt'>, 
    sequenceId: string
  ): Promise<Role> {
    const supabaseData = adaptRoleToSupabase(roleData, sequenceId)

    const { data, error } = await supabase
      .from('roles')
      .insert([supabaseData])
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la création du rôle: ${error.message}`)
    }

    return adaptSupabaseToRole(data)
  }

  /**
   * Mettre à jour un rôle
   */
  static async updateRole(
    roleId: string, 
    updates: Partial<Omit<Role, 'id' | 'createdAt'>>
  ): Promise<Role> {
    // Convertir les updates vers le format Supabase
    const supabaseUpdates: any = {}
    
    if (updates.type !== undefined) supabaseUpdates.type = updates.type
    if (updates.nomRole !== undefined) supabaseUpdates.nom_role = updates.nomRole
    if (updates.interpreteNom !== undefined) supabaseUpdates.interprete_nom = updates.interpreteNom
    if (updates.interpretePrenom !== undefined) supabaseUpdates.interprete_prenom = updates.interpretePrenom
    if (updates.genre !== undefined) supabaseUpdates.genre = updates.genre
    if (updates.agePersonnage !== undefined) supabaseUpdates.age_personnage = updates.agePersonnage
    if (updates.apparence !== undefined) supabaseUpdates.apparence = updates.apparence
    if (updates.description !== undefined) supabaseUpdates.description = updates.description
    if (updates.notesSequence !== undefined) supabaseUpdates.notes_sequence = updates.notesSequence
    if (updates.adresse !== undefined) supabaseUpdates.adresse = updates.adresse
    if (updates.email !== undefined) supabaseUpdates.email = updates.email
    if (updates.telephone !== undefined) supabaseUpdates.telephone = updates.telephone
    if (updates.doublureNom !== undefined) supabaseUpdates.doublure_nom = updates.doublureNom
    if (updates.doublurePrenom !== undefined) supabaseUpdates.doublure_prenom = updates.doublurePrenom
    if (updates.doublureType !== undefined) supabaseUpdates.doublure_type = updates.doublureType
    if (updates.doublureAdresse !== undefined) supabaseUpdates.doublure_adresse = updates.doublureAdresse
    if (updates.doublureEmail !== undefined) supabaseUpdates.doublure_email = updates.doublureEmail
    if (updates.doublureTelephone !== undefined) supabaseUpdates.doublure_telephone = updates.doublureTelephone
    if (updates.doublureNotes !== undefined) supabaseUpdates.doublure_notes = updates.doublureNotes

    const { data, error } = await supabase
      .from('roles')
      .update(supabaseUpdates)
      .eq('id', roleId)
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du rôle: ${error.message}`)
    }

    return adaptSupabaseToRole(data)
  }

  /**
   * Supprimer un rôle
   */
  static async deleteRole(roleId: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (error) {
      throw new Error(`Erreur lors de la suppression du rôle: ${error.message}`)
    }
  }

  /**
   * Supprimer tous les rôles d'une séquence
   */
  static async deleteRolesBySequence(sequenceId: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors de la suppression des rôles de la séquence: ${error.message}`)
    }
  }

  /**
   * Compter les rôles d'une séquence par type
   */
  static async countRolesByType(sequenceId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('roles')
      .select('type')
      .eq('sequence_id', sequenceId)

    if (error) {
      throw new Error(`Erreur lors du comptage des rôles: ${error.message}`)
    }

    const counts: Record<string, number> = {
      'Principale': 0,
      'Secondaire': 0,
      'Figurant': 0,
      'Voix Off': 0
    }

    data.forEach(role => {
      counts[role.type] = (counts[role.type] || 0) + 1
    })

    return counts
  }
}