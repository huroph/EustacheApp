-- Création de la table equipes_techniques
CREATE TABLE IF NOT EXISTS equipes_techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Ingénieur son', 'Opérateur confirmé', 'Assistant', 'Technicien', 'Superviseur')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_equipes_techniques_sequence_id ON equipes_techniques(sequence_id);
CREATE INDEX IF NOT EXISTS idx_equipes_techniques_type ON equipes_techniques(type);
CREATE INDEX IF NOT EXISTS idx_equipes_techniques_nom ON equipes_techniques(nom);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_equipes_techniques_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equipes_techniques_updated_at
    BEFORE UPDATE ON equipes_techniques
    FOR EACH ROW
    EXECUTE FUNCTION update_equipes_techniques_updated_at();