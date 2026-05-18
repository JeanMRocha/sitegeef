begin;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios_sistema us
    where us.id = auth.uid()
  );
$$;

alter table if exists public.instituicao
  add column if not exists singleton_guard boolean not null default true;

update public.instituicao
set singleton_guard = true;

with ranked as (
  select
    id,
    row_number() over (
      order by criado_em nulls last, id asc
    ) as rn
  from public.instituicao
)
delete from public.instituicao i
using ranked r
where i.id = r.id
  and r.rn > 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_singleton_guard_true'
  ) then
    alter table public.instituicao
      add constraint instituicao_singleton_guard_true
      check (singleton_guard = true);
  end if;
end $$;

create unique index if not exists instituicao_singleton_guard_uidx
  on public.instituicao (singleton_guard);

alter table public.instituicao enable row level security;
alter table public.instituicao_enderecos enable row level security;
alter table public.instituicao_contatos enable row level security;
alter table public.contas_bancarias enable row level security;

grant select, insert, update on public.instituicao to authenticated;
grant select, insert, update on public.instituicao_enderecos to authenticated;
grant select, insert, update, delete on public.instituicao_contatos to authenticated;
grant select, insert, update, delete on public.contas_bancarias to authenticated;

drop policy if exists instituicao_select on public.instituicao;
create policy instituicao_select
  on public.instituicao
  for select
  using (public.is_admin_user());

drop policy if exists instituicao_insert on public.instituicao;
create policy instituicao_insert
  on public.instituicao
  for insert
  with check (public.is_admin_user());

drop policy if exists instituicao_update on public.instituicao;
create policy instituicao_update
  on public.instituicao
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_enderecos_select on public.instituicao_enderecos;
create policy instituicao_enderecos_select
  on public.instituicao_enderecos
  for select
  using (public.is_admin_user());

drop policy if exists instituicao_enderecos_insert on public.instituicao_enderecos;
create policy instituicao_enderecos_insert
  on public.instituicao_enderecos
  for insert
  with check (public.is_admin_user());

drop policy if exists instituicao_enderecos_update on public.instituicao_enderecos;
create policy instituicao_enderecos_update
  on public.instituicao_enderecos
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_contatos_select on public.instituicao_contatos;
create policy instituicao_contatos_select
  on public.instituicao_contatos
  for select
  using (public.is_admin_user());

drop policy if exists instituicao_contatos_insert on public.instituicao_contatos;
create policy instituicao_contatos_insert
  on public.instituicao_contatos
  for insert
  with check (public.is_admin_user());

drop policy if exists instituicao_contatos_update on public.instituicao_contatos;
create policy instituicao_contatos_update
  on public.instituicao_contatos
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_contatos_delete on public.instituicao_contatos;
create policy instituicao_contatos_delete
  on public.instituicao_contatos
  for delete
  using (public.is_admin_user());

drop policy if exists contas_bancarias_select on public.contas_bancarias;
create policy contas_bancarias_select
  on public.contas_bancarias
  for select
  using (public.is_admin_user());

drop policy if exists contas_bancarias_insert on public.contas_bancarias;
create policy contas_bancarias_insert
  on public.contas_bancarias
  for insert
  with check (public.is_admin_user());

drop policy if exists contas_bancarias_update on public.contas_bancarias;
create policy contas_bancarias_update
  on public.contas_bancarias
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists contas_bancarias_delete on public.contas_bancarias;
create policy contas_bancarias_delete
  on public.contas_bancarias
  for delete
  using (public.is_admin_user());

commit;
