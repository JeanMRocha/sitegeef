# Livraria + Biblioteca Híbrida GEEF

## Objetivo

Padronizar o controle de livros do GEEF como um único domínio com catálogo, exemplares físicos, vendas, empréstimos, devoluções, reservas e multas.

## Quando usar

- Criar ou revisar telas de livraria e biblioteca
- Modelar catálogo de livros da instituição
- Implementar venda, empréstimo, devolução, baixa ou reserva
- Ajustar disponibilidade de exemplares
- Definir fluxos admin para livros, exemplares e movimentações

## Regras centrais

- Trate `livro` como cadastro mestre.
- Trate `exemplar` ou `cópia` como unidade física rastreável.
- Não use ISBN como identificador do exemplar físico; mantenha um código interno por cópia.
- Venda e empréstimo são movimentações diferentes sobre o mesmo catálogo.
- Um exemplar só pode estar em um estado operacional por vez: disponível, reservado, emprestado, vendido, danificado ou baixado.

## Leitura complementar

- [catálogo e exemplares](livraria-biblioteca-hibrida/references/catalogo-e-exemplares.md)
- [fluxos admin](livraria-biblioteca-hibrida/references/fluxos-admin.md)
- [schema recomendado](livraria-biblioteca-hibrida/references/schema-recomendado.md)
