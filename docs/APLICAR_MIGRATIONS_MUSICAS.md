# Aplicar Migrations de Músicas - Guia Manual

O CRUD de versões de música não está funcionando porque as migrations não foram aplicadas no banco de dados.

## Problema
As seguintes migrations precisam ser aplicadas no Supabase:
- `20260526_musica_versoes.sql` - Tabela de versões de música
- `20260527_musica_autores_normalizacao.sql` - Tabela de autores
- `20260527_musica_media.sql` - Colunas youtube_url e audio_url

## Solução

### Opção 1: Supabase SQL Editor (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto GEEF
3. Vá para **SQL Editor** (ícone de banco de dados)
4. Clique em **+ New query**
5. Copie e execute o SQL abaixo em ordem:

#### 1️⃣ Aplicar `20260526_musica_versoes.sql`

```sql
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

-- Migrate existing versao text data to new structure
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

COMMENT ON TABLE musica_versoes IS 'Catálogo centralizado de versões de músicas';
COMMENT ON COLUMN musica_versoes.nome IS 'Nome/descrição da versão (ex.: "versão de Elizabeth Lacerda")';
```

#### 2️⃣ Aplicar `20260527_musica_autores_normalizacao.sql`

```sql
-- Create musica_autores table for author management
CREATE TABLE IF NOT EXISTS musica_autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add autor_id foreign key to musicas table
ALTER TABLE musicas
  ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES musica_autores(id) ON DELETE SET NULL;

-- Migrate existing autor text data to new structure
DO $$
DECLARE
  v_autor TEXT;
BEGIN
  FOR v_autor IN
    SELECT DISTINCT autor FROM musicas WHERE autor IS NOT NULL AND autor <> ''
  LOOP
    INSERT INTO musica_autores (nome)
    VALUES (v_autor)
    ON CONFLICT (nome) DO NOTHING;
  END LOOP;
END $$;

COMMENT ON TABLE musica_autores IS 'Catálogo centralizado de autores de músicas';
COMMENT ON COLUMN musica_autores.nome IS 'Nome completo do autor';
```

#### 3️⃣ Aplicar `20260527_musica_media.sql`

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
SELECT * FROM musica_versoes LIMIT 1;
SELECT * FROM musica_autores LIMIT 1;

-- Verificar se as colunas foram adicionadas
SELECT youtube_url, audio_url FROM musicas LIMIT 1;
```

## 🔄 Depois de Aplicar

1. Recarregue a página do navegador (F5)
2. Teste criando uma nova versão/autor
3. As notificações de erro agora mostrarão mensagens específicas se algo estiver errado

## Precisa de Ajuda?

Se receber um erro como:
- `ERROR: relation "musica_versoes" does not exist` → A migration não foi aplicada
- `ERROR: column "versao_id" already exists` → A migration já foi parcialmente aplicada

Verifique se executou todos os 3 passos em ordem.
