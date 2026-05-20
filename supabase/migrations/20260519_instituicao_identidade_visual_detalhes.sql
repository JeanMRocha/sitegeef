alter table if exists public.instituicao
  add column if not exists identidade_visual_letras_descricao text,
  add column if not exists identidade_visual_visual_descricao text;
