# CLAUDE.md — Documentação do Projeto GEEF ERP

Guia técnico essencial para trabalhar com Claude Code no projeto GEEF ERP.

---

## ⚠️ AVISO CRÍTICO: Regra de Refatoração

**PROIBIDO reduzir funcionalidades, campos de dados ou opções sem autorização explícita.**

Exemplos de ações proibidas:
- ❌ Remover upload de logos porque "parece redundante"
- ❌ Simplificar 8 opções de seleção em 3 sem justificativa
- ❌ Consolidar formulários sem plano de migração
- ❌ Remover features e deixar como "placeholder"

**Leia:** `REFACTORING_RULES.md` antes de fazer qualquer mudança estrutural.

Resumo rápido:
1. **Sempre documente** o estado atual antes de refatorar
2. **Sempre obtenha aprovação** antes de simplificar
3. **Sempre migre dados** existentes com segurança
4. **Sempre atualize documentação** após mudanças

Se tiver dúvida se uma refatoração é permitida: **pergunte antes de fazer.**

---

## O Projeto

**GEEF ERP** é um sistema completo de gestão para organizações espíritas (GEEF = Grupo de Estudos Espíritas de Franquia). Implementado em **Next.js 15** + **Supabase** + **PostgreSQL**, com 27+ módulos admin cobrindo todas as áreas operacionais.

**Stack:**
- Frontend: Next.js 15 (App Router), React 19, TypeScript
- Backend: Next.js Server Actions, Supabase Auth
- Database: PostgreSQL (Supabase)
- Email: Resend API
- Deployment: Standalone next build

**Repositório:** https://github.com/JeanMRocha/site-geef
**Autor:** @JeanMRocha

---

## Memória Operacional — Autoreflex

O projeto usa **Autoreflex local** como servidor de skills (memória persistente). Consulte `agents.md` e `docs/AUTOREFLEX_LOCAL.md` para a ordem de decisão, endpoints e fluxo com Ollama.

**Quick start:**
```bash
npm run autoreflex:serve
npm run skills:search "padrão admin"
npm run skills:index
npm run skills:list
```

---

## MCP do Projeto — Supabase GEEF

Para acessar o Supabase remoto deste repositório, use o MCP isolado `supabase-geef`.

**Leitura obrigatória:**
- `docs/MCP_SUPABASE_GEEF.md`

**Arquivos de configuração:**
- `.mcp.json` declara `supabase-geef` com o `project_ref` deste projeto
- `.claude/settings.json` habilita `supabase-geef` nesta sessão

**Verificação rápida:**
```bash
codex mcp list
codex mcp get supabase-geef
codex mcp login supabase-geef
```

**Regra:**
- Não usar o MCP genérico `supabase`
- Não misturar este projeto com outras contas ou outros projetos
- Antes de qualquer ação remota, confirmar que `supabase-geef` está `enabled` e autenticado

---

## Estrutura do projeto

### Diretórios principais

```
site-geef/
  app/
    admin/              # 27+ módulos CRUD (pessoas, financeiro, escalas, etc)
    api/                # API routes (auth, webhooks)
    auth/               # Fluxos de autenticação
    escalas/            # Escala pública de agendamentos
    institucional/      # Páginas institucionais
    minha-area/         # Área do usuário autenticado
    [slug]/             # Páginas dinâmicas públicas
  
  lib/
    supabase/           # Clientes (server, browser, service-role)
    auth/               # Permissões e RBAC
    admin/              # Cache, dashboard, helpers
    notificacoes/       # Email (Resend), SMS
    escalas/            # Lógica de agendamento
    relatorios/         # PDF, gráficos
    theme/              # Sistema de tema
  
  scripts/              # Utilidades (migrações, seeds)
  skills/               # Skills do Autoreflex
  supabase/
    migrations/         # SQL migrations
    types/              # Tipos gerados
  
  .claude/              # Configuração de Claude Code
  mcp/                  # MCP servers
```

### Módulos admin principais

| Módulo | Descrição |
|--------|-----------|
| `pessoas` | Cadastro central de pessoas (núcleo) |
| `usuarios` | Gerenciamento de usuários do sistema |
| `departamentos` | Departamentos e estrutura organizacional |
| `escalas` | Escalas/agendamentos de serviços |
| `estudos` | Cursos e grupos de estudo |
| `biblioteca` | Acervo de livros, empréstimos |
| `financeiro` | Contas, lançamentos, relatórios (DRE) |
| `apse` | Assistência social, campanhas, atendimentos |
| `atendimento` | Acolhimento, irradiação, lar evangélico |
| `documentos` | Termos, consentimentos, voluntariado |
| `evangelizacao` | Evangelização infantil e grupos |
| `governanca` | Conselhos, assembleias, mandatos |
| `relatorios` | Geração de relatórios e exports |

---

## Padrões de código

### 1. Módulo Admin (CRUD)

**Arquitetura:**
```
app/admin/<modulo>/
  page.tsx              # Lista com paginação + busca
  novo/page.tsx         # Form de criação
  [id]/page.tsx         # Detail + edit
  actions.ts            # Server actions (get, create, update, delete)
```

**Cada módulo é idêntico estruturalmente** — copiar `app/admin/pessoas/` como template.

Consulte `skills/padrao-modulo-admin.md` para detalhes.

