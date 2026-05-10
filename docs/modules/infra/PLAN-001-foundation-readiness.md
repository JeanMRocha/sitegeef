# PLAN-001: Foundation Readiness

## Objetivo

Preparar acessos, conectores, seguranca, Git, VPS, Cloudflare, Supabase e CI/CD antes da implementacao do site publico.

## Escopo

- Proteger segredos.
- Inicializar Git.
- Configurar GitHub remoto.
- Validar Supabase MCP.
- Validar Cloudflare/dominio.
- Validar VPS e SSH.
- Preparar deploy.
- Criar esqueleto Next.js.

## Tarefas

1. Seguranca local
   - [x] Confirmar `.gitignore`.
   - [x] Criar `.env.example`.
   - [x] Remover credenciais reais do markdown versionado.
   - [x] Garantir que `.secrets/` nao sera versionado.

2. GitHub
   - [x] Inicializar Git local.
   - [x] Conectar ao repositorio remoto.
   - [x] Criar branch principal.
   - [ ] Configurar protecao basica antes de uso colaborativo.

3. Supabase
   - [x] Configurar MCP.
   - [x] Validar autenticacao.
   - [ ] Confirmar project ref por ferramenta Supabase apos recarregar sessao.
   - [ ] Nao criar schema definitivo antes de ADR.

4. Cloudflare
   - [x] Criar MCP especifico `cloudflare-geef`.
   - [x] Validar autenticacao OAuth.
   - [ ] Validar acesso ao dominio apos recarregar sessao.
   - [ ] Mapear DNS atual.
   - [ ] Planejar proxy, SSL e WAF.
   - [ ] Registrar decisoes antes de apontar producao.

5. VPS
   - [ ] Testar SSH.
   - [ ] Atualizar sistema.
   - [ ] Configurar firewall.
   - [ ] Criar usuario de deploy.
   - [ ] Definir rollback.

6. CI/CD
   - [ ] Criar pipeline de build.
   - [ ] Criar pipeline de deploy.
   - [ ] Guardar segredos no GitHub Secrets.
   - [ ] Testar deploy em ambiente controlado.

7. Next.js
   - [ ] Criar app.
   - [ ] Configurar TypeScript.
   - [ ] Configurar lint, testes e build.
   - [ ] Criar estrutura inicial de modulos.

## Criterios de conclusao

- Nenhum segredo versionado.
- Git inicializado e conectado.
- Acessos externos validados.
- VPS pronta para receber deploy.
- Cloudflare preparado.
- CI executando build.
- Next.js criado com build verde.

## Fora de escopo

- Banco final.
- Painel admin.
- Financeiro.
- Atendimento fraterno.
- Multi-instituicao ativa.
