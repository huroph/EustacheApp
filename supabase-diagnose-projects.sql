-- Script de diagnostic et nettoyage pour les projets
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier l'état actuel des projets
SELECT 
  user_id,
  code,
  title,
  created_at,
  COUNT(*) OVER (PARTITION BY code) as code_duplicates,
  COUNT(*) OVER (PARTITION BY user_id, code) as user_code_duplicates
FROM projects 
ORDER BY user_id, created_at;

-- 2. Vérifier les contraintes existantes
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass;

-- 3. Supprimer tous les projets avec des codes problématiques (ATTENTION: SAUVEGARDE D'ABORD!)
-- UNCOMMENT ONLY IF YOU WANT TO CLEAN UP:
-- DELETE FROM projects WHERE code IS NULL OR code = '';

-- 4. Renuméroter manuellement tous les projets existants par utilisateur
-- (Alternative sûre : faire la renumérotation manuellement)
WITH numbered_projects AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_number
  FROM projects
)
SELECT 
  id,
  user_id,
  'PRJ-' || new_number as suggested_new_code
FROM numbered_projects
ORDER BY user_id, new_number;

-- 5. Si tout semble correct, appliquer la renumérotation :
-- UNCOMMENT TO APPLY (DANGER: TEST FIRST):
/*
WITH numbered_projects AS (
  SELECT 
    id,
    user_id,
    'PRJ-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_code
  FROM projects
)
UPDATE projects 
SET code = numbered_projects.new_code
FROM numbered_projects
WHERE projects.id = numbered_projects.id;
*/