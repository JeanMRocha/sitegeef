begin;

alter table public.pessoas enable row level security;
alter table public.usuarios_sistema enable row level security;

drop policy if exists pessoas_select on public.pessoas;
create policy pessoas_select
  on public.pessoas
  for select
  using (public.is_admin_user());

drop policy if exists usuarios_sistema_select_self on public.usuarios_sistema;
create policy usuarios_sistema_select_self
  on public.usuarios_sistema
  for select
  using (id = auth.uid());

commit;
