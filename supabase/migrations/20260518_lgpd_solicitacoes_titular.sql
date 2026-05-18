create table public.lgpd_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  pessoa_id uuid references public.pessoas,
  user_id uuid not null,
  titular_nome text,
  titular_email text,
  request_type text not null,
  details text,
  status text not null default 'aberta',
  responsavel_id uuid references public.pessoas,
  resposta text,
  prazo_resposta date,
  resolvido_em timestamptz,
  origem text default 'minha-area',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint lgpd_solicitacoes_request_type_check
    check (request_type in ('acesso', 'correcao', 'revogacao', 'eliminacao')),
  constraint lgpd_solicitacoes_status_check
    check (status in ('aberta', 'em_andamento', 'respondida', 'encerrada'))
);

alter table public.lgpd_solicitacoes enable row level security;

create policy "service_role can manage lgpd_solicitacoes"
  on public.lgpd_solicitacoes
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.lgpd_solicitacoes from anon, authenticated;
grant select, insert, update, delete on table public.lgpd_solicitacoes to service_role;

create index if not exists lgpd_solicitacoes_created_at_idx
  on public.lgpd_solicitacoes (created_at desc);

create index if not exists lgpd_solicitacoes_status_created_at_idx
  on public.lgpd_solicitacoes (status, created_at desc);

create index if not exists lgpd_solicitacoes_pessoa_created_at_idx
  on public.lgpd_solicitacoes (pessoa_id, created_at desc);

create index if not exists lgpd_solicitacoes_responsavel_created_at_idx
  on public.lgpd_solicitacoes (responsavel_id, created_at desc);
