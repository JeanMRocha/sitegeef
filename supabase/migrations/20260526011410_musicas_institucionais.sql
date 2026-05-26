begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'musica_parte_tipo'
  ) then
    create type public.musica_parte_tipo as enum ('estrofe', 'refrao', 'ponte', 'intro', 'cifra');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'musica_sessao_modo'
  ) then
    create type public.musica_sessao_modo as enum ('exibicao', 'catalogo');
  end if;
end $$;

create table if not exists public.musicas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  autor text not null,
  tom text,
  versao text,
  status text not null default 'ativa',
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint musicas_status_check check (status in ('ativa', 'rascunho', 'inativa'))
);

create table if not exists public.musica_partes (
  id uuid primary key default gen_random_uuid(),
  musica_id uuid not null references public.musicas(id) on delete cascade,
  ordem integer not null default 0,
  tipo public.musica_parte_tipo not null default 'estrofe',
  titulo text,
  conteudo text not null,
  cifra text,
  destaque boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.musica_sessoes (
  id uuid primary key default gen_random_uuid(),
  codigo_pareamento text not null unique,
  nome_tela text,
  musica_id uuid references public.musicas(id) on delete set null,
  modo public.musica_sessao_modo not null default 'exibicao',
  ativo boolean not null default true,
  ultimo_acesso_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.musicas enable row level security;
alter table public.musica_partes enable row level security;
alter table public.musica_sessoes enable row level security;

drop policy if exists "service_role can manage musicas" on public.musicas;
create policy "service_role can manage musicas"
  on public.musicas
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "service_role can manage musica_partes" on public.musica_partes;
create policy "service_role can manage musica_partes"
  on public.musica_partes
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "service_role can manage musica_sessoes" on public.musica_sessoes;
create policy "service_role can manage musica_sessoes"
  on public.musica_sessoes
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.musicas from anon, authenticated;
revoke all on table public.musica_partes from anon, authenticated;
revoke all on table public.musica_sessoes from anon, authenticated;

grant select, insert, update, delete on table public.musicas to service_role;
grant select, insert, update, delete on table public.musica_partes to service_role;
grant select, insert, update, delete on table public.musica_sessoes to service_role;

create index if not exists musicas_titulo_idx on public.musicas (lower(titulo));
create index if not exists musicas_autor_idx on public.musicas (lower(autor));
create index if not exists musicas_status_idx on public.musicas (status);
create index if not exists musica_partes_musica_ordem_idx on public.musica_partes (musica_id, ordem);
create index if not exists musica_sessoes_codigo_idx on public.musica_sessoes (codigo_pareamento);
create index if not exists musica_sessoes_musica_idx on public.musica_sessoes (musica_id);

drop trigger if exists set_musicas_updated_at on public.musicas;
create trigger set_musicas_updated_at
before update on public.musicas
for each row execute function public.set_updated_at();

drop trigger if exists set_musica_partes_updated_at on public.musica_partes;
create trigger set_musica_partes_updated_at
before update on public.musica_partes
for each row execute function public.set_updated_at();

drop trigger if exists set_musica_sessoes_updated_at on public.musica_sessoes;
create trigger set_musica_sessoes_updated_at
before update on public.musica_sessoes
for each row execute function public.set_updated_at();

commit;
