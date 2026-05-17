# Workflow de Migrações GEEF

## Objetivo

O GEEF mantém um sistema robusto de migrações SQL com scripts helper. Este skill documenta como criar, testar, aplicar e verificar migrações sem quebrar produção.

## Quando usar

- Criar nova tabela ou coluna
- Alterar schema (rename, type change)
- Criar índice ou constraint
- Aplicar migração em produção
- Verificar migração pendente

## Estrutura de migrações

```
supabase/migrations/
  20250101_criar_tabela_pessoas.sql
  20250102_adicionar_coluna_email.sql
  20250103_criar_indices.sql
  20260515_rls_sensitive_modules.sql
```

**Convenção:** `YYYYMMDD_descricao.sql`

## Como criar uma migração

### 1. Criar arquivo SQL

**Arquivo:** `supabase/migrations/20250520_add_column_cpf.sql`

```sql
-- Adicionar coluna CPF em pessoas
ALTER TABLE pessoas ADD COLUMN IF NOT EXISTS cpf VARCHAR(11);

-- Criar índice para busca rápida
CREATE INDEX idx_pessoas_cpf ON pessoas(cpf);

-- Comentário para documentação
COMMENT ON COLUMN pessoas.cpf IS 'CPF do registro, máximo 11 dígitos';
```

**Boas práticas:**
- `IF NOT EXISTS` para idempotência
- Sempre comentar o motivo
- Índices para colunas de busca
- Constraints para validação (CHECK, NOT NULL, UNIQUE)

### 2. Aplicar migração localmente (dev)

```bash
npm run apply-migration
# Seleciona arquivo e aplica via Supabase CLI
```

Ou manualmente:

```bash
npx supabase migration up
```

### 3. Verificar se funcionou

```bash
npm run check-migration
# Script verifica se migração foi aplicada
```

## Padrão: Migração com RLS

Criar tabela com Row-Level Security habilitado:

```sql
-- Criar tabela
CREATE TABLE vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  produto_id UUID NOT NULL REFERENCES produtos(id),
  quantidade INT NOT NULL DEFAULT 1,
  valor DECIMAL(10, 2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, produto_id)
);

-- Habilitar RLS
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

-- Policy 1: usuário lê apenas próprias vendas
CREATE POLICY "Vendas: ler próprias"
ON vendas FOR SELECT
USING (user_id = auth.uid());

-- Policy 2: usuário só insere com próprio user_id
CREATE POLICY "Vendas: criar próprias"
ON vendas FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy 3: só pode deletar própria venda
CREATE POLICY "Vendas: deletar próprias"
ON vendas FOR DELETE
USING (user_id = auth.uid());

-- Policy 4: admin pode fazer tudo (service role não usa RLS)
-- (não precisa escrever — service role bypassa tudo)

-- Índices
CREATE INDEX idx_vendas_user_id ON vendas(user_id);
CREATE INDEX idx_vendas_produto_id ON vendas(produto_id);
```

## Padrão: Migração de dados

Migração que move dados (ex: denormalizar ou refatorar schema):

```sql
-- Criar coluna nova
ALTER TABLE pessoas ADD COLUMN nome_completo VARCHAR(255);

-- Copiar dados da coluna antiga
UPDATE pessoas SET nome_completo = nome WHERE nome_completo IS NULL;

-- Deletar coluna antiga (opcional, manter para compatibilidade é mais seguro)
-- ALTER TABLE pessoas DROP COLUMN nome;
```

## Scripts helper

### `npm run geef:migrations`

Listar migrações pendentes:

```bash
npm run geef:migrations
# Output:
# Migrações pendentes:
# - 20250520_add_column_cpf.sql
# Migrações aplicadas:
# - 20250101_criar_tabela_pessoas.sql
# - 20250102_adicionar_coluna_email.sql
```

### `npm run apply-migration`

Aplicar migração específica:

```bash
npm run apply-migration
# Prompts para selecionar arquivo
```

### `npm run check-migration`

Verificar migração aplicada:

```bash
npm run check-migration
# Output: ✅ Migração 20250520_add_column_cpf.sql foi aplicada
```

### `npm run check-rls-sensitive-modules`

Verificar RLS em tabelas sensíveis:

```bash
npm run check-rls-sensitive-modules
# Output: ✅ RLS habilitado em: pessoas, usuarios_sistema, financeiro
```

## Processo: Mergear e Deploy

1. **Criar brancha feature:**
   ```bash
   git checkout -b feat/nova-coluna-cpf
   ```

2. **Criar arquivo de migração:**
   ```bash
   supabase/migrations/20250520_add_column_cpf.sql
   ```

3. **Testar localmente:**
   ```bash
   npm run apply-migration
   npm run check-migration
   ```

4. **Commit + Push:**
   ```bash
   git add supabase/migrations/
   git commit -m "feat: adicionar coluna CPF em pessoas"
   git push origin feat/nova-coluna-cpf
   ```

5. **Abrir PR** — descrever migração no PR body

6. **Merge para main**

7. **Deploy:**
   ```bash
   npm run db:push  # Empurra migrações para produção Supabase
   ```

## Troubleshooting

**Erro: "relation already exists"**
- Migração já foi aplicada? Verificar em Supabase Dashboard
- Se idempotente (IF NOT EXISTS), rodar novamente é seguro

**Erro: "permission denied"**
- Service role key não foi configurada?
- Verificar `SUPABASE_SERVICE_ROLE_KEY` em `.env.local`

**Rollback de migração**
- Supabase não permite rollback automático
- Criar nova migração que desfaz a anterior:
  ```sql
  -- Migração 20250521_rollback_cpf.sql
  ALTER TABLE pessoas DROP COLUMN cpf;
  DROP INDEX idx_pessoas_cpf;
  ```

**Migração muda muitos dados**
- Testar em staging primeiro
- Considerar background job ao invés de migração síncrona
- Manter janela de downtime pequena
