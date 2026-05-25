begin;

-- Limpeza destrutiva da modelagem antiga da instituicao.
-- Execute somente depois de backup completo e validação da migration aditiva.

alter table public.instituicao
  drop column if exists cnae_principal,
  drop column if exists cnae_descricao,
  drop column if exists cnaes_secundarios;

alter table public.instituicao_contatos
  drop column if exists tipo;

alter table public.instituicao_contato_tipos
  drop constraint if exists instituicao_contato_tipos_label_key;

commit;
