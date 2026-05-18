begin;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
set search_path = public
as $$
  select
    exists (
      select 1
      from public.usuarios_sistema us
      where us.id = auth.uid()
    )
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'site_role', '') = 'administrador';
$$;

commit;
