-- Migration pour corriger la numérotation des projets
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Supprimer l'ancien trigger qui cause les conflits
DROP TRIGGER IF EXISTS trigger_generate_project_code ON projects;
DROP FUNCTION IF EXISTS generate_project_code();

-- 2. Modifier la contrainte unique pour inclure user_id
-- (permettre à chaque utilisateur d'avoir ses propres PRJ-1, PRJ-2, etc.)
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_code_key;
ALTER TABLE projects ADD CONSTRAINT projects_code_user_unique UNIQUE (code, user_id);

-- 3. Optionnel: Renuméroter les projets existants par utilisateur
-- Cette partie sera gérée automatiquement par le code client lors du prochain refresh

-- 4. Note: Le trigger pour les séquences reste actif mais sera remplacé
-- par la logique client dans une prochaine étape

-- Vérification
SELECT 
  user_id,
  code,
  title,
  created_at
FROM projects 
ORDER BY user_id, created_at;