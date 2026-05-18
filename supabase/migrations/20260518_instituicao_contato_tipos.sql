create table if not exists public.instituicao_contato_tipos (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  ordem integer not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.instituicao_contato_tipos enable row level security;

grant select, insert, update, delete on public.instituicao_contato_tipos to authenticated;

drop policy if exists instituicao_contato_tipos_select on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_select
  on public.instituicao_contato_tipos
  for select
  to authenticated
  using (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_insert on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_insert
  on public.instituicao_contato_tipos
  for insert
  to authenticated
  with check (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_update on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_update
  on public.instituicao_contato_tipos
  for update
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_delete on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_delete
  on public.instituicao_contato_tipos
  for delete
  to authenticated
  using (public.is_admin_user());

insert into public.instituicao_contato_tipos (label, ordem)
values
  ('WhatsApp', 10),
  ('Telefone', 20),
  ('Email', 30),
  ('Instagram', 40),
  ('Facebook', 50),
  ('YouTube', 60),
  ('Site', 70),
  ('Outro', 80)
on conflict (label) do nothing;
