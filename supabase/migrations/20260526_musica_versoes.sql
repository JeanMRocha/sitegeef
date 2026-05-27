-- Create musica_versoes table for version management
CREATE TABLE IF NOT EXISTS musica_versoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add versao_id foreign key to musicas table
ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS versao_id UUID REFERENCES musica_versoes(id) ON DELETE SET NULL;

-- Migrate existing versao text data to new structure (optional)
-- This creates entries for existing versions if they don't exist
DO $$
DECLARE
  v_versao TEXT;
  v_id UUID;
BEGIN
  FOR v_versao IN
    SELECT DISTINCT versao FROM musicas WHERE versao IS NOT NULL AND versao <> ''
  LOOP
    INSERT INTO musica_versoes (nome)
    VALUES (v_versao)
    ON CONFLICT (nome) DO NOTHING;
  END LOOP;
END $$;

-- Update musicas.versao_id from existing versao text (if desired)
-- Uncomment to use this:
-- UPDATE musicas m
-- SET versao_id = (SELECT id FROM musica_versoes WHERE nome = m.versao)
-- WHERE m.versao IS NOT NULL AND m.versao_id IS NULL;

-- Add comment for documentation
COMMENT ON TABLE musica_versoes IS 'Catálogo centralizado de versões de músicas';
COMMENT ON COLUMN musica_versoes.nome IS 'Nome/descrição da versão (ex.: "versão de Elizabeth Lacerda")';
