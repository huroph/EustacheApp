-- Scripts SQL pour créer les tables Supabase
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Table projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  script_file VARCHAR(255),
  start_date DATE,
  end_date DATE,
  cover_url VARCHAR(500),
  status VARCHAR(50) CHECK (status IN ('En préparation', 'En cours', 'Terminé', 'Archivé')) DEFAULT 'En préparation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Table sequences
CREATE TABLE IF NOT EXISTS sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  color_id VARCHAR(50),
  status VARCHAR(50) CHECK (status IN ('A validé', 'En attente', 'Validé')) DEFAULT 'En attente',
  location VARCHAR(255),
  summary TEXT,
  pre_montage VARCHAR(50),
  ett VARCHAR(50),
  time_of_day VARCHAR(50) CHECK (time_of_day IN ('JOUR', 'NUIT')),
  location_type VARCHAR(50) CHECK (location_type IN ('INT', 'EXT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(code, project_id)
);

-- 3. Fonctions pour auto-génération des codes

-- Fonction pour générer le code projet
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'PRJ-' || LPAD((
      SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM 5) AS INTEGER)), 0) + 1
      FROM projects 
      WHERE code ~ '^PRJ-[0-9]+$'
    )::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer le code séquence
CREATE OR REPLACE FUNCTION generate_sequence_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'SEQ-' || LPAD((
      SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM 5) AS INTEGER)), 0) + 1
      FROM sequences 
      WHERE project_id = NEW.project_id
      AND code ~ '^SEQ-[0-9]+$'
    )::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Triggers
CREATE TRIGGER trigger_generate_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION generate_project_code();

CREATE TRIGGER trigger_generate_sequence_code
  BEFORE INSERT ON sequences
  FOR EACH ROW
  EXECUTE FUNCTION generate_sequence_code();

-- 5. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sequences_updated_at
  BEFORE UPDATE ON sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Activer RLS (Row Level Security) - optionnel pour plus tard
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

-- 7. Politique d'accès public temporaire (à modifier plus tard avec auth)
-- CREATE POLICY "Public access" ON projects FOR ALL USING (true);
-- CREATE POLICY "Public access" ON sequences FOR ALL USING (true);