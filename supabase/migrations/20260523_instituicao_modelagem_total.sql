begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'instituicao_cnae_tipo'
  ) then
    create type public.instituicao_cnae_tipo as enum ('principal', 'secundario');
  end if;
end $$;

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

create table if not exists public.instituicao (
  id                             uuid primary key default gen_random_uuid(),
  nome_oficial                   text not null,
  nome_curto                     text,
  cnpj                           text,
  natureza_juridica              text,
  porte                          text,
  data_fundacao                  date,
  logo_url                       text,
  logo_com_fundo_url             text,
  descricao                      text,
  historia                       text,
  missao                         text,
  visao                          text,
  valores                        text,
  estatuto_url                   text,
  identidade_visual_descricao    text,
  identidade_visual_composicao    text,
  identidade_visual_uso          text,
  identidade_visual_exemplos     text,
  identidade_visual_letras_descricao text,
  identidade_visual_visual_descricao text,
  cnae_principal                 text,
  cnae_descricao                 text,
  cnaes_secundarios              jsonb default '[]'::jsonb,
  status                         text default 'ativa',
  singleton_guard                boolean not null default true,
  criado_em                      timestamptz default now(),
  atualizado_em                  timestamptz default now()
);

create table if not exists public.instituicao_enderecos (
  id          uuid primary key default gen_random_uuid(),
  instituicao_id uuid,
  cep         text,
  logradouro  text,
  numero      text,
  complemento text,
  bairro      text,
  cidade      text,
  estado      text,
  maps_link   text,
  latitude    numeric,
  longitude   numeric
);

