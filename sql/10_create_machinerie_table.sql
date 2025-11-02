-- Table pour la machinerie
CREATE TABLE IF NOT EXISTS machinerie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  statut VARCHAR(20) NOT NULL CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
  referent_id UUID REFERENCES equipes_techniques(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_machinerie_sequence_id ON machinerie(sequence_id);
CREATE INDEX IF NOT EXISTS idx_machinerie_statut ON machinerie(statut);
CREATE INDEX IF NOT EXISTS idx_machinerie_referent_id ON machinerie(referent_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_machinerie_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_machinerie_updated_at
  BEFORE UPDATE ON machinerie
  FOR EACH ROW
  EXECUTE FUNCTION update_machinerie_updated_at();