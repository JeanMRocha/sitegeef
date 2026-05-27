# Runbook de Migration da Instituição

Este roteiro existe para aplicar a modelagem nova com segurança em banco já povoado.

## Arquivos envolvidos

- [supabase/migrations/20260523_instituicao_modelagem_total.sql](../supabase/migrations/20260523_instituicao_modelagem_total.sql)
- [supabase/migrations/20260524_instituicao_cleanup_legado.sql](../supabase/migrations/20260524_instituicao_cleanup_legado.sql)
- [supabase/migrations/20260525_instituicao_porte_cnpj_oficial.sql](../supabase/migrations/20260525_instituicao_porte_cnpj_oficial.sql)
- [docs/INSTITUICAO_MIGRATION_COMMANDS.md](INSTITUICAO_MIGRATION_COMMANDS.md)

## Ordem correta

1. Fazer backup completo do banco.
2. Aplicar a migration aditiva.
3. Validar schema e dados backfill.
4. Aplicar a cleanup destrutiva apenas se tudo estiver consistente.

## Execucao real ja validada

Neste checkout, a sequência foi aplicada com sucesso no remoto usando o token de acesso do projeto e a Management API do Supabase.

Ordem executada:

1. Snapshot lógico dos objetos afetados em `backups/`.
2. `supabase/migrations/20260523_instituicao_modelagem_total.sql`
3. Validação do backfill em `instituicao_contatos`, `instituicao_contato_tipos`, `instituicao_enderecos` e `contas_bancarias`
4. Snapshot lógico do schema normalizado em `backups/`
5. `supabase/migrations/20260524_instituicao_cleanup_legado.sql`

Resultado prático:

- `instituicao_contatos` passou a ter `instituicao_id` e `tipo_id`
- a coluna legada `tipo` foi removida
- a constraint legada de `instituicao_contato_tipos` foi removida
- o histórico remoto recebeu `instituicao_modelagem_total` e `instituicao_cleanup_legado`

## 1. Backup completo

Antes de qualquer alteração:

- Exportar o schema e os dados da base atual.
- Guardar o backup em local fora do banco de produção.
- Confirmar que existe ponto de restauração antes de seguir.
- Se `pg_dump`/`psql` nao estiverem disponiveis localmente, usar a Management API do Supabase para gerar snapshots lógicos dos objetos afetados.

Se houver incerteza sobre o estado atual, não aplicar a cleanup destrutiva.

## 2. Aplicar a migration aditiva

Executar primeiro:

- `supabase/migrations/20260523_instituicao_modelagem_total.sql`

Essa migration:

- cria o que não existe
- cria os vínculos por `instituicao_id`
- faz backfill dos dados legados
- preserva os dados existentes

## 3. Validar o resultado

Validar antes de qualquer limpeza:

- existe apenas uma instituição singleton
- `instituicao_enderecos` está vinculado por `instituicao_id`
- `instituicao_contato_tipos` está escopado por instituição
- `instituicao_contatos` está usando `instituicao_id` e `tipo_id`
- `contas_bancarias` está vinculado por `instituicao_id`
- `instituicao_cnaes` existe e contém principal e secundários em linhas separadas
- o app continua lendo e gravando sem regressão

Se algum desses pontos falhar, parar e corrigir antes de continuar.

## 4. Aplicar cleanup destrutivo

Somente depois do backup e da validação, executar:

- [supabase/migrations/20260524_instituicao_cleanup_legado.sql](../supabase/migrations/20260524_instituicao_cleanup_legado.sql)

Essa etapa remove apenas sobras do modelo antigo:

- `cnae_principal`
- `cnae_descricao`
- `cnaes_secundarios`
- `tipo` em `instituicao_contatos`
- constraint legada de tipo de contato

Antes de rodar essa etapa, confirme que:

- `instituicao_contatos` já tem `instituicao_id` e `tipo_id`
- o backfill não deixou linhas sem vínculo
- os backups lógicos da etapa anterior existem e foram revisados

Se a base já tinha rótulos antigos de porte, aplique também a migration de oficialização do CNPJ para converter para os códigos `00`, `01`, `03` e `05`.

## Regra de segurança

- Nunca rodar a cleanup destrutiva antes do backup.
- Nunca rodar a cleanup destrutiva sem validar o backfill.
- Se houver dúvida sobre perda de informação, parar e restaurar o backup antes de seguir.

## Resultado esperado

Ao final:

- a migration aditiva mantém o sistema funcionando em base já populada
- a cleanup deixa o schema final sem colunas legadas
- o modelo da instituição fica concentrado em tabelas relacionais com vínculo explícito
