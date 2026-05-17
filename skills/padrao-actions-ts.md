# Padrão de Server Actions GEEF

## Objetivo

Server actions (funções assíncronas em `actions.ts`) são o coração da comunicação cliente-servidor do GEEF. Este skill detalha o padrão, boas práticas e gotchas.

## Quando usar

- Criar nova ação (create, update, delete, fetch complexo)
- Entender fluxo de erro em server actions
- Fazer busca com filtros complexos
- Integrar cache invalidation
- Lidar com permissões

## Anatomia básica

```typescript
"use server";  // OBRIGATÓRIO no topo do arquivo

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { invalidateAdminDashboardCache } from "@/lib/admin/cache";

export async function meuGetter(page = 1, search = "") {
  const supabase = await createClient();
  
  // Sempre: chamar createClient() dentro da função
  // Sempre: usar await — context é ServerComponent
  
  const { data, count, error } = await supabase
    .from("tabela")
    .select("*", { count: "exact" })
    .range((page - 1) * 20, page * 20 - 1);

  if (error) {
    return { items: [], total: 0, error: error.message };
  }

  return { items: data, total: count || 0 };
}
```

## Pattern: Getter com paginação e filtros

```typescript
export async function getPessoas(
  page = 1,
  search = "",
  statusFilter?: "ativo" | "inativo",
  vinculoFilter?: string
) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("pessoas")
    .select(
      `
      id, nome, email, telefone, status,
      pessoa_vinculos (id, vinculo)
    `,
      { count: "exact" }
    );

  // Busca textual: OR de múltiplos campos (ilike)
  if (search) {
    query = query.or(
      `nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`
    );
  }

  // Filtro exato
  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, count, error } = await query.range(offset, offset + pageSize - 1);

  if (error) {
    console.error("[getPessoas] Supabase error:", error);
    return { pessoas: [], total: 0, page, pageSize };
  }

  // Filtro em-memória pós-query (quando necessário)
  let filtered = data || [];
  if (vinculoFilter) {
    filtered = filtered.filter((p: any) =>
      p.pessoa_vinculos?.some((v: any) => v.vinculo === vinculoFilter)
    );
  }

  return {
    pessoas: filtered,
    total: count || 0,
    page,
    pageSize,
  };
}
```

## Pattern: Criar com validação

```typescript
export async function createPessoa(formData: FormData) {
  const supabase = await createClient();

  // Extrair + validar
  const nome = formData.get("nome")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const telefone = formData.get("telefone")?.toString().trim() || "";

  if (!nome || nome.length < 2) {
    throw new Error("Nome é obrigatório e deve ter no mínimo 2 caracteres");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email inválido");
  }

  // Insertar
  const { data, error } = await supabase
    .from("pessoas")
    .insert([{ nome, email, telefone, status: "ativo" }])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar pessoa: ${error.message}`);
  }

  // Invalidar cache e revalidar rota
  invalidateAdminDashboardCache();
  revalidatePath("/admin/pessoas");

  return data;
}
```

## Pattern: Atualizar com permissões

```typescript
import { requirePermission } from "@/lib/auth/permissions";

export async function updatePessoa(id: string, formData: FormData) {
  // Verificar permissão
  await requirePermission("pode_pessoas");

  const supabase = await createClient();
  const nome = formData.get("nome")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";

  const { data, error } = await supabase
    .from("pessoas")
    .update({ nome, email, atualizado_em: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar: ${error.message}`);
  }

  invalidateAdminDashboardCache();
  revalidatePath("/admin/pessoas");
  revalidatePath(`/admin/pessoas/${id}`);

  return data;
}
```

## Pattern: Deletar com confirmação

```typescript
export async function deletePessoa(id: string) {
  await requirePermission("pode_pessoas");

  const supabase = await createClient();

  const { error } = await supabase
    .from("pessoas")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Erro ao deletar: ${error.message}`);
  }

  invalidateAdminDashboardCache();
  revalidatePath("/admin/pessoas");
  
  return { success: true };
}
```

## Cache Invalidation

Sempre após mutação:

```typescript
import { revalidatePath } from "next/cache";
import { invalidateAdminDashboardCache, invalidateAdminBibliotecaCache } from "@/lib/admin/cache";

// Padrão completo
invalidateAdminDashboardCache(); // Invalida dashboard
revalidatePath("/admin/pessoas");  // Invalida list
revalidatePath("/admin/pessoas/nova");  // Invalida form create
revalidatePath(`/admin/pessoas/${id}`);  // Invalida detail page
```

## Erros e tratamento

**Nunca lançar exception diretamente da server action:**
- Lançar exceptions funciona, mas cria erro no console do servidor
- Melhor: retornar `{ error: string }` ou lançar `Error()` se for crítico

```typescript
export async function minhaAction(formData: FormData) {
  // ❌ Evitar
  if (!formData.get("nome")) {
    return { error: "Nome é obrigatório" };
  }

  // ✅ Melhor (se crítico)
  if (!formData.get("email")) {
    throw new Error("Email é obrigatório");
  }

  // ...
}
```

## Supabase createClient()

Sempre assim:

```typescript
import { createClient } from "@/lib/supabase/server";

export async function minhaAction() {
  const supabase = await createClient();
  // supabase agora tem cookies do usuário autenticado
}
```

Nunca usar `createServerClient` diretamente — `createClient()` já faz isso com os cookies certos.

## Gotchas comuns

1. **Esquecer `revalidatePath()`** → dados stale na UI
2. **Não await createClient()** → problemas com cookies
3. **Busca com AND vs OR** — `or()` encadeia; múltiplo `eq()` é AND
4. **Validação de entrada** — sempre sanitizar e validar
5. **Erro silencioso** — sempre log `error` para debug
6. **N+1 queries** — usar `select()` com related tables via join (ex: `pessoa_vinculos (*)`)
