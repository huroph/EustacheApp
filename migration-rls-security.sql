-- ==========================================
-- 🔐 MIGRATION RLS POUR EUSTACHEAPP
-- ==========================================
-- Ce script active Row Level Security et crée les politiques de sécurité
-- À exécuter dans Supabase SQL Editor

-- ==========================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ==========================================

-- Activer RLS pour projects (OBLIGATOIRE - données sensibles)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Activer RLS pour sequences 
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

-- Activer RLS pour roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Activer RLS pour les autres tables (si elles existent)
ALTER TABLE IF EXISTS costumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS accessoires ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS effets_speciaux ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. POLITIQUES POUR LA TABLE PROJECTS
-- ==========================================

-- Politique : Un utilisateur ne peut voir que SES projets
CREATE POLICY "Users can view own projects" 
ON projects FOR SELECT 
USING (auth.uid() = user_id);

-- Politique : Un utilisateur ne peut créer que SES projets
CREATE POLICY "Users can insert own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique : Un utilisateur ne peut modifier que SES projets
CREATE POLICY "Users can update own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Politique : Un utilisateur ne peut supprimer que SES projets
CREATE POLICY "Users can delete own projects" 
ON projects FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 3. POLITIQUES POUR LA TABLE SEQUENCES
-- ==========================================

-- Politique : Un utilisateur ne peut voir que les séquences de SES projets
CREATE POLICY "Users can view sequences of own projects" 
ON sequences FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = sequences.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut créer des séquences que dans SES projets
CREATE POLICY "Users can insert sequences in own projects" 
ON sequences FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = sequences.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut modifier que les séquences de SES projets
CREATE POLICY "Users can update sequences in own projects" 
ON sequences FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = sequences.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut supprimer que les séquences de SES projets
CREATE POLICY "Users can delete sequences in own projects" 
ON sequences FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = sequences.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- ==========================================
-- 4. POLITIQUES POUR LA TABLE ROLES
-- ==========================================

-- Politique : Un utilisateur ne peut voir que les rôles des séquences de SES projets
CREATE POLICY "Users can view roles of own sequences" 
ON roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = roles.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut créer des rôles que dans SES séquences
CREATE POLICY "Users can insert roles in own sequences" 
ON roles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = roles.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut modifier que les rôles de SES séquences
CREATE POLICY "Users can update roles in own sequences" 
ON roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = roles.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Politique : Un utilisateur ne peut supprimer que les rôles de SES séquences
CREATE POLICY "Users can delete roles in own sequences" 
ON roles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = roles.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- ==========================================
-- 5. POLITIQUES POUR LES AUTRES TABLES (Costumes, Décors, etc.)
-- ==========================================

-- Template pour costumes (répéter pour les autres tables)
CREATE POLICY "Users can manage costumes in own sequences" 
ON costumes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = costumes.sequence_id 
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = costumes.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Template pour decors
CREATE POLICY "Users can manage decors in own sequences" 
ON decors FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = decors.sequence_id 
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = decors.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Template pour scenes
CREATE POLICY "Users can manage scenes in own sequences" 
ON scenes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = scenes.sequence_id 
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = scenes.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Template pour accessoires
CREATE POLICY "Users can manage accessoires in own sequences" 
ON accessoires FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = accessoires.sequence_id 
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = accessoires.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- Template pour effets_speciaux
CREATE POLICY "Users can manage effets_speciaux in own sequences" 
ON effets_speciaux FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = effets_speciaux.sequence_id 
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sequences 
    JOIN projects ON sequences.project_id = projects.id 
    WHERE sequences.id = effets_speciaux.sequence_id 
    AND projects.user_id = auth.uid()
  )
);

-- ==========================================
-- 6. FONCTION PUBLIQUE POUR LES STATISTIQUES
-- ==========================================

-- Créer une fonction qui contourne RLS pour les stats publiques
CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec les privilèges du propriétaire (contourne RLS)
AS $$
DECLARE
  result json;
  project_count integer;
  sequence_count integer;
  role_count integer;
  user_count integer;
BEGIN
  -- Compter les projets (avec privilèges élevés, contourne RLS)
  SELECT COUNT(*) INTO project_count FROM projects;
  
  -- Compter les séquences
  SELECT COUNT(*) INTO sequence_count FROM sequences;
  
  -- Compter les rôles
  SELECT COUNT(*) INTO role_count FROM roles;
  
  -- Compter les utilisateurs uniques
  SELECT COUNT(DISTINCT user_id) INTO user_count 
  FROM projects 
  WHERE user_id IS NOT NULL;
  
  -- Construire le résultat JSON
  result := json_build_object(
    'totalProjects', project_count,
    'totalSequences', sequence_count,
    'totalRoles', role_count,
    'totalUsers', user_count
  );
  
  RETURN result;
END;
$$;

-- Donner les permissions publiques à la fonction
GRANT EXECUTE ON FUNCTION get_public_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_public_stats() TO authenticated;

-- ==========================================
-- 7. AJOUTER LA COLONNE USER_ID SI MANQUANTE
-- ==========================================

-- Ajouter user_id aux projets si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
    
    -- Créer un utilisateur par défaut pour les projets orphelins (optionnel)
    -- UPDATE projects SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
    -- WHERE user_id IS NULL;
  END IF;
END $$;

-- ==========================================
-- 8. VÉRIFICATIONS POST-MIGRATION
-- ==========================================

-- Vérifier que RLS est activé sur toutes les tables importantes
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'sequences', 'roles', 'costumes', 'decors', 'scenes', 'accessoires', 'effets_speciaux')
ORDER BY tablename;

-- Tester la fonction publique des stats
SELECT get_public_stats();

-- ==========================================
-- 🎉 MIGRATION TERMINÉE
-- ==========================================
-- 
-- ✅ RLS activé sur toutes les tables
-- ✅ Politiques de sécurité créées
-- ✅ Isolation des données par utilisateur
-- ✅ Fonction publique pour les statistiques
-- 
-- ⚠️  IMPORTANT : 
-- - Après cette migration, les utilisateurs ne verront que LEURS données
-- - Testez avec un utilisateur connecté
-- - Les stats publiques fonctionneront via get_public_stats()
-- 
-- ==========================================