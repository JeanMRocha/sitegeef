# Site GEEF - Documentação do Agente

## Visão Geral

**Site do Grupo Espírita Elias Francis (GEEF)** — um site público focado em informações, agenda, acolhimento e presença da casa. Construído com Next.js 15, React 19 e Supabase.

**Propósito**: Apresentar a casa de forma clara, acessível e preparada para crescer. Começou enxuto e legível, pronto para novas páginas e conteúdos.

---

## Stack Técnico

- **Framework**: Next.js 15
- **UI Framework**: React 19
- **Linguagem**: TypeScript 5
- **Backend/Auth**: Supabase (SSR + Client)
- **Fontes**: Manrope (body), Fredoka (heading) — via Google Fonts
- **Porta de desenvolvimento**: 3500

**Dependências principais**:
```json
{
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.102.0",
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

---

## Estrutura de Diretórios

```
site-geef/
├── app/                    # Páginas e layout principal (Next.js App Router)
│   ├── layout.tsx          # Root layout com SiteShell
│   ├── page.tsx            # Página inicial (home)
│   ├── [slug]/page.tsx      # Páginas dinâmicas (contato, agenda, perfil, etc)
│   ├── perfil/page.tsx      # Página de perfil de usuário
│   └── globals.css          # Estilos globais
│
├── components/             # Componentes reutilizáveis
│   ├── site-shell.tsx       # Layout wrapper (header, nav, footer)
│   ├── site-icons.tsx       # Ícones SVG reutilizáveis
│   ├── content-page.tsx     # Template para páginas de conteúdo
│   └── profile-page.tsx     # Página de perfil (com auth Supabase)
│
├── lib/                    # Lógica e utilitários
│   ├── site-data.ts        # Tipos e dados do site (nav, agenda, páginas)
│   └── supabase/
│       ├── client.ts        # Cliente Supabase (browser)
│       └── server.ts        # Cliente Supabase (servidor)
│
├── public/                 # Ativos estáticos (logo, imagens)
│   └── brand/
│       └── logo-oficial-transparent.png
│
├── supabase/               # Configurações do Supabase
├── mcp/                    # MCP-related files
├── scripts/                # Scripts auxiliares
├── .github/                # Workflows e CI/CD
├── .githooks/              # Git hooks customizados
├── docs/                   # Documentação adicional
└── package.json, tsconfig.json, etc.
```

---

## Tipos Principais

### NavItem
```typescript
type NavItem = {
  href: string;
  label: string;
  icon?: "user";
};
```

### FeatureCard
```typescript
type FeatureCard = {
  href: string;
  title: string;
  description: string;
  icon: "group" | "calendar" | "heart" | "live" | "book" | "mail" | "user";
};
```

### ScheduleItem
```typescript
type ScheduleItem = {
  title: string;
  when: string;
  description: string;
};
```

### ContentPage
```typescript
type ContentPage = {
  title: string;
  summary: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  sections: PageSection[];
};

type PageSection = {
  heading: string;
  text: string;
  bullets?: string[];
};
```

---

## Dados Principais

### Site (site-data.ts)
- **site**: Informações de contato e identidade (nome, endereço, email, telefone, redes sociais)
- **navItems**: Menu de navegação (8 items)
- **featureCards**: Cards principais da home (7 serviços)
- **schedule**: Agenda semanal (4 atividades fixas)
- **contentPages**: Dicionário de páginas de conteúdo (9 páginas: quem-somos, agenda, atividades, estudos, evangelização, atendimento-fraterno, doações, ao-vivo, contato, privacidade)

### Versionamento de Cache
`publicCacheVersion = "20260510"` — agregado às URLs para invalidar cache do navegador

---

## Fluxos Principais

### 1. **Página Inicial** (`/`)
- Hero com CTA para "Falar com a casa" e "Ver agenda"
- 3 seções:
  - Serviços (7 cards)
  - Agenda (4 atividades)
  - Contato (endereço, email, telefone, redes sociais)

### 2. **Páginas Dinâmicas** (`/[slug]`)
- Renderizadas pelo template `ContentPage` (content-page.tsx)
- Cada página vem de `contentPages` em site-data.ts
- Layout padrão: intro + seções com headings e bullets + CTA

### 3. **Página de Perfil** (`/perfil`)
- Integração com Supabase para auth
- Componente `ProfilePage` (profile-page.tsx)
- Suporta login e gerenciamento de sessão

### 4. **Layout Raiz**
- `SiteShell` envolve todas as páginas
- Header: Logo + Nav (links + ícone de perfil)
- Footer: Nome da casa + endereço + email

---

## Convenções e Padrões

### Paths
- Usar `@/` para imports (alias configurado em tsconfig)
- Exemplo: `import { site } from "@/lib/site-data"`

### URLs Públicas
- Usar `publicHref()` para construir URLs com cache version
- Trata URLs externas (`https://...`) sem modificação

