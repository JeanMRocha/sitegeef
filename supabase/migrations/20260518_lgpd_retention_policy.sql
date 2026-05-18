comment on table public.ops_events is
  'Retencao LGPD: eventos operacionais ligados a privacidade e auditoria sao mantidos por 180 dias, salvo necessidade legal diversa.';

comment on table public.lgpd_solicitacoes is
  'Retencao LGPD: pedidos do titular sao encerrados automaticamente quando vencem e expurgados 365 dias apos resolucao.';

create or replace function public.cleanup_lgpd_retention()
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  overdue_requests integer := 0;
  deleted_requests integer := 0;
  deleted_ops_events integer := 0;
begin
  update public.lgpd_solicitacoes
     set status = 'encerrada',
         resolvido_em = coalesce(resolvido_em, now()),
         updated_at = now()
   where status in ('aberta', 'em_andamento')
     and prazo_resposta is not null
     and prazo_resposta < current_date;

  get diagnostics overdue_requests = row_count;

  delete from public.lgpd_solicitacoes
   where status in ('respondida', 'encerrada')
     and coalesce(resolvido_em, updated_at, created_at) < now() - interval '365 days';

  get diagnostics deleted_requests = row_count;

  delete from public.ops_events
   where created_at < now() - interval '180 days';

  get diagnostics deleted_ops_events = row_count;

  return jsonb_build_object(
    'overdue_requests_closed', overdue_requests,
    'expired_requests_deleted', deleted_requests,
    'expired_ops_events_deleted', deleted_ops_events
  );
end;
$$;

revoke all on function public.cleanup_lgpd_retention() from public;
grant execute on function public.cleanup_lgpd_retention() to service_role;
