# Arquitetura Tecnica

## Decisoes iniciais

- Frontend: Next.js.
- Linguagem primaria do frontend: TypeScript.
- UI: Tailwind CSS com componentes acessiveis e reutilizaveis.
- Banco/Auth inicial: Supabase.
- Hospedagem principal: VPS Oracle.
- DNS, proxy, SSL e seguranca de borda: Cloudflare.
- Repositorio e CI/CD: GitHub.

## Backend

O projeto pode ter dois caminhos de backend:

- Supabase direto para autenticacao, banco, storage, policies e funcoes simples.
- API propria quando houver regras complexas, integracoes sensiveis, orquestracao, jobs ou isolamento operacional.

Node.js e Go sao permitidos, mas a escolha por modulo deve ser registrada em ADR. Como padrao pragmatico:

- Node.js combina melhor com Next.js, SSR, BFF e integracoes web.
- Go combina melhor com servicos internos, jobs, automacoes, integrações de alta confiabilidade e binarios simples para VPS.

## Multi-instituicao

Decisao inicial: preparar a arquitetura desde o inicio sem ativar a experiencia multi-instituicao no MVP.

Consequencias:

- Modelos de dados importantes devem prever `institution_id`.
- Permissoes futuras devem considerar escopo por instituicao.
- Conteudo publico inicial pode assumir GEEF como instituicao padrao.
- Nao criar gambiarras com dados globais impossiveis de separar depois.

## Limites modulares

Modulos nao devem depender diretamente do estado interno de outros modulos. A integracao deve acontecer por contratos, eventos, APIs ou servicos publicos.

Modulos previstos:

- `core`: tipos base, validacoes comuns, IDs, datas, erros.
- `infra`: VPS, Cloudflare, GitHub, CI/CD, deploy, observabilidade.
- `security`: segredos, LGPD, RLS, auditoria, acesso.
- `institutions`: instituicoes, hierarquia e identidade visual.
- `public-site`: site publico institucional.
- `content`: noticias, artigos, paginas e midias.
- `agenda`: eventos, atividades fixas, presenca futura.
- `auth`: autenticacao e sessoes.
- `users`: usuarios, frequentadores, trabalhadores.
- `finance`: tesouraria futura.
- `attendance`: atendimento fraterno futuro.

## IDs

Rotas publicas nao devem expor IDs sequenciais. O projeto deve usar identificadores publicos curtos e nao previsiveis.

## Dados e RLS

Todo dado sensivel deve ser modelado com:

- finalidade;
- escopo de acesso;
- periodo de retencao;
- politica de exclusao ou anonimizacao;
- auditoria;
- RLS quando exposto pelo Supabase.

## Deploy alvo

Fluxo desejado:

1. Commit no GitHub.
2. CI executa lint, typecheck, testes e build.
3. Deploy para VPS por GitHub Actions ou runner controlado.
4. VPS roda aplicacao via processo supervisionado ou container.
5. Cloudflare aponta dominio para VPS com SSL, WAF e regras basicas.

Nenhum deploy deve depender de copiar arquivos manualmente para producao.