### Ícones
- SVG inline em `site-icons.tsx`
- Importar e usar como `<IconName className="..." />`

### CSS
- Estilos globais em `app/globals.css`
- Classes BEM-like (`.site-header`, `.hero`, `.feature-card`, etc)
- Variáveis CSS para fontes: `--font-heading`, `--font-body`

### TypeScript
- `strict: true` — type safety rigoroso
- `noEmit: true` — sem geração de JS (Next.js faz isso)

---

## Como Executar

### Instalação
```powershell
npm install
```

### Desenvolvimento
```powershell
npm run dev
```
Acesse: `http://localhost:3500`

### Build para produção
```powershell
npm run build
npm start
```

---

## Supabase

### Clientes
- **`lib/supabase/client.ts`** — Para operações no browser (client components)
- **`lib/supabase/server.ts`** — Para operações no servidor (server components)

### Autenticação
- SSR-aware (via @supabase/ssr)
- Suporta perfil de usuário e sessão

---

## Páginas Disponíveis

1. `/` — Home
2. `/quem-somos` — Missão, história, valores
3. `/agenda` — Programação semanal
4. `/atividades` — O que oferecemos
5. `/estudos` — Linhas de estudo
6. `/evangelizacao` — Formação para crianças/jovens
7. `/atendimento-fraterno` — Escuta e acolhimento
8. `/ao-vivo` — Transmissões no YouTube
9. `/contato` — Informações e meios de contato
10. `/privacidade` — Política de privacidade
11. `/perfil` — Perfil do usuário (com auth)

---

## Sistema de Autenticação (Implementado em 2026-05-15)

### O que foi criado

#### Banco de Dados

- Tabela `profiles` (id, nome_completo, avatar_url, email, updated_at)
- Políticas RLS para proteção de dados
- Trigger automático para criar perfil ao registrar usuário
- Bucket `avatares` no Supabase Storage para upload de fotos

#### Métodos de Login

- Email + Senha (login e cadastro)
- Google OAuth (integração com Supabase Auth)
- Magic link (estrutura preparada)

#### Rotas & Middleware

- `GET /auth/callback` — handler para OAuth e magic links
- Middleware com proteção de `/perfil` e `/admin`
- Redirecionamento para login quando não autenticado

#### Componentes & Páginas

- `/login` — página com formulário de login/cadastro + Google button
- `/perfil` — dashboard do usuário (nome, email, avatar)
- `components/auth/login-form.tsx` — formulário com tabs
- `components/profile-page.tsx` — página real com funcionalidade
- `components/site-shell.tsx` — header com avatar ou ícone do usuário

#### Server Actions

- `signInWithEmail()` — login com email/senha
- `signUpWithEmail()` — cadastro com email/senha
- `signInWithGoogle()` — OAuth Google
- `signOut()` — fazer logout
- `updateProfile()` — atualizar nome
- `uploadAvatar()` — upload de foto para Storage

#### Estilos

- Classes para `.login-page`, `.login-form`, `.profile-page`, etc
- Responsivo (mobile, tablet, desktop)
- Integrado com design system existente

---

## Próximas Mudanças

**Estejam preparadas para:**
- Mudanças no layout e componentes
- Alterações em dados e configurações
- Integração com novos fluxos de Supabase
- Expansão de páginas e conteúdo
- Ajustes de estilo e acessibilidade
- Refinamento do fluxo de auth (email de confirmação, reset de senha)

---

## Notas para o Agente

- Sempre respeitar a estrutura de diretórios
- Manter TypeScript strict
- Usar `@/` para imports
- Testar localmente antes de pushes
- Quando fizer mudanças em site-data.ts, o cache será invalidado automaticamente
- Componentes devem ser funcionais com React 19
- Verificar acessibilidade (ARIA, semântica HTML)

---

**Última atualização**: 2026-05-15
