# Agent.md

Este arquivo e o ponto de entrada operacional do projeto site GEEF.

## Regra principal

Antes de alterar codigo, documentacao, infraestrutura ou configuracao, o agente deve:

1. Ler `docs/INDEX.md`.
2. Identificar o modulo, fase ou integracao afetada.
3. Ler apenas os documentos necessarios para a tarefa.
4. Preservar segredos, credenciais e arquivos locais nao versionados.
5. Registrar decisoes estruturais em ADR antes de implementar mudancas irreversiveis.

## Conduta obrigatoria

- Nunca ler ou expor conteudo de `.secrets/` salvo pedido explicito e justificavel.
- Nunca commitar `.secrets/`, `.env`, chaves SSH, senhas, tokens ou service role keys.
- Nunca colocar `service_role`, senha de banco, chave privada SSH ou token de API em markdown versionado.
- Antes de criar um modulo, definir contrato, modelo de dados, permissao, eventos e plano de testes.
- Antes de alterar banco, criar ou atualizar ADR/PLAN do modulo afetado.
- Antes de deploy, validar checklist de seguranca, backup, rollback e observabilidade.

## Stack decidida

- Frontend principal: Next.js.
- Banco e auth inicial: Supabase.
- Infraestrutura: VPS Oracle para hospedagem principal, Cloudflare para DNS/proxy/seguranca, GitHub para repositorio e CI/CD.
- Backend adicional: permitido quando houver necessidade real. Pode ser Node.js ou Go conforme decisao registrada em ADR.

## Ordem de leitura

1. `docs/INDEX.md`
2. `docs/AUTOREFLEX_ADAPTADO.md`
3. `docs/PRODUCT_VISION.md`
4. `docs/ARCHITECTURE.md`
5. `docs/ROADMAP.md`
6. Documento do modulo em `docs/modules/{modulo}/INDEX.md`
7. PLAN ativo do modulo

## Base de conhecimento local

Quando o projeto ja tiver a rota ativa, o agente pode consultar `GET /api/knowledge`
para listar documentos indexados ou pesquisar por termo antes de mergulhar nos
arquivos manualmente. Isso e uma ferramenta interna do agente, nao um recurso
da interface publica.

## Criterios de qualidade

- Implementacao guiada por plano.
- Baixo acoplamento entre modulos.
- Controle de acesso e LGPD desde a modelagem.
- Testes proporcionais ao risco.
- Deploy reproduzivel.
- Sem segredo versionado.
