# Modelo relacional da instituição

Este documento resume a estrutura-alvo para a instituição no Supabase do GEEF.

## Objetivo

Manter a base pequena, consistente e fácil de evoluir:

- `public.instituicao` fica só com os dados centrais da casa
- os dados repetíveis ou dependentes viram tabelas filhas com `instituicao_id`
- CNAEs deixam de viver em JSONB e passam a ser linhas próprias

## Estrutura alvo

### `public.instituicao`

Campos centrais e estáveis:

- nome oficial
- nome curto
- CNPJ
- natureza jurídica
- porte
- data de fundação
- identidade visual
- descritivos institucionais
- estatuto
- status

### `public.instituicao_enderecos`

- 1 registro por instituição
- `instituicao_id` obrigatório
- usado como endereço oficial

### `public.instituicao_contato_tipos`

- lookup de tipos de contato
- escopado por instituição
- mantém o gerenciamento do dropdown em um único lugar

### `public.instituicao_contatos`

- 1:N com `instituicao`
- `instituicao_id` obrigatório
- `tipo_id` referencia `instituicao_contato_tipos`
- mantém telefone, email, site, redes sociais e responsável

### `public.contas_bancarias`

- 1:N com `instituicao`
- `instituicao_id` obrigatório
- mantém contas e PIX oficiais

### `public.instituicao_cnaes`

- 1:N com `instituicao`
- `instituicao_id` obrigatório
- `tipo = principal | secundario`
- substitui `cnae_principal`, `cnae_descricao` e `cnaes_secundarios` em JSON

## Regras de desenho

- Evitar repetir dados em JSON quando a informação precisa de filtro, validação ou lista
- Usar FK em tudo que é dependente da instituição
- Usar unique parcial quando o domínio exige apenas um registro principal
- Deixar lookup em tabela quando o valor pode crescer ou ser editado pelo admin

## Leitura e escrita

- O app deve ler `instituicao` como base e buscar as filhas por `instituicao_id`
- O app não deve mais depender de colunas JSON para CNAE
- A UI pode continuar mostrando o mesmo resumo, mas o armazenamento deve ficar normalizado

## Ponto de atenção

- Se surgir suporte a múltiplas instituições no futuro, esse modelo já está preparado
- Se a casa continuar singleton, as constraints ajudam a evitar duplicação acidental
- O próximo passo de limpeza é revisar se algum campo ainda está livre demais, como alguns textos auxiliares e enums implícitos

## Migration de referência

- A implementação desta modelagem fica concentrada em `supabase/migrations/20260523_instituicao_modelagem_total.sql`
- As migrations antigas de instituição foram removidas para evitar fontes paralelas de verdade
