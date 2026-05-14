# AutoReflex adaptado ao GEEF

Este projeto nao implementa o Autoreflex completo. A adaptacao aqui e mais simples:
uma base interna de conhecimento para o agente, com leitura rapida de contexto
e busca textual leve.

## O que foi adaptado

- A ideia de transformar documentacao em conhecimento consultavel.
- O conceito de "skills" virou um indice de documentos operacionais.
- A recuperacao de contexto virou uma rota local no proprio Next.js.
- O foco passou a ser continuidade do projeto GEEF, nao um servidor vetorial completo.

## O que existe agora

- Um indice local de documentos em `lib/agent-knowledge.ts`.
- A rota interna `GET /api/knowledge` para listar fontes ou pesquisar por termo.
- O gate interno `GET /api/knowledge/gate` para obrigar a consulta antes do caso.
- O gate interno `POST /api/knowledge/cases` para registrar casos novos depois do fechamento.
- As docs mais importantes do projeto como fontes de conhecimento.

## Como usar

Listar fontes indexadas:

```powershell
curl http://localhost:3500/api/knowledge
```

Pesquisar um tema:

```powershell
curl "http://localhost:3500/api/knowledge?q=cloudflare%20tunnel&limit=5"
```

Consultar o gate antes do caso:

```powershell
curl -H "x-geef-agent-key: <chave>" http://localhost:3500/api/knowledge/gate
```

Registrar um caso novo:

```powershell
curl -X POST http://localhost:3500/api/knowledge/cases `
  -H "content-type: application/json" `
  -H "x-geef-agent-key: <chave>" `
  -d '{"title":"Exemplo","summary":"Resumo","symptom":"Sintoma","diagnosis":"Diagnostico","resolution":"Resolucao","impact":"Impacto","tags":["infra"],"source":"agente"}'
```

Modelo de payload para casos reais:

```json
{
  "title": "Cloudflare Tunnel 1033 e SSH instavel na VPS",
  "summary": "Caso de referencia para triagem de borda e origem.",
  "symptom": "Erro 1033, 502 ou 530, com SSH instavel.",
  "diagnosis": "A origem local nao estava respondendo de forma confiavel e o deploy estava fraco em runtime.",
  "resolution": "Reinstalar dependencias na VPS, reduzir o rsync e priorizar logs locais do cloudflared.",
  "impact": "Dominio sem origem confiavel e dificuldade de acesso operacional.",
  "tags": ["infra", "cloudflare", "tunnel", "vps"],
  "source": "agente",
  "references": [
    "docs/HANDOFF.md",
    "docs/CLOUDFLARE.md",
    "docs/OPS_LOGS.md"
  ]
}
```

## Fontes priorizadas

- `docs/HANDOFF.md`
- `docs/INCIDENTE_CLOUDFLARE_VPS.md`
- `docs/CLOUDFLARE.md`
- `docs/OPS_LOGS.md`
- `docs/CONNECTIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/SUPABASE.md`
- `docs/ROADMAP.md`
- `docs/Agent.md`

## Limites da adaptacao

- Nao ha Qdrant.
- Nao ha embeddings.
- A busca e textual e ranqueada por relevancia simples.
- O sistema serve para acelerar o trabalho do agente neste repositorio, nao para virar plataforma separada.
- A escrita de casos novos e controlada por gate e grava em `docs/cases/`.

## Quando usar

- Antes de uma investigacao de incidente.
- Antes de mexer em infra, deploy ou logs.
- Quando o agente precisar recuperar contexto sem reler tudo.
- Quando a resposta estiver nos docs e o problema for localizar onde ela esta.

## Publico-alvo

Esta base e para o agente operacional do projeto, nao para a interface publica do
visitante.

## Evolucao futura

Se o projeto precisar crescer, esta base pode ser trocada depois por:

- embeddings locais ou remotos;
- indexacao incremental;
- tags mais ricas por modulo;
- uma UI interna para consulta;
- integracao com Supabase ou outro banco para historico de conhecimento.
