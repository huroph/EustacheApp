-- ==========================================
-- 🔗 MIGRATION POUR LE PARTAGE DE PROJETS
-- ==========================================
-- Cette migration crée la table project_shares pour permettre
-- le partage de projets entre utilisateurs avec des rôles (viewer/editor)

-- ==========================================
-- 1. CRÉER LA TABLE PROJECT_SHARES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.project_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un projet ne peut être partagé qu'une seule fois avec un utilisateur donné
  UNIQUE(project_id, shared_with_user_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_project_shares_project_id ON public.project_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_project_shares_shared_with ON public.project_shares(shared_with_user_id);

-- ==========================================
-- 2. TRIGGER POUR UPDATED_AT
-- ==========================================

CREATE OR REPLACE FUNCTION update_project_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS project_shares_updated_at ON public.project_shares;

CREATE TRIGGER project_shares_updated_at
  BEFORE UPDATE ON public.project_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_project_shares_updated_at();

-- ==========================================
-- 3. ACTIVER RLS SUR PROJECT_SHARES
-- ==========================================

ALTER TABLE public.project_shares ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. POLITIQUES RLS POUR PROJECT_SHARES
-- ==========================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view project shares they own or are shared with" ON public.project_shares;
DROP POLICY IF EXISTS "Project owners can create shares" ON public.project_shares;
DROP POLICY IF EXISTS "Project owners can update shares" ON public.project_shares;
DROP POLICY IF EXISTS "Project owners can delete shares" ON public.project_shares;

-- Politique : Voir les partages où je suis le propriétaire du projet OU le destinataire
CREATE POLICY "Users can view project shares they own or are shared with"
ON public.project_shares FOR SELECT
USING (
  auth.uid() = shared_by_user_id 
  OR 
  auth.uid() = shared_with_user_id
  OR
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_shares.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Seul le propriétaire du projet peut créer des partages
CREATE POLICY "Project owners can create shares"
ON public.project_shares FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_shares.project_id
    AND projects.user_id = auth.uid()
  )
  AND auth.uid() = shared_by_user_id
);

-- Politique : Seul le propriétaire du projet peut modifier les partages
CREATE POLICY "Project owners can update shares"
ON public.project_shares FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_shares.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Seul le propriétaire du projet peut supprimer les partages
CREATE POLICY "Project owners can delete shares"
ON public.project_shares FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_shares.project_id
    AND projects.user_id = auth.uid()
  )
);

-- ==========================================
-- 5. FONCTION HELPER POUR TROUVER UN USER PAR EMAIL
-- ==========================================

-- Cette fonction permet de trouver un utilisateur par son email
-- Elle est utile pour le partage de projets
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec privilèges élevés pour accéder à auth.users
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  RETURN user_uuid;
END;
$$;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION get_user_id_by_email(TEXT) TO authenticated;

-- ==========================================
-- 5B. FONCTION HELPER POUR RÉCUPÉRER L'EMAIL PAR USER ID
-- ==========================================

-- Cette fonction permet de récupérer l'email d'un utilisateur par son ID
CREATE OR REPLACE FUNCTION get_user_email_by_id(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec privilèges élevés pour accéder à auth.users
AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id;
  
  RETURN user_email;
END;
$$;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION get_user_email_by_id(UUID) TO authenticated;

-- ==========================================
-- 6. FONCTION HELPER POUR VÉRIFIER LE RÔLE D'UN USER SUR UN PROJET
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_project_role(p_project_id UUID, p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Vérifier si l'utilisateur est le propriétaire
  IF EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND user_id = p_user_id
  ) THEN
    RETURN 'owner';
  END IF;
  
  -- Vérifier si l'utilisateur a un partage
  SELECT role INTO user_role
  FROM public.project_shares
  WHERE project_id = p_project_id AND shared_with_user_id = p_user_id;
  
  RETURN COALESCE(user_role, 'none');
END;
$$;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION get_user_project_role(UUID, UUID) TO authenticated;

-- ==========================================
-- 7. VÉRIFICATION POST-MIGRATION
-- ==========================================

-- Vérifier que la table est créée
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'project_shares') as column_count
FROM information_schema.tables
WHERE table_name = 'project_shares';

-- Vérifier que RLS est activé
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'project_shares') as policy_count
FROM pg_tables
WHERE tablename = 'project_shares';

-- ==========================================
-- 🎉 MIGRATION TERMINÉE
-- ==========================================
-- 
-- ✅ Table project_shares créée
-- ✅ RLS activé avec politiques de sécurité
-- ✅ Fonctions helper pour email lookup et vérification de rôle
-- ✅ Contraintes d'unicité pour éviter les doublons
-- 
-- Prochaines étapes:
-- 1. Exécuter cette migration dans Supabase SQL Editor
-- 2. Créer le service ProjectSharesService
-- 3. Créer l'interface de partage dans l'application
-- 
-- ==========================================
