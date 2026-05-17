# Padrão de Módulo Admin GEEF

## Objetivo

Todo módulo admin do GEEF segue uma estrutura CRUD padrão. Este skill documenta a arquitetura, convenções de arquivo e fluxo de dados para criar ou modificar módulos admin.

## Quando usar

- Criar novo módulo admin (ex: novo cadastro)
- Adicionar nova página a módulo existente
- Entender fluxo de list/create/edit/delete
- Refatorar módulo existente

## Estrutura de diretórios

```
app/admin/<modulo>/
  page.tsx              # Lista (GET + busca)
  novo/page.tsx         # Form de criação
  [id]/page.tsx         # Detail + edit
  actions.ts            # Server actions (CRUD)
```

Exemplo: `app/admin/pessoas/`

## 1. Page (Lista)

**Arquivo:** `page.tsx`

Responsabilidades:
- Exibir lista paginada (20 itens por página)
- Busca por campo (ilike — case-insensitive)
- Link para novo (botão "+ Nova Pessoa")
- Link para cada item (edit na linha)

**Padrão:**

```typescript
import Link from "next/link";
import { getPessoas } from "./actions";
import { Suspense } from "react";

export const metadata = { title: "Pessoas - Admin GEEF" };

async function PessoasList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  
  const { pessoas, total, pageSize } = await getPessoas(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Cadastro</span>
          <h1 className="admin-page-title">Pessoas</h1>
          <p className="admin-page-subtitle">Descrição breve</p>
        </div>
        <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Pessoa
        </Link>
      </div>

      {/* Seção: busca */}
      {/* Seção: tabela com dados */}
      {/* Seção: paginação */}
    </div>
  );
}

export default function Page({ searchParams }: { searchParams: Record<string, string | string[]> }) {
  return <Suspense fallback={<div>Carregando...</div>}><PessoasList searchParams={searchParams} /></Suspense>;
}
```

## 2. Nova página (Create)

**Arquivo:** `novo/page.tsx`

Responsabilidades:
- Form para criar novo registro
- POST para actions.ts `createPessoa()`
- Redirect após sucesso

**Padrão:**

```typescript
import { createPessoa } from "../actions";
import Link from "next/link";

export const metadata = { title: "Nova Pessoa - Admin GEEF" };

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createPessoa(formData);
  }

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Nova Pessoa</h1>
      </div>
      <section className="area-section">
        <form action={handleSubmit} className="admin-form">
          {/* campos */}
          <button type="submit">Criar Pessoa</button>
          <Link href="/admin/pessoas">Cancelar</Link>
        </form>
      </section>
    </div>
  );
}
```

## 3. Detalhe/Edit página

**Arquivo:** `[id]/page.tsx`

Responsabilidades:
- Carregar dado por ID
- Form pré-populado para edit
- POST para `updatePessoa()`
- DELETE para `deletePessoa()`

**Padrão:**

```typescript
import { getPessoaById, updatePessoa, deletePessoa } from "../actions";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: "Editar Pessoa - Admin GEEF" };
}

export default async function Page({ params }: { params: { id: string } }) {
  const pessoa = await getPessoaById(params.id);
  if (!pessoa) return <div>Não encontrado</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePessoa(params.id, formData);
  }

  async function handleDelete() {
    "use server";
    await deletePessoa(params.id);
  }

  return (
    <div className="area-page">
      <h1>Editar {pessoa.nome}</h1>
      <form action={handleUpdate} className="admin-form">
        {/* campos pré-populados */}
        <button type="submit">Salvar</button>
        <button formAction={handleDelete} type="button">Deletar</button>
        <Link href="/admin/pessoas">Voltar</Link>
      </form>
    </div>
  );
}
```

## 4. Actions (Server Actions)

**Arquivo:** `actions.ts`

Responsabilidades:
- `"use server"` no topo
- Cada ação (get, create, update, delete)
- Usar `createClient()` do Supabase
- `revalidatePath()` após mutações

**Padrão:**

```typescript
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPessoas(page = 1, search = "") {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let query = supabase.from("pessoas").select("*", { count: "exact" });
  if (search) {
    query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
  }
  
  const { data, count, error } = await query.range(offset, offset + pageSize - 1);
  return { pessoas: data || [], total: count || 0, page, pageSize };
}

export async function createPessoa(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("pessoas").insert([
    { nome: formData.get("nome"), email: formData.get("email") },
  ]);
  if (!error) revalidatePath("/admin/pessoas");
  return error;
}

export async function updatePessoa(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("pessoas").update({
    nome: formData.get("nome"),
    email: formData.get("email"),
  }).eq("id", id);
  if (!error) revalidatePath("/admin/pessoas");
  return error;
}

export async function deletePessoa(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pessoas").delete().eq("id", id);
  if (!error) revalidatePath("/admin/pessoas");
  return error;
}
```

## Cache Invalidation

Após qualquer mutação, invalidar cache:

```typescript
import { invalidateAdminDashboardCache } from "@/lib/admin/cache";

// Após create/update/delete
invalidateAdminDashboardCache();
revalidatePath("/admin/pessoas");
```

## Considerações

- **Busca:** Sempre ilike (case-insensitive) para melhor UX
- **Paginação:** 20 itens por página (padrão)
- **Erro:** Retornar erro sem lançar exception; deixar UI tratar
- **Permissões:** Verificar `requirePermission()` se necessário (lib/auth/permissions.ts)
- **RLS:** Supabase RLS protege a tabela; sem SQL injection possível