### 2. Server Actions

**Arquivo:** `actions.ts`

```typescript
"use server";

export async function getData(page = 1, search = "") {
  const supabase = await createClient();
  // Sempre: createClient() é async
  // Sempre: revalidatePath() após mutação
}

export async function createRecord(formData: FormData) {
  await requirePermission("pode_modulo");
  const supabase = await createClient();
  // Implementar, depois invalidar cache
  invalidateAdminDashboardCache();
  revalidatePath("/admin/modulo");
}
```

Consulte `skills/padrao-actions-ts.md` para padrões completos.

### 3. Supabase

**3 clientes:**
- `createClient()` — server actions (com cookies de auth)
- `createBrowserClient()` — client components (token no localStorage)
- `createServiceRoleClient()` — admin operations (bypassa RLS)

**RLS:** Habilitado em tabelas sensíveis. Filtra automaticamente por `user_id = auth.uid()`.

Consulte `skills/supabase-patterns.md` para padrões.

### 4. Permissões

**Flags de permissão:**
```typescript
type PermissionFlag =
  | 'pode_escalas'
  | 'pode_biblioteca'
  | 'pode_financeiro'
  // ... 9 permissões total
```

**Uso em server actions:**
```typescript
await requirePermission("pode_pessoas");
// Lança erro se não tem permissão
```

Consulte `skills/auth-permissions.md` para detalhes.

### 5. Cache invalidation

Após qualquer mutação (create, update, delete):

```typescript
import { invalidateAdminDashboardCache } from "@/lib/admin/cache";

invalidateAdminDashboardCache();
revalidatePath("/admin/modulo");
revalidatePath(`/admin/modulo/${id}`);
```

### 6. Migrações

**Arquivo:** `supabase/migrations/YYYYMMDD_descricao.sql`

```bash
npm run apply-migration      # Aplicar uma migração
npm run check-migration      # Verificar se foi aplicada
npm run geef:migrations      # Listar pendentes
npm run db:push              # Empurrar para produção
```

Consulte `skills/migrations-workflow.md` para detalhes.

---

## Desenvolvimento

### Setup local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Aplicar migrações do banco
npm run apply-migration

# Iniciar dev server
npm run dev

# Acessar em http://localhost:3500
```

### Scripts úteis

```bash
npm run dev                 # Dev server
npm run build              # Build Next.js
npm run agent:lint         # Lint agent map
npm run db:migrate         # Aplicar migrações
npm run skills:search      # Buscar skills
npm run skills:index       # Indexar skills
npm run geef:migrations    # Listar migrações
```

### Variáveis de ambiente

`.env.local` deve conter:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
```

---

## Convenções

### Nomes de arquivos

- Kebab-case para arquivos: `pessoas.ts`, `nova-pessoa.tsx`
- PascalCase para componentes: `PessoaForm.tsx`
- Lowercase com underscore para SQL: `20250517_create_pessoas.sql`

### Estrutura de componentes

```typescript
// Page com Server Component
export default async function Page({ params }: Props) {
  const data = await fetchData();
  return <MyComponent data={data} />;
}

// Componente Client com form
"use client";
export function MyForm({ initialData }: Props) {
  const [state, dispatch] = useReducer(...);
  return <form action={myAction}>{...}</form>;
}
```

### Imports

```typescript
// Supabase
import { createClient } from '@/lib/supabase/server';

// Auth
import { requirePermission } from '@/lib/auth/permissions';

// Cache
import { invalidateAdminDashboardCache } from '@/lib/admin/cache';

// Next.js
import { revalidatePath } from 'next/cache';
```

---

## Decisões arquiteturais

**Por que Server Actions e não API routes?**
- Simples: uma função = uma action
- Seguro: type-safe, sem CORS
- Cache-friendly: revalidatePath automático

**Por que Supabase?**
- Gerenciado: sem infraestrutura
- Auth integrado: OAuth, Supabase Auth
- RLS nativo: segurança por padrão

**Por que sem GraphQL/Redux?**
- Complexidade desnecessária para CRUD simples
- Server actions são mais simples e seguros
- Dados sempre frescos via revalidatePath

---

## Troubleshooting

### "Access denied: pode_pessoas required"
Usuário não tem permissão. Atribuir em Supabase Dashboard (usuarios_sistema).

### "RLS returning 0 results"
- Usuário desautenticado? Verificar auth.getUser()
- Tabela sem RLS? Adicionar policies
- RLS muito restritivo? Ajustar WHERE clause

### "Autoreflex not found"
Subir o serviço local: `npm run autoreflex:serve`.

---

## Roadmap conhecido

- ✅ 29/29 módulos core implementados
- ✅ RLS em módulos sensíveis
- ✅ Email notifications (Resend)
- ✅ Relatórios avançados
- 🔄 Melhorias de UX/performance
- 🔄 Mobile responsiveness

---

## Contatos

- Repositório: https://github.com/JeanMRocha/site-geef
- Issues: https://github.com/JeanMRocha/site-geef/issues
- Autor: @JeanMRocha

---

## Veja também

- `agents.md` — Memória operacional do Autoreflex
- `STATUS.md` — Status e progresso do projeto
- `HANDOFF.md` — Notas de handoff entre sessões
- `skills/` — Conhecimento indexado (skills)
