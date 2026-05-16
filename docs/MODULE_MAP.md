# Module Map - Site GEEF

## Leituras principais

### Publico

- `app/page.tsx` - home publica
- `app/[slug]/page.tsx` - paginas de conteudo
- `components/site-shell.tsx` - header/footer publico
- `components/content-page.tsx` - template das paginas publicas
- `components/user-menu.tsx` - menu do usuario

### Auth

- `app/login/page.tsx` - login compacto
- `components/auth/login-form.tsx` - formulario de acesso
- `app/login/actions.ts` - sign in, sign up e google
- `app/auth/callback/route.ts` - callback OAuth

### Area do usuario

- `app/minha-area/page.tsx`
- `app/leitor/page.tsx`
- `lib/areas/user-area.ts`
- `lib/areas/invalidate-user-area.ts`

### Admin shell

- `app/admin/layout.tsx`
- `components/admin/admin-header.tsx`
- `components/admin/admin-sidebar.tsx`
- `styles/admin.css`
- `styles/admin-sidebar.css`

## Modulos e arquivos

### Dashboard

- Entrada: `app/admin/page.tsx`
- Cache: `lib/admin/dashboard.ts`
- Invalida: `lib/admin/cache.ts`

### Pessoas

- Entrada: `app/admin/pessoas/page.tsx`
- Actions: `app/admin/pessoas/actions.ts`
- Escritas invalidam dashboard, biblioteca, documentos e area do usuario

### Funcoes e temas

- Entrada: `app/admin/funcoes/page.tsx`
- Actions: `app/admin/funcoes/actions.ts`
- Escritas invalidam dashboard

### Escalas

- Entrada: `app/admin/escalas/page.tsx`
- Actions: `app/admin/escalas/actions.ts`
- Publico: `app/escalas/page.tsx`
- Cache publico: `lib/escalas/public-escalas.ts`
- Escritas invalidam dashboard, area do usuario e cache publico

### Biblioteca

- Entrada: `app/admin/biblioteca/page.tsx`
- Actions: `app/admin/biblioteca/actions.ts`
- Emprestimos: `app/admin/biblioteca/emprestimos/actions.ts`
- Reservas: `app/admin/biblioteca/reservas/actions.ts`
- Escritas invalidam cache da biblioteca e area do usuario

### Documentos

- Entrada: `app/admin/documentos/page.tsx`
- Actions: `app/admin/documentos/actions.ts`
- Termos, consentimentos e voluntariado compartilham o mesmo dominio
- Escritas invalidam cache de documentos e area do usuario

### Livraria

- Entrada: `app/admin/livraria/page.tsx`
- Actions: `app/admin/livraria/actions.ts`

### Financeiro

- Entrada: `app/admin/financeiro/page.tsx`
- Actions: `app/admin/financeiro/actions.ts`

### Comunicacao

- Entrada: `app/admin/comunicacao/page.tsx`
- Actions: `app/admin/comunicacao/actions.ts`

### Atendimento

- Entrada: `app/admin/atendimento/page.tsx`
- Actions: `app/admin/atendimento/actions.ts`

## Onde procurar antes de editar

1. Ver o `layout.tsx` do segmento.
2. Ver os `actions.ts` do mesmo dominio.
3. Ver `styles/globals.css`, `styles/admin.css` e `styles/admin-sidebar.css`.
4. Ver se existe helper em `lib/` antes de duplicar leitura.

## Regras de manutencao

- Um helper por responsabilidade.
- Um cache tag por dominio.
- Um ponto de invalidacao por dominio.
- Reads simples devem continuar simples.
- Views sensiveis nao devem ser cacheadas no build.

