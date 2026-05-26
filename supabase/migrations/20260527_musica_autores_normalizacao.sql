begin;

-- Create musica_autores table
create table if not exists public.musica_autores (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Add autor_id column to musicas table
alter table public.musicas add column if not exists autor_id uuid references public.musica_autores(id) on delete restrict;

-- Enable RLS on musica_autores
alter table public.musica_autores enable row level security;

-- Create RLS policies for musica_autores
drop policy if exists "service_role can manage musica_autores" on public.musica_autores;
create policy "service_role can manage musica_autores"
  on public.musica_autores
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.musica_autores from anon, authenticated;
grant select, insert, update, delete on table public.musica_autores to service_role;

-- Create indexes
create index if not exists musica_autores_nome_idx on public.musica_autores (lower(nome));
create index if not exists musicas_autor_id_idx on public.musicas (autor_id);

-- Trigger for updated_at
drop trigger if exists set_musica_autores_updated_at on public.musica_autores;
create trigger set_musica_autores_updated_at
before update on public.musica_autores
for each row execute function public.set_updated_at();

-- Migrate existing unique authors from musicas table to musica_autores
insert into public.musica_autores (nome)
select distinct trim(autor)
from public.musicas
where autor is not null and trim(autor) != ''
on conflict (nome) do nothing;

-- Update musicas.autor_id based on musicas.autor
update public.musicas m
set autor_id = ma.id
from public.musica_autores ma
where m.autor = ma.nome and m.autor_id is null;

commit;
