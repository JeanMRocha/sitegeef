# Dev Watchdog

O watchdog de desenvolvimento e um processo manual para manter `npm run dev` vivo enquanto voce estiver trabalhando.

## Objetivo

- Reiniciar o servidor local se ele cair.
- Monitorar a resposta em `http://127.0.0.1:3500`.
- Parar automaticamente quando voce fechar o terminal ou encerrar o processo.
- Nao iniciar com o Windows e nao virar servico persistente.

## Como usar

```powershell
npm run dev:watchdog
```

## O que ele faz

- Inicia `npm run dev`.
- Faz checagens periodicas de saude na porta `3500`.
- Se o processo morrer, ele sobe de novo.
- Se o processo ficar sem responder repetidamente, ele reinicia.

## Como parar

- `Ctrl+C` no terminal.
- Fechar a janela do terminal.

## Observacao

Se quiser apenas desenvolvimento simples, continue usando `npm run dev`.
O watchdog existe para as sessoes de trabalho em que voce quer tolerancia a queda.
