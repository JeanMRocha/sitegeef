# Padrão Analítico

## Inspiração

Essa skill segue a lógica de painéis analíticos do Superset e do fork de referência:

- dataset primeiro
- filtros consistentes
- dashboards com visão geral
- drilldown para detalhes
- exportação para uso operacional

## Como aplicar no GEEF

- Trate cada módulo como uma fonte de métricas.
- Crie um painel resumo antes de qualquer detalhamento.
- Quando existir comparação temporal, mantenha mês/ano/período como filtro principal.
- Quando o volume crescer, prefira tabelas resumidas e páginas de detalhe separadas.

## O que evitar

- Repetir texto explicativo grande em cada card.
- Transformar relatório em tela de cadastro.
- Misturar dados de módulos sem separação clara.
- Criar consultas novas para números que já existem em um agregado compartilhável.

