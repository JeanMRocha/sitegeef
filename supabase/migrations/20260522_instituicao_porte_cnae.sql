-- Add porte and CNAE fields to instituicao table

alter table if exists public.instituicao
  add column if not exists porte text,
  add column if not exists cnae_principal text,
  add column if not exists cnae_descricao text,
  add column if not exists cnaes_secundarios jsonb default '[]'::jsonb;

-- Comment on columns
comment on column public.instituicao.porte is 'Porte da empresa: Microempresa, Pequena, Média, Grande';
comment on column public.instituicao.cnae_principal is 'Código CNAE da atividade econômica principal (ex: 94.91-0-00)';
comment on column public.instituicao.cnae_descricao is 'Descrição da atividade econômica principal';
comment on column public.instituicao.cnaes_secundarios is 'JSON array com CNAEs secundários [{código: ..., descrição: ...}]';
