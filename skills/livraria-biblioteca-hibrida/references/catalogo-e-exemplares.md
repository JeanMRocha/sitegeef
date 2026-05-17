# Catálogo e Exemplares

## Modelo recomendado

### 1. Livro

Cadastro mestre com os dados bibliográficos e comerciais:

- título
- autor
- editora
- categoria
- descrição
- capa
- preço de venda
- ISBN da edição

### 2. Exemplar

Registro físico rastreável de uma cópia:

- código interno único
- livro_id
- tipo de uso: venda, empréstimo ou ambos
- status operacional
- condição física
- localização
- preço aplicado quando houver venda
- observações internas

### 3. Movimento

Evento que altera o estado do exemplar:

- venda
- empréstimo
- devolução
- reserva
- baixa
- dano

## Regras práticas

- O mesmo livro pode ter vários exemplares.
- O catálogo mostra o livro.
- A operação diária age sobre o exemplar.
- O status do exemplar precisa ser a fonte da disponibilidade.
- O histórico deve sempre ficar no movimento, nunca só no campo atual.

## Recomendações de UX

- Mostre um cartão-resumo do livro e uma lista de exemplares abaixo.
- Destaque disponibilidade por cor e ícone.
- Use tooltips curtos para condição, dano e multa.
- Evite textos longos fixos na página; prefira badges e ícones.

