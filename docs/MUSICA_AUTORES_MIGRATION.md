# Migração de Autores de Músicas

## 📋 Contexto

A tabela de músicas foi normalizada para usar uma tabela separada de autores (`musica_autores`), evitando duplicação e permitindo reutilização de autores em múltiplas músicas.

## 🚀 Como Aplicar a Migração

### Opção 1: Aplicar via SQL Editor do Supabase (Recomendado)

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto GEEF
3. Vá para **SQL Editor** → **New Query**
4. Copie o conteúdo de `supabase/migrations/20260527_musica_autores_normalizacao.sql`
5. Cole no editor e clique **▶ Run**

### Opção 2: Via CLI linkada

Se o projeto estiver linkado e você tiver `SUPABASE_ACCESS_TOKEN` configurado, use:

```bash
supabase link --project-ref nycgpokqlmrfzegjlrwa
npx supabase db push
```

### Opção 3: Via CLI com DATABASE_URL

```bash
npm run apply-migration
```

> ⚠️ Requer `DATABASE_URL` ou `SUPABASE_DB_URL` configurado nas variáveis de ambiente

Se a conexão direta falhar por IPv6 ou o `.env` não estiver parseando corretamente, use a Opção 1 ou a Management API do Supabase para aplicar a migration com o token do projeto.

## 📊 O que a Migração Faz

1. ✅ Cria tabela `musica_autores` com:
   - `id` (UUID, primary key)
   - `nome` (text, unique)
   - `criado_em` / `atualizado_em` (timestamps)

2. ✅ Adiciona coluna `autor_id` na tabela `musicas`

3. ✅ Migra autores existentes:
   - Extrai nomes únicos de autores da tabela `musicas`
   - Cria registros em `musica_autores`
   - Popula `autor_id` em cada música

4. ✅ Configura RLS e índices para performance

## 🎯 Impacto

| Antes | Depois |
|-------|--------|
| `musicas.autor` = texto livre | `musicas.autor_id` = fk para `musica_autores` |
| Campo `autor` mantido (compat.) | Campo `autor` mantido (compat.) |
| Duplicatas possíveis | Sem duplicatas (constraint unique) |
| Sem dropdown | Dropdown + create in-line |

## ✨ Novo Fluxo de UX

Ao criar/editar música:
1. Ver dropdown com autores existentes
2. Selecionar um autor OU clicar **+ Novo**
3. Criar novo autor em aba nova (sem perder form)
4. Regressar e selecionar na lista

## 🔍 Verificação

Após aplicar a migração, verifique:

```sql
-- Verificar autores criados
SELECT COUNT(*) FROM musica_autores;

-- Verificar musicas com autor_id preenchido
SELECT COUNT(*) FROM musicas WHERE autor_id IS NOT NULL;

-- Listar alguns autores
SELECT id, nome FROM musica_autores LIMIT 5;
```

## ❓ Dúvidas

- **E se eu não aplicar?** O campo ainda funciona como input de texto (compatibilidade)
- **Posso reversionar?** Sim, mas perderá a relação `autor_id`
- **Dados são perdidos?** Não, todos os autores são migrados automaticamente

---

**Status**: Aplicada remotamente em 2026-05-26  
**Migração**: `20260527_musica_autores_normalizacao.sql`  
**Compatibilidade**: ✅ Backwards-compatible
