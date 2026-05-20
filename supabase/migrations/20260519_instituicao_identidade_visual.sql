alter table if exists public.instituicao
  add column if not exists logo_com_fundo_url text,
  add column if not exists identidade_visual_descricao text,
  add column if not exists identidade_visual_composicao text,
  add column if not exists identidade_visual_uso text,
  add column if not exists identidade_visual_exemplos text;
