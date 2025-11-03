-- Migration pour ajouter user_id aux projets et préparer le partage
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter la colonne user_id à la table projects
ALTER TABLE projects 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Mettre à jour les projets existants (optionnel - à adapter selon vos besoins)
-- Si vous voulez assigner tous les projets existants à un utilisateur spécifique :
-- UPDATE projects SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;

-- 3. Rendre la colonne obligatoire après avoir mis à jour les données existantes
-- ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;

-- 4. Créer un index pour améliorer les performances des requêtes par user_id
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- 5. Politique RLS (Row Level Security) pour sécuriser l'accès aux données
-- Activer RLS sur la table projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour que les utilisateurs ne voient que leurs propres projets
CREATE POLICY "Users can only see their own projects" ON projects
    FOR ALL USING (auth.uid() = user_id);

-- Créer une politique pour que les utilisateurs ne puissent insérer que des projets avec leur propre user_id
CREATE POLICY "Users can only insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. STRUCTURE ANTICIPÉE POUR LE PARTAGE DE PROJETS
-- Cette table permettra de partager des projets avec différents niveaux d'accès

CREATE TABLE project_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('editor', 'reader')),
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un utilisateur ne peut avoir qu'un seul rôle par projet
    UNIQUE(project_id, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_project_shares_project_id ON project_shares(project_id);
CREATE INDEX idx_project_shares_user_id ON project_shares(user_id);

-- RLS pour project_shares
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;

-- Les propriétaires de projets peuvent voir tous les partages de leurs projets
CREATE POLICY "Project owners can manage shares" ON project_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_shares.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Les utilisateurs peuvent voir leurs propres partages
CREATE POLICY "Users can see their own shares" ON project_shares
    FOR SELECT USING (user_id = auth.uid());

-- MISE À JOUR DES POLITIQUES PROJETS POUR INCLURE LE PARTAGE
-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Users can only see their own projects" ON projects;

-- Nouvelle politique qui inclut les projets partagés
CREATE POLICY "Users can see owned and shared projects" ON projects
    FOR SELECT USING (
        user_id = auth.uid() -- Projets possédés
        OR 
        EXISTS ( -- Projets partagés
            SELECT 1 FROM project_shares 
            WHERE project_shares.project_id = projects.id 
            AND project_shares.user_id = auth.uid()
        )
    );

-- Politique pour la modification (seuls propriétaires et éditeurs)
CREATE POLICY "Users can update owned projects or shared with editor role" ON projects
    FOR UPDATE USING (
        user_id = auth.uid() -- Propriétaire
        OR 
        EXISTS ( -- Éditeur
            SELECT 1 FROM project_shares 
            WHERE project_shares.project_id = projects.id 
            AND project_shares.user_id = auth.uid()
            AND project_shares.role = 'editor'
        )
    );

-- Politique pour la suppression (seuls propriétaires)
CREATE POLICY "Users can delete only owned projects" ON projects
    FOR DELETE USING (user_id = auth.uid());