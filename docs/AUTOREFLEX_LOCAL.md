# Autoreflex Local com Ollama

## Objetivo

Manter o servidor de skills do GEEF rodando localmente em `http://127.0.0.1:8090`, com indexacao semantica via Ollama e um historico leve de erros/notes para consulta futura.

## Como subir

```bash
npm run autoreflex:serve
```

O comando:
- sobe o Ollama local se a API em `127.0.0.1:11434` nao estiver respondendo;
- tenta usar `nomic-embed-text` para embeddings;
- indexa `skills/`, `docs/` e docs raiz do projeto;
- expõe os endpoints esperados por `scripts/geef-skills.mjs`.

## Endpoints

- `GET /health`
- `POST /agent/skills/search`
- `POST /agent/skills/get`
- `POST /agent/skills/index`
- `POST /agent/knowledge/record`

## Registro de erros e aprendizados

Use a API de notas para gravar um incidente, workaround ou decisao:

```bash
npm run autoreflex:note -- "titulo" "texto da nota"
```

O registro vai para `.autoreflex/notes/` e entra no indice automaticamente.

## Comandos uteis

```bash
npm run autoreflex:health
npm run autoreflex:index
npm run skills:health
npm run skills:search "padrão admin"
```

## Variaveis de ambiente

- `AUTOREFLEX_PORT` - porta do servidor, padrao `8090`
- `AUTOREFLEX_HOST` - host de bind, padrao `127.0.0.1`
- `AUTOREFLEX_OLLAMA_URL` - API do Ollama, padrao `http://127.0.0.1:11434`
- `AUTOREFLEX_EMBED_MODEL` - modelo de embeddings, padrao `nomic-embed-text`

## Observacoes

- O estado de indice fica em `.autoreflex/index.json`.
- A pasta `.autoreflex/` nao deve ser commitada.
- Se o Ollama nao estiver pronto, o servidor funciona em fallback lexical ate o modelo ser disponibilizado.
