# Fluxos Admin

## Telas que a skill deve orientar

- lista de livros
- detalhe do livro
- novo livro
- edição do livro
- lista de exemplares
- edição de exemplar
- registrar venda
- registrar empréstimo
- registrar devolução
- reservar exemplar

## Fluxo de venda

1. localizar o livro no catálogo
2. selecionar um exemplar disponível
3. registrar a movimentação
4. marcar o exemplar como vendido
5. revalidar a listagem e a visão do livro

## Fluxo de empréstimo

1. localizar o livro no catálogo
2. selecionar um exemplar emprestável
3. registrar o usuário
4. salvar data prevista de devolução
5. marcar o exemplar como emprestado
6. gerar multa apenas quando houver atraso ou dano

## Fluxo de devolução

1. localizar o empréstimo ativo
2. registrar data real
3. atualizar a condição na devolução
4. devolver o exemplar ao estado disponível, reservado ou danificado
5. gerar ou atualizar multa quando necessário

## Regras de tela

- A ação principal deve ficar no cabeçalho quando a página for longa.
- O estado de sucesso ou erro deve usar o módulo global de notificações.
- Listas vazias devem explicar o próximo passo com economia de texto.
- Não duplique a mesma ação em cabeçalho e rodapé sem necessidade.

