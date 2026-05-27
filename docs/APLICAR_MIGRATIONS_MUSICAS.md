# Aplicar Migrations de Músicas - Guia Manual

O CRUD de créditos de música precisa da migration unificada aplicada no banco de dados.

## Problema
As seguintes migrations precisam ser aplicadas no Supabase:
- `20260527030702_musica_creditos_unificados.sql` - Catálogo unificado de autores e versões
- `20260527_musica_media.sql` - Colunas youtube_url e audio_url

## Solução

### Opção 1: Supabase SQL Editor (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto GEEF
3. Vá para **SQL Editor** (ícone de banco de dados)
4. Clique em **+ New query**
5. Copie e execute o SQL abaixo em ordem:

#### 1️⃣ Aplicar `20260527030702_musica_creditos_unificados.sql`

```sql
-- Create unified music credits catalog
CREATE TABLE IF NOT EXISTS musica_creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('autor', 'versao')),
  nome TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Migrate existing data from legacy tables
INSERT INTO musica_creditos (tipo, nome)
SELECT 'autor', btrim(nome)
FROM musica_autores
WHERE nome IS NOT NULL AND btrim(nome) <> ''
ON CONFLICT (tipo, nome) DO NOTHING;

INSERT INTO musica_creditos (tipo, nome)
SELECT 'versao', btrim(nome)
FROM musica_versoes
WHERE nome IS NOT NULL AND btrim(nome) <> ''
ON CONFLICT (tipo, nome) DO NOTHING;

-- Retire the old tables after backfill
DROP TABLE IF EXISTS musica_autores CASCADE;
DROP TABLE IF EXISTS musica_versoes CASCADE;

COMMENT ON TABLE musica_creditos IS 'Catálogo unificado de autores e versões de músicas';
COMMENT ON COLUMN musica_creditos.tipo IS 'Tipo do crédito: autor ou versao';
COMMENT ON COLUMN musica_creditos.nome IS 'Nome exibido do crédito';
```

#### 2️⃣ Aplicar `20260527_musica_media.sql`

```sql
-- Add youtube_url and audio_url columns to musicas table
ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN musicas.youtube_url IS 'URL do vídeo YouTube da música';
COMMENT ON COLUMN musicas.audio_url IS 'URL do arquivo MP3 ou link externo para áudio';
```

## ✅ Verificação

Após aplicar as migrations, execute no SQL Editor:

```sql
-- Verificar se as tabelas foram criadas
SELECT * FROM musica_creditos LIMIT 1;

-- Verificar se as colunas foram adicionadas
SELECT youtube_url, audio_url FROM musicas LIMIT 1;
```

## 🔄 Depois de Aplicar

1. Recarregue a página do navegador (F5)
2. Teste criando uma nova versão/autor
3. As notificações de erro agora mostrarão mensagens específicas se algo estiver errado

## Precisa de Ajuda?

Se receber um erro como:
- `ERROR: relation "musica_creditos" does not exist` → A migration não foi aplicada
- `ERROR: duplicate key value violates unique constraint` → existe duplicidade no catálogo legado e precisa de limpeza antes do backfill

Verifique se executou todos os 3 passos em ordem.
