# 🚀 Aplicar Migration GEEF ERP

## Como obter a URL do banco

1. Vá para o **Supabase Dashboard**: https://app.supabase.com/
2. Selecione seu projeto `site-geef`
3. Clique em **Connect**
4. Copie a conexão Postgres direta ou a URL do Session Pooler

## Aplicar via script

```bash
# Na raiz do projeto:
export GEEF_SUPABASE_DB_URL="postgresql://postgres:[SUA-SENHA]@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres"
npm run apply-migration
```

Se `GEEF_SUPABASE_DB_URL` não estiver definido, o script usa `SUPABASE_DB_URL` ou `DATABASE_URL` automaticamente.

## Aplicar a migration RLS dos módulos sensíveis

```bash
export GEEF_SUPABASE_DB_URL="postgresql://postgres:[SUA-SENHA]@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres"
npm run apply-rls-sensitive-modules
```

## Aplicar manualmente

Se preferir fazer manualmente:

1. Vá para **SQL Editor**: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor
2. Clique em **New Query**
3. Cole o conteúdo de `supabase/migrations/20260515_rls_sensitive_modules.sql`
4. Clique em **Run**

## Verificar se funcionou

```bash
npm run check-migration
```

## Verificar a RLS dos módulos sensíveis

```bash
export GEEF_SUPABASE_DB_URL="postgresql://postgres:[SUA-SENHA]@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres"
npm run check-rls-sensitive-modules
```

Esse verificador confirma se as tabelas-alvo têm RLS ativa e se há políticas registradas. Com `GEEF_SUPABASE_DB_URL`, `SUPABASE_DB_URL` ou `DATABASE_URL`, ele usa conexão direta automaticamente.

Deve listar as 52 tabelas criadas:
- pessoas
- usuario_sistema
- departamentos
- funcoes
- temas_doutrinarios
- escalas_mensais
- ... (47 mais)
