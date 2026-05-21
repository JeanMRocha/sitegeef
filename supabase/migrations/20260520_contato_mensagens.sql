create table if not exists public.contato_mensagens (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  email           text not null,
  telefone        text,
  assunto         text,
  mensagem        text not null,
  pagina_origem   text default '/contato',
  canal           text default 'site',
  status          text default 'novo',
  ip              text,
  user_agent      text,
  referer         text,
  metadata        jsonb default '{}'::jsonb,
  respondido_em   timestamptz,
  respondido_por  uuid references auth.users,
  criado_em       timestamptz default now(),
  atualizado_em   timestamptz default now()
);

alter table public.contato_mensagens enable row level security;

grant select, insert, update, delete on public.contato_mensagens to authenticated;

create index if not exists contato_mensagens_status_idx
  on public.contato_mensagens (status);

create index if not exists contato_mensagens_criado_em_idx
  on public.contato_mensagens (criado_em desc);

drop policy if exists contato_mensagens_select on public.contato_mensagens;
create policy contato_mensagens_select
  on public.contato_mensagens
  for select
  using (public.is_admin_user());

drop policy if exists contato_mensagens_insert on public.contato_mensagens;
create policy contato_mensagens_insert
  on public.contato_mensagens
  for insert
  with check (public.is_admin_user());

drop policy if exists contato_mensagens_update on public.contato_mensagens;
create policy contato_mensagens_update
  on public.contato_mensagens
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists contato_mensagens_delete on public.contato_mensagens;
create policy contato_mensagens_delete
  on public.contato_mensagens
  for delete
  using (public.is_admin_user());

