# Catálogo Unificado de Créditos de Música

## Contexto

O módulo de músicas passou a usar um catálogo único para guardar créditos reaproveitáveis do cadastro:

- `autor`
- `versao`

Isso evita duplicação de lógica e permite que os dois campos usem a mesma origem de dados, sem misturar com a versão do sistema.

## Estrutura

A fonte única agora é `public.musica_creditos`, com:

- `id`
- `tipo` (`autor` ou `versao`)
- `nome`
- `criado_em`
- `atualizado_em`

O cadastro de música continua gravando os campos textuais:

- `musicas.autor`
- `musicas.versao`

Os dropdowns do admin passam a ler do mesmo catálogo, filtrando por `tipo`.

## Fluxo de uso

1. Ao criar ou editar uma música, o campo Autor consulta os créditos com `tipo = autor`.
2. O campo Versão consulta os créditos com `tipo = versao`.
3. Os botões `+` criam novos registros no mesmo catálogo, só mudando o tipo.
4. A música salva o texto selecionado, sem depender de um FK obrigatório.

## Migração aplicada

Arquivo local:

- `supabase/migrations/20260527030702_musica_creditos_unificados.sql`

O que a migration faz:

1. Cria `musica_creditos`
2. Copia os dados legados de `musica_autores` e `musica_versoes`
3. Retira as tabelas antigas após o backfill

## Verificação

```sql
SELECT tipo, nome
FROM musica_creditos
ORDER BY tipo, nome;
```

```sql
SELECT COUNT(*) FROM musica_creditos WHERE tipo = 'autor';
SELECT COUNT(*) FROM musica_creditos WHERE tipo = 'versao';
```

## Observações

- O catálogo unificado não altera a versão do sistema.
- O módulo interno continua com CRUDs separados na interface, apenas compartilhando a fonte de dados.
- Se surgirem duplicidades no catálogo legado, limpe antes do backfill ou ajuste a normalização do nome.
