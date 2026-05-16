# Site GEEF - Handoff Rapido

## Ler primeiro

1. `agente.md`
2. `docs/AGENT_PLAYBOOK.md`
3. `docs/MODULE_MAP.md`
4. `docs/baseerp.md` quando a mudanca for de ERP

## Regra de trabalho

- Uma mudanca = um modulo principal por vez.
- Antes de editar, localizar o dono do fluxo.
- Usar `@/` para imports.
- `npm run build` antes de encerrar.
- Se mudar cache, invalidar por tag/path no mesmo modulo.
- Nao misturar client session com leitura de admin quando houver `service-role`.

## Quando mexer em visual

1. Identificar a pagina e o layout compartilhado.
2. Procurar CSS comum antes de criar estilo novo.
3. Ajustar header, hero, cards e formularios na mesma familia visual.
4. Verificar desktop e mobile.
5. Validar contraste e espacamento.

## Quando mexer em Supabase

- `lib/supabase/server.ts` = leitura SSR com sessao do usuario.
- `lib/supabase/service-role.ts` = leitura cacheada de admin e rotas publicas derivadas.
- `lib/admin/cache.ts` = invalida cache de dashboard, biblioteca e documentos.
- `lib/areas/invalidate-user-area.ts` = invalida area do usuario/leitor.
- `lib/escalas/public-escalas.ts` = cache publico das escalas.

## Quando mexer em cache

- Cache curto para listagens pesadas.
- Invalida no modulo que escreveu.
- Nao cachear formularios sensiveis nem leitura dependente de sessao.
- Se uma pagina quebrar no build por prerender, marcar o segmento como dinmico.

## Responsabilidades mais usadas

- `app/admin/page.tsx` -> dashboard
- `app/admin/biblioteca/*` -> acervo, emprestimos, reservas
- `app/admin/documentos/*` -> modelos, termos, consentimentos, voluntariado
- `app/admin/pessoas/*` -> cadastro central
- `app/admin/funcoes/*` -> funcoes e temas
- `app/admin/escalas/*` -> escalas publicas e operacao mensal

