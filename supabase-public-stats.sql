-- Fonction SQL publique pour obtenir les statistiques globales
-- À exécuter dans Supabase SQL Editor

-- Créer une fonction publique qui contourne RLS pour les statistiques
CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec les privilèges du propriétaire de la fonction
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