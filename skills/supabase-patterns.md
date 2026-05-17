# Padrões Supabase GEEF

## Objetivo

O GEEF usa Supabase como único banco de dados e auth provider. Este skill documenta os clientes, quando usar cada um, e padrões de integração.

## Quando usar

- Acessar dados em server action
- Implementar lógica que precisa de service role (admin only)
- Integração com Qdrant, Resend ou outros serviços
- Entender fluxo de autenticação

## Os 3 clientes Supabase

### 1. Server Client (padrão para server actions)

**Arquivo:** `lib/supabase/server.ts`

**Uso:** Server actions, API routes, Server Components

**Característica:** Inclui cookies do usuário autenticado

```typescript
import { createClient } from "@/lib/supabase/server";

export async function minhaAction() {
  const supabase = await createClient();
  
  // supabase.auth.getUser() retorna usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  
  // RLS aplica automaticamente — dados filtrados pelo user.id
  const { data } = await supabase.from("pessoas").select("*");
}
```

**RLS:** ✅ Aplica (usuário está autenticado via cookies)

### 2. Browser Client

**Arquivo:** `lib/supabase/client.ts`

**Uso:** Client components apenas (nunca em server actions)

**Característica:** Roda no navegador com token auth

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

export function MinhaComponente() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    // Consulta com RLS do usuário
    supabase.from("pessoas").select("*").then(({ data }) => setData(data));
  }, []);

  return <div>{/* ... */}</div>;
}
```

**RLS:** ✅ Aplica (token do usuário)

**IMPORTANTE:** Nunca exponha secret_key aqui — apenas public key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

### 3. Service Role Client

**Arquivo:** `lib/supabase/service-role.ts`

**Uso:** Operações administrativas que byppassam RLS (ex: logs, sync internas)

**Característica:** Usa `SUPABASE_SERVICE_ROLE_KEY` — sem limite de RLS

```typescript
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function logOperacaoInterna(acao: string) {
  const supabase = createServiceRoleClient();
  
  // Insere em tabela sem validar RLS
  await supabase.from("ops_events").insert([
    { acao, timestamp: new Date() }
  ]);
}
```

**RLS:** ❌ Não aplica (admin only)

**SEGURANÇA:** Nunca expor `SUPABASE_SERVICE_ROLE_KEY` — use apenas em server-side code

## Padrão: Integração com API externa

Exemplo: indexar skill no Autoreflex após criar pessoa.

```typescript
"use server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function createPessoa(formData: FormData) {
  const supabase = await createClient();

  // 1. Inserir pessoa (com RLS do usuário)
  const { data: pessoa, error } = await supabase
    .from("pessoas")
    .insert([{ nome: formData.get("nome") }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Log interno (service role — sem RLS)
  const serviceRole = createServiceRoleClient();
  await serviceRole.from("ops_events").insert([
    { acao: `criou pessoa ${pessoa.id}`, timestamp: new Date() }
  ]);

  // 3. Chamar API externa (ex: Autoreflex)
  try {
    await fetch("http://127.0.0.1:8090/agent/skills/index", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_path: "skills/new.md" })
    });
  } catch (err) {
    console.error("Autoreflex indexing failed:", err);
    // Não falha a ação principal
  }

  return pessoa;
}
```

## Padrão: Tipos TypeScript

O GEEF gera tipos automáticos do schema Supabase.

**Arquivo:** `lib/supabase/types.ts`

```typescript
export type tipo_vinculo = "membro" | "colaborador" | "visitante";
export type status_pessoa = "ativo" | "inativo" | "suspenso";

export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  status: status_pessoa;
  criado_em: string;
}
```

**Uso em server actions:**

```typescript
import { type Pessoa } from "@/lib/supabase/types";

export async function getPessoa(id: string): Promise<Pessoa | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pessoas")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
```

## Padrão: RLS (Row-Level Security)

RLS é ativado para tabelas sensíveis e filtra automaticamente por `user_id` ou `auth.uid()`.

**Exemplo:** Tabela `pessoas` com RLS

```sql
-- Sem RLS, qualquer usuário lê todas as pessoas
-- Com RLS: apenas dados que user_id = auth.uid()

CREATE POLICY "Pessoas: ler próprias"
ON pessoas FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Pessoas: criar próprias"
ON pessoas FOR INSERT
WITH CHECK (user_id = auth.uid());
```

**Em server action:**

```typescript
const { data } = await supabase.from("pessoas").select("*");
// Retorna apenas pessoas onde user_id = user.id (filtrado automaticamente)
```

## Checklist: Setup correto de Supabase

- [ ] `NEXT_PUBLIC_SUPABASE_URL` definida
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` definida
- [ ] `SUPABASE_SERVICE_ROLE_KEY` definida (server-side only)
- [ ] Usar `createClient()` em server actions (nunca `createServerClient()` direto)
- [ ] RLS habilitado para tabelas sensíveis
- [ ] Service role usado APENAS para ops internas (logging, sync)
- [ ] Tipos TypeScript mantidos em sync com schema (via `supabase gen types`)

## Troubleshooting

**"Missing NEXT_PUBLIC_SUPABASE_URL"**
- Verificar `.env.local` tem a URL correta
- Verificar `next.config.ts` não bloqueia vars de env

**RLS returnando 0 resultados**
- Usuário desautenticado? Verificar `auth.getUser()`
- Tabela sem RLS? Verificar policies no Supabase Dashboard
- RLS muito restritivo? Logitar com usuário que satisfaz a policy

**Service role queries lentas**
- Service role não usa índices da mesma forma
- Minimizar uso; mover para background jobs se possível
