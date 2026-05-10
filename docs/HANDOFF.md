# Handoff

## Estado atual

O projeto ainda esta no inicio. Existem documentos de visao e bootstrap, mas nao ha aplicacao Next.js criada nem repositorio Git inicializado nesta pasta.

## Decisoes confirmadas

- Frontend: Next.js.
- MVP: somente site publico.
- Backend: Supabase no inicio, com possibilidade de API propria conforme necessidade.
- Hospedagem: VPS Oracle.
- DNS/seguranca: Cloudflare.
- CI/CD: GitHub para VPS.
- Multi-instituicao: preparar arquitetura desde o inicio, mas nao ativar experiencia completa no MVP.
- Documentacao: abrangente antes da implementacao.

## Proximas acoes recomendadas

1. Rotacionar credenciais Supabase que apareceram em markdown.
2. Confirmar que `.secrets/` contem apenas arquivos locais e esta fora do Git.
3. Inicializar Git local.
4. Criar `.env.example`.
5. Configurar MCPs/conectores: Supabase, GitHub e Cloudflare.
6. Validar SSH na VPS.
7. Criar app Next.js.
8. Criar pipeline CI.
9. Executar Fase 1 do site publico.

## Cuidados

- Nao ler nem imprimir segredos.
- Nao iniciar deploy antes de validar rollback.
- Nao criar banco multi-instituicao sem ADR.
- Nao implementar painel administrativo antes do site publico MVP.
