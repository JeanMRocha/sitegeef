# 🚀 Aplicar Migration GEEF ERP

## Como obter a Service Role Key

1. Vá para **Supabase Dashboard**: https://app.supabase.com/
2. Selecione seu projeto `site-geef`
3. Vá para **Project Settings** (engrenagem no canto inferior esquerdo)
4. Abra **API** na barra lateral
5. Copie a **service_role** key (não use anon key!)

## Aplicar via script (recomendado)

```bash
# No terminal, na raiz do projeto:
export SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"
npm run apply-migration
```

Se o projeto não expuser a RPC `public.execute_sql`, o script vai apontar a falha e a aplicação precisa ser feita no SQL Editor do Supabase.

## Aplicar a migration RLS dos módulos sensíveis

```bash
export SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"
npm run apply-rls-sensitive-modules
```

## Aplicar manualmente (alternativa)

Se preferir fazer manualmente:

1. Vá para **SQL Editor**: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor
2. Clique em **New Query**
3. Copie todo o conteúdo de `supabase/migrations/20260515_geef_erp.sql`
4. Cole no SQL Editor
5. Clique em **Run** (ou Ctrl+Enter)
6. Aguarde até aparecer "✅ Success"

## Verificar se funcionou

```bash
npm run check-migration
```

## Verificar a RLS dos módulos sensíveis

```bash
export SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"
npm run check-rls-sensitive-modules
```

Esse verificador confirma se as tabelas-alvo têm RLS ativa e se há políticas registradas. Se a RPC `public.execute_sql` não existir, ele vai falhar com indicação para usar o SQL Editor.

Deve listar as 52 tabelas criadas:
- pessoas
- usuario_sistema
- departamentos
- funcoes
- temas_doutrinarios
- escalas_mensais
- ... (47 mais)
