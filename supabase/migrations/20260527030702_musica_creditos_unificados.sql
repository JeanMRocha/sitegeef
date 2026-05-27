-- Catálogo unificado para autores e versões de músicas
create table if not exists public.musica_creditos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('autor', 'versao')),
  nome text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create unique index if not exists musica_creditos_tipo_nome_key
  on public.musica_creditos (tipo, nome);

create index if not exists musica_creditos_tipo_idx
  on public.musica_creditos (tipo);

create or replace function public.set_musica_creditos_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

drop trigger if exists trg_musica_creditos_atualizado_em on public.musica_creditos;

create trigger trg_musica_creditos_atualizado_em
before update on public.musica_creditos
for each row
execute function public.set_musica_creditos_atualizado_em();

alter table public.musica_creditos enable row level security;

drop policy if exists musica_creditos_service_role_manage on public.musica_creditos;

create policy musica_creditos_service_role_manage
on public.musica_creditos
for all
to service_role
using (true)
with check (true);

insert into public.musica_creditos (tipo, nome)
select 'autor', btrim(nome)
from public.musica_autores
where nome is not null and btrim(nome) <> ''
on conflict (tipo, nome) do nothing;

insert into public.musica_creditos (tipo, nome)
select 'versao', btrim(nome)
from public.musica_versoes
where nome is not null and btrim(nome) <> ''
on conflict (tipo, nome) do nothing;

comment on table public.musica_creditos is 'Catálogo unificado de autores e versões de músicas';
comment on column public.musica_creditos.tipo is 'Tipo do crédito: autor ou versao';
comment on column public.musica_creditos.nome is 'Nome exibido do crédito';

drop table if exists public.musica_autores cascade;
drop table if exists public.musica_versoes cascade;
