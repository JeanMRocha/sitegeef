# Estrutura do Módulo

## Entradas principais

- [app/admin/relatorios/page.tsx](../../../app/admin/relatorios/page.tsx)
- [app/admin/relatorios/actions.ts](../../../app/admin/relatorios/actions.ts)
- [lib/relatorios/pdf-export.ts](../../../lib/relatorios/pdf-export.ts)
- [app/admin/page.tsx](../../../app/admin/page.tsx)

## Papel do módulo

- Mostrar o estado geral da operação em uma tela de leitura rápida.
- Servir como hub para relatórios de módulos específicos.
- Concentrar números úteis para diretoria e operação.
- Oferecer caminhos curtos para aprofundar em financeiro, biblioteca, livraria, pessoas e atendimento.

## Padrão visual

- Hero curto com título e subtítulo.
- Cards de indicadores no topo.
- Blocos por domínio abaixo.
- CTA de exportação ou impressão quando fizer sentido.
- Estados vazios e de carregamento enxutos.

## Padrão de dados

- Buscar agregações em um único lugar.
- Reutilizar o mesmo recorte temporal em toda a página.
- Evitar query duplicada por card quando o mesmo total puder ser reaproveitado.
