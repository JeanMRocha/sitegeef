create table public.lgpd_registros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  pessoa_id uuid references public.pessoas on delete set null,
  categoria text not null,
  acao text not null,
  status text not null default 'registrado',
  versao text not null,
  escopo jsonb not null default '{}'::jsonb,
  origem text,
  canal text,
  ip text,
  user_agent text,
  referer text,
  consentido_em timestamptz default now(),
  revogado_em timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint lgpd_registros_categoria_check
    check (categoria in (
      'cookies',
      'privacidade',
      'termos_uso',
      'marketing',
      'whatsapp',
      'sensivel',
      'crianca',
      'upload',
      'checkout',
      'login',
      'finalidade_nova'
    )),
  constraint lgpd_registros_status_check
    check (status in ('registrado', 'aceito', 'recusado', 'ciencia', 'revogado', 'informado'))
);

alter table public.lgpd_registros enable row level security;

create policy "service_role can manage lgpd_registros"
  on public.lgpd_registros
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.lgpd_registros from anon, authenticated;
grant select, insert, update, delete on table public.lgpd_registros to service_role;

create index if not exists lgpd_registros_created_at_idx
  on public.lgpd_registros (created_at desc);

create index if not exists lgpd_registros_categoria_created_at_idx
  on public.lgpd_registros (categoria, created_at desc);

create index if not exists lgpd_registros_status_created_at_idx
  on public.lgpd_registros (status, created_at desc);

create index if not exists lgpd_registros_user_id_created_at_idx
  on public.lgpd_registros (user_id, created_at desc);

comment on table public.lgpd_registros is
  'Registro técnico de consentimentos, ciência e preferências LGPD.';
