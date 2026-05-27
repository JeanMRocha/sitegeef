-- ============================================================================
-- MIGRATIONS DE MÚSICA - APLICAR NO SUPABASE SQL EDITOR
-- ============================================================================
--
-- Para aplicar estas migrations:
-- 1. Acesse https://app.supabase.com
-- 2. Selecione o projeto GEEF
-- 3. Vá para SQL Editor
-- 4. Clique em "+ New query"
-- 5. Copie e cole TUDO abaixo
-- 6. Clique em "RUN"
-- 7. Espere completar (deve aparecer "✓ Success")
-- 8. Volte ao navegador e recarregue (F5)
-- 9. Teste criar uma nova versão - deve funcionar!

-- ============================================================================
-- MIGRATION 1: Criar tabela musica_versoes
-- ============================================================================

CREATE TABLE IF NOT EXISTS musica_versoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS versao_id UUID REFERENCES musica_versoes(id) ON DELETE SET NULL;

-- Migrar dados existentes
DO $$
DECLARE v_versao TEXT;
BEGIN
  FOR v_versao IN
    SELECT DISTINCT versao FROM musicas WHERE versao IS NOT NULL AND versao <> ''
  LOOP
    INSERT INTO musica_versoes (nome)
    VALUES (v_versao)
    ON CONFLICT (nome) DO NOTHING;
  END LOOP;
END $$;

-- ============================================================================
-- MIGRATION 2: Adicionar colunas de media (YouTube e MP3)
-- ============================================================================

ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- ============================================================================
-- VERIFICAÇÃO - Se estas queries abaixo não tiverem erro, tudo funcionou!
-- ============================================================================

SELECT count(*) as total_versoes FROM musica_versoes;
SELECT count(*) as total_autores FROM musica_autores;
SELECT youtube_url, audio_url FROM musicas LIMIT 1;

-- ============================================================================
-- FIM
-- ============================================================================
