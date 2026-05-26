# Admin Regression Notes

Este documento consolida as mudancas recentes na area interna do GEEF e os pontos que mais tendem a regredir.

## Escopo coberto

- `app/admin/usuarios/*`
- `app/admin/governanca/*`
- `app/admin/pessoas/*`
- `app/admin/pessoas/nova/*`
- `app/admin/layout.tsx`
- `components/admin/*`
- `lib/auth/permissions.ts`
- `styles/admin.css`
- `app/favicon.ico/route.ts` foi removido e nao deve voltar enquanto `public/favicon.ico` for a fonte unica.

## Mudancas realizadas

### Usuarios

- A listagem passou a usar a base de `supabase.auth.admin.listUsers()`.
- O complemento com `usuarios_sistema` continua, mas nao pode quebrar a pagina.
- Contas de teste do Codex sao filtradas por padroes de email e metadata.
- O proprio usuario autenticado deve aparecer na listagem.
- O proprio usuario nao deve poder se autoexcluir, mas precisa continuar visivel.

### Governanca

- As consultas de `diretorias`, `cargos`, `cargo_ocupacoes` e `assembleias` precisam falhar em fallback silencioso.
- A pagina principal de governanca deve continuar renderizando mesmo que o schema cache do Supabase esteja atrasado.
- O erro esperado de PostgREST nao deve mais ser tratado como erro visual no console.

### Pessoas

- A listagem de pessoas precisa continuar funcional mesmo quando o Supabase retornar erro vazio ou schema incompleto.
- `getPessoas` e `getPessoaById` devem retornar fallback vazio/null sem expor ruido no console.
- O formulario de nova pessoa ficou em fluxo por abas, com persistencia por etapa.

### Shell admin

- O layout do admin precisa continuar fluido em resize.
- `max-width` fixo em cards, abas e formularios tende a travar a experiencia e nao deve voltar.
- O cabeçalho de `Nova Pessoa` deve manter o titulo curto e os botoes a direita.

## Regras de regressao

### Nao reintroduzir

- `console.error` para falhas esperadas do Supabase quando o codigo ja tem fallback.
- `route.ts` para favicon concorrendo com `public/favicon.ico`.
- `max-width` fixo em containers centrais do admin.
- leitura de permissao que derruba a pagina quando `usuarios_sistema` nao existe.

### Manter

- Fallback `[]` / `null` para leituras de admin.
- Filtro de contas de teste do Codex na area de usuarios.
- Persistencia passo a passo no wizard de pessoas.
- Responsividade do shell admin com largura adaptativa.

## Padroes de alerta

Rever se aparecer qualquer um destes trechos:

```regex
Falha ao carregar pessoas
Falha ao complementar usuarios_sistema
Falha ao ler usuarios_sistema em getUserPermissions
Falha ao carregar diretorias
Falha ao carregar cargos
Falha ao carregar cargo_ocupacoes
Falha ao carregar assembleias
Could not find the module .* React Client Manifest
Refused to apply style from .* MIME type \('text/plain'\)
Failed to load resource: the server responded with a status of 404
```

## Verificacao minima antes de fechar

1. Reiniciar `next dev -p 3500` em sessao limpa.
2. Acessar `/admin/usuarios`, `/admin/governanca` e `/admin/pessoas`.
3. Confirmar que os assets `/_next/static/css/app/layout.css` e `/_next/static/chunks/main-app.js` respondem `200`.
4. Confirmar ausencia de overlay de erro do Next.
5. Se `next build` foi executado, reiniciar o dev server antes de validar o browser.

## Observacao operacional

O `next build` pode deixar a `.next` em estado diferente do `next dev` se os dois rodarem no mesmo checkout ao mesmo tempo. Depois de build, sempre suba o dev server de novo antes de confiar nos chunks/CSS do browser.

## Incidente de assets Next

### Sintoma

- O browser pode mostrar `Refused to apply style from ... MIME type ('text/plain')`.
- Em paralelo, podem aparecer `404` para `/_next/static/css/app/layout.css`, `/_next/static/css/app/admin/layout.css`, `/_next/static/chunks/main-app.js`, `/_next/static/chunks/app-pages-internals.js` e `/_next/static/chunks/app/layout.js`.

### Diagnostico rapido

1. Verificar se existe apenas um runtime ativo na porta `3500`.
2. Testar a URL exata do asset no navegador ou com `curl`.
3. Confirmar se o arquivo responde `200` com `text/css` ou `application/javascript`.
4. Se o HTML vier de uma sessao antiga, fazer hard refresh ou abrir aba anonima.

### Solucao

- Se o problema surgir depois de `next build`, reiniciar o `next dev` antes de testar o browser.
- Se o servidor estiver em modo standalone, nao misturar a validacao com o `next dev` aberto no mesmo checkout.
- Se a rota continuar devolvendo `404 text/plain`, tratar como mismatch de cache/build antes de suspeitar do CSS.

### Prevencao

- Sempre validar assets diretos antes de mexer em layout.
- Nao concluir que a pagina "sem estilo" significa CSS quebrado.
- Manter a verificacao minima com os assets de layout e `main-app.js` antes de encerrar um ajuste visual.
