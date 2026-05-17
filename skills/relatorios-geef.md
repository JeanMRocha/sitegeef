# Relatórios GEEF

## Objetivo

Padronizar a camada de relatórios do GEEF como um hub profissional de indicadores, painéis, filtros, exportação e visões por módulo, inspirado na abordagem dataset-centric do Superset.

## Quando usar

- Criar ou revisar páginas de relatórios
- Montar dashboards executivos ou operacionais
- Exibir KPIs, séries temporais, totais e comparativos
- Exportar relatórios em PDF ou formato pronto para impressão
- Criar visões analíticas para financeiro, pessoas, livraria, biblioteca, atendimento, APSE, estudos, escalas ou documentos

## Regras centrais

- Relatório é leitura, não mutação.
- Centralize agregações em `actions.ts` ou `lib/relatorios/`.
- Use filtros curtos e reutilizáveis: mês, ano, período, módulo, status.
- Prefira cards, tabelas resumidas, badges e drilldowns curtos.
- Não despeje texto fixo longo na tela; use tooltip quando o contexto for essencial.
- Quando houver exportação, use o helper de PDF/print do projeto.
- Quando houver dados ausentes, mostre fallback limpo em vez de quebrar a visão.

## Leitura complementar

- [estrutura do módulo](relatorios-geef/references/estrutura-do-modulo.md)
- [padrão analítico](relatorios-geef/references/padrao-analitico.md)
- [exportação e cache](relatorios-geef/references/exportacao-e-cache.md)