create table if not exists public.instituicao_contato_tipos (
  id          uuid primary key default gen_random_uuid(),
  instituicao_id uuid,
  label       text not null,
  ordem       integer not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.instituicao_contatos (
  id              uuid primary key default gen_random_uuid(),
  instituicao_id  uuid,
  tipo            text,
  tipo_id         uuid,
  telefone        text,
  whatsapp        text,
  email           text,
  instagram       text,
  facebook        text,
  youtube         text,
  site            text,
  responsavel_id  uuid references public.pessoas,
  ativo           boolean default true
);

create table if not exists public.contas_bancarias (
  id               uuid primary key default gen_random_uuid(),
  instituicao_id   uuid,
  nome             text not null,
  banco            text,
  agencia          text,
  conta            text,
  tipo_conta       text,
  titular          text,
  cpf_cnpj_titular text,
  chave_pix        text,
  tipo_chave_pix   text,
  finalidade       text,
  visibilidade     text default 'privada',
  ativo            boolean default true
);

create table if not exists public.instituicao_cnaes (
  id              uuid primary key default gen_random_uuid(),
  instituicao_id  uuid not null,
  tipo            public.instituicao_cnae_tipo not null,
  codigo          text not null,
  descricao       text,
  ordem           integer not null default 0,
  ativo           boolean not null default true,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

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

insert into public.instituicao (nome_oficial, nome_curto, singleton_guard)
select 'GEEF', 'GEEF', true
where not exists (
  select 1
  from public.instituicao
);

alter table public.instituicao
  add column if not exists nome_curto text,
  add column if not exists cnpj text,
  add column if not exists natureza_juridica text,
  add column if not exists porte text,
  add column if not exists data_fundacao date,
  add column if not exists logo_url text,
  add column if not exists logo_com_fundo_url text,
  add column if not exists descricao text,
  add column if not exists historia text,
  add column if not exists missao text,
  add column if not exists visao text,
  add column if not exists valores text,
  add column if not exists estatuto_url text,
  add column if not exists identidade_visual_descricao text,
  add column if not exists identidade_visual_composicao text,
  add column if not exists identidade_visual_uso text,
  add column if not exists identidade_visual_exemplos text,
  add column if not exists identidade_visual_letras_descricao text,
  add column if not exists identidade_visual_visual_descricao text,
  add column if not exists cnae_principal text,
  add column if not exists cnae_descricao text,
  add column if not exists cnaes_secundarios jsonb default '[]'::jsonb,
  add column if not exists status text default 'ativa',
  add column if not exists singleton_guard boolean not null default true,
  add column if not exists criado_em timestamptz default now(),
  add column if not exists atualizado_em timestamptz default now();

alter table public.instituicao_enderecos
  add column if not exists instituicao_id uuid,
  add column if not exists cep text,
  add column if not exists logradouro text,
  add column if not exists numero text,
  add column if not exists complemento text,
  add column if not exists bairro text,
  add column if not exists cidade text,
  add column if not exists estado text,
  add column if not exists maps_link text,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;

alter table public.instituicao_contato_tipos
  add column if not exists instituicao_id uuid,
  add column if not exists label text,
  add column if not exists ordem integer not null default 0,
  add column if not exists ativo boolean not null default true,
  add column if not exists criado_em timestamptz not null default now(),
  add column if not exists atualizado_em timestamptz not null default now();

alter table public.instituicao_contatos
  add column if not exists instituicao_id uuid,
  add column if not exists tipo text,
  add column if not exists tipo_id uuid,
  add column if not exists telefone text,
  add column if not exists whatsapp text,
  add column if not exists email text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists youtube text,
  add column if not exists site text,
  add column if not exists responsavel_id uuid,
  add column if not exists ativo boolean default true;

alter table public.contas_bancarias
  add column if not exists instituicao_id uuid,
  add column if not exists nome text,
  add column if not exists banco text,
  add column if not exists agencia text,
  add column if not exists conta text,
  add column if not exists tipo_conta text,
  add column if not exists titular text,
  add column if not exists cpf_cnpj_titular text,
  add column if not exists chave_pix text,
  add column if not exists tipo_chave_pix text,
  add column if not exists finalidade text,
  add column if not exists visibilidade text default 'privada',
  add column if not exists ativo boolean default true;

alter table public.instituicao_cnaes
  add column if not exists instituicao_id uuid,
  add column if not exists tipo public.instituicao_cnae_tipo,
  add column if not exists codigo text,
  add column if not exists descricao text,
  add column if not exists ordem integer default 0,
  add column if not exists ativo boolean default true,
  add column if not exists criado_em timestamptz default now(),
  add column if not exists atualizado_em timestamptz default now();

alter table public.contato_mensagens
  add column if not exists nome text,
  add column if not exists email text,
  add column if not exists telefone text,
  add column if not exists assunto text,
  add column if not exists mensagem text,
  add column if not exists pagina_origem text default '/contato',
  add column if not exists canal text default 'site',
  add column if not exists status text default 'novo',
  add column if not exists ip text,
  add column if not exists user_agent text,
  add column if not exists referer text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists respondido_em timestamptz,
  add column if not exists respondido_por uuid references auth.users,
  add column if not exists criado_em timestamptz default now(),
  add column if not exists atualizado_em timestamptz default now();

alter table public.instituicao enable row level security;
alter table public.instituicao_enderecos enable row level security;
alter table public.instituicao_contato_tipos enable row level security;
alter table public.instituicao_contatos enable row level security;
alter table public.contas_bancarias enable row level security;
alter table public.instituicao_cnaes enable row level security;
alter table public.contato_mensagens enable row level security;

grant select, insert, update on public.instituicao to authenticated;
grant select, insert, update on public.instituicao_enderecos to authenticated;
grant select, insert, update, delete on public.instituicao_contato_tipos to authenticated;
grant select, insert, update, delete on public.instituicao_contatos to authenticated;
grant select, insert, update, delete on public.contas_bancarias to authenticated;
grant select, insert, update, delete on public.instituicao_cnaes to authenticated;
grant select, insert, update, delete on public.contato_mensagens to authenticated;

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

drop policy if exists instituicao_contato_tipos_select on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_select
  on public.instituicao_contato_tipos
  for select
  using (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_insert on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_insert
  on public.instituicao_contato_tipos
  for insert
  with check (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_update on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_update
  on public.instituicao_contato_tipos
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_contato_tipos_delete on public.instituicao_contato_tipos;
create policy instituicao_contato_tipos_delete
  on public.instituicao_contato_tipos
  for delete
  using (public.is_admin_user());

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

drop policy if exists instituicao_cnaes_select on public.instituicao_cnaes;
create policy instituicao_cnaes_select
  on public.instituicao_cnaes
  for select
  using (public.is_admin_user());

drop policy if exists instituicao_cnaes_insert on public.instituicao_cnaes;
create policy instituicao_cnaes_insert
  on public.instituicao_cnaes
  for insert
  with check (public.is_admin_user());

drop policy if exists instituicao_cnaes_update on public.instituicao_cnaes;
create policy instituicao_cnaes_update
  on public.instituicao_cnaes
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists instituicao_cnaes_delete on public.instituicao_cnaes;
create policy instituicao_cnaes_delete
  on public.instituicao_cnaes
  for delete
  using (public.is_admin_user());

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

insert into storage.buckets (id, name, public)
values ('instituicao-assets', 'instituicao-assets', true)
on conflict (id) do nothing;

update public.instituicao
set singleton_guard = true;

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

update public.instituicao_enderecos
set instituicao_id = (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
)
where instituicao_id is null;

update public.instituicao_contato_tipos
set instituicao_id = (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
)
where instituicao_id is null;

update public.instituicao_contatos
set instituicao_id = (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
)
where instituicao_id is null;

update public.contas_bancarias
set instituicao_id = (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
)
where instituicao_id is null;

update public.instituicao_cnaes
set instituicao_id = (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
)
where instituicao_id is null;

insert into public.instituicao_contato_tipos (instituicao_id, label, ordem, ativo)
select distinct
  c.instituicao_id,
  trim(c.tipo),
  999,
  true
from public.instituicao_contatos c
where c.tipo is not null
  and trim(c.tipo) <> ''
  and c.instituicao_id is not null
  and not exists (
    select 1
    from public.instituicao_contato_tipos t
    where t.instituicao_id = c.instituicao_id
      and t.label = trim(c.tipo)
  )
on conflict do nothing;

create unique index if not exists instituicao_contato_tipos_instituicao_label_uidx
  on public.instituicao_contato_tipos (instituicao_id, label);

create index if not exists instituicao_contato_tipos_instituicao_ordem_idx
  on public.instituicao_contato_tipos (instituicao_id, ordem, label);

create index if not exists instituicao_contatos_instituicao_tipo_idx
  on public.instituicao_contatos (instituicao_id, tipo_id);

create index if not exists contas_bancarias_instituicao_idx
  on public.contas_bancarias (instituicao_id, ativo);

create unique index if not exists instituicao_enderecos_instituicao_id_unique
  on public.instituicao_enderecos (instituicao_id);

create unique index if not exists instituicao_cnaes_principal_uidx
  on public.instituicao_cnaes (instituicao_id)
  where tipo = 'principal';

create unique index if not exists instituicao_cnaes_secundario_codigo_uidx
  on public.instituicao_cnaes (instituicao_id, codigo)
  where tipo = 'secundario';

create index if not exists instituicao_cnaes_instituicao_tipo_ordem_idx
  on public.instituicao_cnaes (instituicao_id, tipo, ordem, codigo);

update public.instituicao_contatos c
set tipo_id = t.id
from public.instituicao_contato_tipos t
where c.instituicao_id = t.instituicao_id
  and c.tipo_id is null
  and trim(coalesce(c.tipo, '')) = t.label;

update public.instituicao_contatos c
set tipo_id = t.id
from public.instituicao_contato_tipos t
where c.instituicao_id = t.instituicao_id
  and c.tipo_id is null
  and t.label = 'Outro';

update public.instituicao_contatos c
set tipo_id = t.id
from public.instituicao_contato_tipos t
where c.instituicao_id = t.instituicao_id
  and c.tipo_id is null
  and t.label = 'Contato';

insert into public.instituicao_contato_tipos (instituicao_id, label, ordem, ativo)
select
  b.id,
  label,
  ordem,
  true
from (
  values
    ('WhatsApp', 10),
    ('Telefone', 20),
    ('Email', 30),
    ('Instagram', 40),
    ('Facebook', 50),
    ('YouTube', 60),
    ('Site', 70),
    ('Outro', 80)
) as defaults(label, ordem)
cross join (
  select id
  from public.instituicao
  order by criado_em nulls last, id asc
  limit 1
) as b
on conflict (instituicao_id, label) do nothing;

insert into public.instituicao_cnaes (instituicao_id, tipo, codigo, descricao, ordem, ativo)
select
  i.id,
  'principal'::public.instituicao_cnae_tipo,
  trim(i.cnae_principal),
  nullif(trim(i.cnae_descricao), ''),
  0,
  true
from public.instituicao i
where coalesce(trim(i.cnae_principal), '') <> ''
   or coalesce(trim(i.cnae_descricao), '') <> ''
on conflict do nothing;

insert into public.instituicao_cnaes (instituicao_id, tipo, codigo, descricao, ordem, ativo)
select
  i.id,
  'secundario'::public.instituicao_cnae_tipo,
  trim(coalesce(elem->>'codigo', elem->>'código')),
  nullif(trim(coalesce(elem->>'descricao', elem->>'descrição')), ''),
  999,
  true
from public.instituicao i
cross join lateral jsonb_array_elements(coalesce(i.cnaes_secundarios, '[]'::jsonb)) as elem
where coalesce(trim(coalesce(elem->>'codigo', elem->>'código')), '') <> ''
on conflict do nothing;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_contato_tipos_label_key'
  ) then
    alter table public.instituicao_contato_tipos
      drop constraint instituicao_contato_tipos_label_key;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_enderecos_instituicao_id_fkey'
  ) then
    alter table public.instituicao_enderecos
      add constraint instituicao_enderecos_instituicao_id_fkey
      foreign key (instituicao_id) references public.instituicao (id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_contato_tipos_instituicao_id_fkey'
  ) then
    alter table public.instituicao_contato_tipos
      add constraint instituicao_contato_tipos_instituicao_id_fkey
      foreign key (instituicao_id) references public.instituicao (id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_contatos_instituicao_id_fkey'
  ) then
    alter table public.instituicao_contatos
      add constraint instituicao_contatos_instituicao_id_fkey
      foreign key (instituicao_id) references public.instituicao (id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_contatos_tipo_id_fkey'
  ) then
    alter table public.instituicao_contatos
      add constraint instituicao_contatos_tipo_id_fkey
      foreign key (tipo_id) references public.instituicao_contato_tipos (id) on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contas_bancarias_instituicao_id_fkey'
  ) then
    alter table public.contas_bancarias
      add constraint contas_bancarias_instituicao_id_fkey
      foreign key (instituicao_id) references public.instituicao (id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_cnaes_instituicao_id_fkey'
  ) then
    alter table public.instituicao_cnaes
      add constraint instituicao_cnaes_instituicao_id_fkey
      foreign key (instituicao_id) references public.instituicao (id) on delete cascade;
  end if;
end $$;

alter table public.instituicao_cnaes
  alter column instituicao_id set not null,
  alter column tipo set not null,
  alter column codigo set not null,
  alter column ordem set not null,
  alter column ativo set not null;

alter table public.instituicao_enderecos
  alter column instituicao_id set not null;

alter table public.instituicao_contato_tipos
  alter column instituicao_id set not null,
  alter column label set not null,
  alter column ordem set not null,
  alter column ativo set not null;

alter table public.instituicao_contatos
  alter column instituicao_id set not null;

alter table public.contas_bancarias
  alter column instituicao_id set not null;

alter table public.contato_mensagens
  alter column nome set not null,
  alter column email set not null,
  alter column mensagem set not null;

create index if not exists contato_mensagens_status_idx
  on public.contato_mensagens (status);

create index if not exists contato_mensagens_criado_em_idx
  on public.contato_mensagens (criado_em desc);

update public.instituicao_contatos
set tipo_id = null
where tipo_id is not null
  and not exists (
    select 1
    from public.instituicao_contato_tipos t
    where t.id = public.instituicao_contatos.tipo_id
  );

commit;
