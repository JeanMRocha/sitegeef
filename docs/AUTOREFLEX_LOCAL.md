# Autoreflex Local com Ollama

## Objetivo

Manter o servidor de skills do GEEF rodando localmente em `http://127.0.0.1:8090`, com indexacao semantica via Ollama e um historico leve de erros/notes para consulta futura.

## Como subir

```bash
npm run autoreflex:serve
```

Atalho curto para uso sob demanda:

```bash
npm run autoreflex:up
```

O comando:
- assume que o Ollama ja esta disponivel localmente em `127.0.0.1:11434`;
- nao inicia o Ollama sozinho por padrao;
- tenta usar `nomic-embed-text` para embeddings;
- indexa `skills/`, `docs/` e docs raiz do projeto;
- expõe os endpoints esperados por `scripts/geef-skills.mjs`.

Se quiser permitir que o Autoreflex suba o Ollama automaticamente, use:

```bash
$env:AUTOREFLEX_START_OLLAMA = "1"
npm run autoreflex:serve
```

## Fluxo operacional

1. Abrir o projeto no terminal.
2. Garantir que o Ollama esteja ativo, se necessario, usando o aplicativo ou o comando manual.
3. Rodar `npm run autoreflex:serve` somente quando quiser consultar skills, indexar docs ou registrar notas.
4. Confirmar `http://127.0.0.1:8090/health` antes de depender do indice.

Se o Ollama nao estiver acessivel e `AUTOREFLEX_START_OLLAMA` nao estiver habilitado, o Autoreflex nao vai tentar iniciar o daemon sozinho.

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
npm run autoreflex:up
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
- `AUTOREFLEX_START_OLLAMA` - `1` para deixar o Autoreflex iniciar o Ollama, padrao desativado

## Observacoes

- O estado de indice fica em `.autoreflex/index.json`.
- A pasta `.autoreflex/` nao deve ser commitada.
- Se o Ollama nao estiver pronto e o auto-start estiver desativado, o bootstrap falha de forma explicita.
- Se o Ollama estiver pronto mas o modelo nao estiver disponivel, o servidor tenta o fallback lexical e recompila o indice quando o embedding ficar acessivel.
