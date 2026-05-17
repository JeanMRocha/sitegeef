# Sistema de Permissões GEEF

## Objetivo

GEEF usa um sistema de permissões baseado em flags booleanas e roles. Este skill documenta como verificar, atribuir e gerenciar permissões em server actions e componentes.

## Quando usar

- Proteger um endpoint ou action (ex: só admin pode deletar)
- Exibir/ocultar UI baseado em permissão
- Criar novo papel com permissões
- Entender fluxo de auth + permissões

## Permissões disponíveis

**Arquivo:** `lib/auth/permissions.ts`

```typescript
export type PermissionFlag =
  | 'pode_escalas'       // Escalas/agendamentos
  | 'pode_biblioteca'    // Biblioteca/empréstimos
  | 'pode_livraria'      // Livraria/produtos
  | 'pode_financeiro'    // Financeiro/contas
  | 'pode_pessoas'       // Cadastro de pessoas
  | 'pode_publicar'      // Publicações/conteúdo
  | 'pode_mediunidade'   // Mediunidade/grupos
  | 'pode_atendimento'   // Atendimento/acolhimento
  | 'pode_apse';         // APSE/assistência social
```

## Como verificar permissão

### 1. Em server actions

**Lançar erro se não tem permissão:**

```typescript
"use server";
import { requirePermission } from "@/lib/auth/permissions";

export async function deletePessoa(id: string) {
  // Lança erro se usuário não tem permissão
  await requirePermission("pode_pessoas");

  // Código só executa se tem permissão
  const supabase = await createClient();
  await supabase.from("pessoas").delete().eq("id", id);
}
```

**Ou retornar booleano:**

```typescript
import { checkPermission } from "@/lib/auth/permissions";

export async function podeEditarFinanceiro(): Promise<boolean> {
  return checkPermission("pode_financeiro");
}
```

### 2. Em Server Components

```typescript
import { getUserPermissions } from "@/lib/auth/permissions";

export default async function FinanceiroPage() {
  const permissions = await getUserPermissions();

  if (!permissions?.pode_financeiro) {
    return <div>Acesso negado</div>;
  }

  return <div>Conteúdo financeiro</div>;
}
```

### 3. Em Client Components

Nunca chamar `getUserPermissions()` no client (retorna null). Em vez disso, passar permissões do server:

```typescript
// Server Component
import { getUserPermissions } from "@/lib/auth/permissions";

export default async function AdminDashboard() {
  const permissions = await getUserPermissions();

  return (
    <AdminContent 
      canEditPessoas={permissions?.pode_pessoas ?? false}
      canEditFinanceiro={permissions?.pode_financeiro ?? false}
    />
  );
}

// Client Component
"use client";
export function AdminContent({ canEditPessoas, canEditFinanceiro }: Props) {
  return (
    <>
      {canEditPessoas && <button>Editar Pessoas</button>}
      {canEditFinanceiro && <button>Editar Financeiro</button>}
    </>
  );
}
```

## Como permissões são atribuídas

### 1. Via `usuarios_sistema` (banco de dados)

Tabela `usuarios_sistema` tem colunas booleanas:

```sql
CREATE TABLE usuarios_sistema (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  pessoa_id UUID REFERENCES pessoas(id),
  perfil VARCHAR(50),  -- 'admin', 'editor', 'viewer', 'publico'
  pode_escalas BOOLEAN DEFAULT FALSE,
  pode_biblioteca BOOLEAN DEFAULT FALSE,
  pode_livraria BOOLEAN DEFAULT FALSE,
  pode_financeiro BOOLEAN DEFAULT FALSE,
  pode_pessoas BOOLEAN DEFAULT FALSE,
  pode_publicar BOOLEAN DEFAULT FALSE,
  pode_mediunidade BOOLEAN DEFAULT FALSE,
  pode_atendimento BOOLEAN DEFAULT FALSE,
  pode_apse BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

**Atribuir permissão (admin panel):**

```typescript
"use server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function atribuirPermissao(userId: string, permission: PermissionFlag) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("usuarios_sistema")
    .update({ [permission]: true })
    .eq("id", userId);

  if (error) throw new Error(`Erro ao atribuir permissão: ${error.message}`);
}
```

### 2. Via `app_metadata` (Supabase Auth)

Se usuário não estiver em `usuarios_sistema`, fallback para `auth.users.app_metadata`:

```typescript
export async function getUserPermissions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Tentar tabela primeiro
  const { data: usuarioSistema } = await supabase
    .from("usuarios_sistema")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (usuarioSistema) {
    return usuarioSistema;
  }

  // Fallback: app_metadata
  const appMetadata = user.app_metadata ?? {};
  return {
    id: user.id,
    perfil: appMetadata.site_role ?? 'publico',
    pode_escalas: appMetadata.pode_escalas === true,
    // ... todos os pode_* flags
  };
}
```

## Padrão: Role-Based Access Control (RBAC)

Diferentes roles com diferentes permissões:

```typescript
type UserRole = 'admin' | 'editor' | 'viewer' | 'publico';

const rolePermissions: Record<UserRole, PermissionFlag[]> = {
  admin: [
    'pode_escalas',
    'pode_biblioteca',
    'pode_livraria',
    'pode_financeiro',
    'pode_pessoas',
    'pode_publicar',
    'pode_mediunidade',
    'pode_atendimento',
    'pode_apse',
  ],
  editor: [
    'pode_publicar',
    'pode_pessoas',
    'pode_atendimento',
  ],
  viewer: [
    // Apenas leitura — nenhuma permissão de escrita
  ],
  publico: [],
};

export async function getUserRole(): Promise<UserRole> {
  const permissions = await getUserPermissions();
  return (permissions?.perfil ?? 'publico') as UserRole;
}

export async function hasPermissionForRole(role: UserRole, permission: PermissionFlag) {
  return rolePermissions[role]?.includes(permission) ?? false;
}
```

## Padrão: Proteção de formulários

Form com ação protegida:

```typescript
"use client";
import { deletePessoa } from "./actions";
import { useState } from "react";

export function DeleteForm({ id, userName }: { id: string; userName: string }) {
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      await deletePessoa(id);
      // Sucesso — redirecionar
    } catch (err: any) {
      setError(err.message);  // "Access denied: pode_pessoas required"
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
      <p>Deletar {userName}?</p>
      <button type="submit">Confirmar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

## Checklist: Setup de permissões

- [ ] Tabela `usuarios_sistema` criada com colunas de permissões
- [ ] Usuários admin têm registro em `usuarios_sistema`
- [ ] `lib/auth/permissions.ts` importado corretamente
- [ ] `requirePermission()` usado em actions sensíveis
- [ ] UI renderiza com base em `getUserPermissions()`
- [ ] Client components recebem permissões do server
- [ ] `app_metadata` atualizado via Supabase Dashboard se necessário
- [ ] Service role usado para criar/atualizar usuários (não expor public)

## Troubleshooting

**Erro: "Access denied: pode_pessoas required"**
- Usuário não tem essa permissão
- Verificar `usuarios_sistema` para esse user_id
- Atribuir permissão via admin panel ou service role

**`getUserPermissions()` retorna null em production**
- Usuário desautenticado?
- Verificar `NEXT_PUBLIC_SUPABASE_URL` e keys
- Verificar cookies estão sendo enviadas

**Permissão não aparece imediatamente após atribuir**
- Cache? Chamar `revalidatePath()` após atualizar
- Token obsoleto? Fazer logout + login
