# Schema Recomendado

## Tabelas lógicas

- `livros`
- `exemplares_livros`
- `movimentos_livros`
- `emprestimos_livros`
- `reservas_livros`
- `multas_livros`

## Diretrizes

- `livros` guarda o cadastro mestre.
- `exemplares_livros` guarda cada cópia física.
- `movimentos_livros` guarda venda, empréstimo, devolução, reserva e baixa.
- `emprestimos_livros` pode existir como visão de negócio ou tabela específica para empréstimos ativos e encerrados.
- `multas_livros` guarda cobrança e pagamento.

## Campos importantes

- `livros.isbn` representa a edição do livro, não o exemplar físico.
- `exemplares_livros.codigo_interno` identifica a cópia física.
- `exemplares_livros.status` controla disponibilidade.
- `exemplares_livros.condicao` controla conservação.
- `movimentos_livros.tipo` classifica o evento.

## Observação de implementação

Se o projeto já tiver tabelas existentes com nomes diferentes, mantenha a intenção do domínio e adapte os nomes ao schema real antes de criar migração nova.

