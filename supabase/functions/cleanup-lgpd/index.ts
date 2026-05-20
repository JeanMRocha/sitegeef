// Supabase Edge Function: cleanup-lgpd
// Triggered on schedule to close overdue LGPD requests and purge expired LGPD data.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const cleanupSecret = Deno.env.get('LGPD_CLEANUP_SECRET');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function isMissingTableError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'PGRST205');
}

async function tableExists(table: string): Promise<boolean> {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (!error) {
    return true;
  }
  if (isMissingTableError(error)) {
    return false;
  }
  throw error;
}

Deno.serve(async (req: Request) => {
  if (cleanupSecret) {
    const authHeader = req.headers.get('Authorization');

    if (authHeader !== `Bearer ${cleanupSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const now = new Date();
    const nowIso = now.toISOString();
    const today = nowIso.slice(0, 10);
    const retention365 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const retention180 = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    let overdueRequestsClosed = 0;
    let expiredRequestsDeleted = 0;
    let expiredOpsEventsDeleted = 0;

    if (await tableExists('lgpd_solicitacoes')) {
      const { data: overdueRequests, error: overdueError } = await supabase
        .from('lgpd_solicitacoes')
        .select('id')
        .in('status', ['aberta', 'em_andamento'])
        .not('prazo_resposta', 'is', null)
        .lt('prazo_resposta', today);

      if (overdueError) {
        throw overdueError;
      }

      const overdueIds = (overdueRequests ?? []).map((row) => row.id);
      overdueRequestsClosed = overdueIds.length;

      if (overdueIds.length > 0) {
        const { error: overdueUpdateError } = await supabase
          .from('lgpd_solicitacoes')
          .update({
            status: 'encerrada',
            resolvido_em: nowIso,
            updated_at: nowIso,
          })
          .in('id', overdueIds);

        if (overdueUpdateError) {
          throw overdueUpdateError;
        }
      }

      const { data: resolvedRequests, error: resolvedError } = await supabase
        .from('lgpd_solicitacoes')
        .select('id, resolvido_em, updated_at, created_at, status')
        .in('status', ['respondida', 'encerrada']);

      if (resolvedError) {
        throw resolvedError;
      }

      const resolvedIds = (resolvedRequests ?? [])
        .filter((row) => {
          const referenceDate = row.resolvido_em ?? row.updated_at ?? row.created_at;
          return referenceDate ? new Date(referenceDate).getTime() < retention365.getTime() : false;
        })
        .map((row) => row.id);

      expiredRequestsDeleted = resolvedIds.length;

      if (resolvedIds.length > 0) {
        const { error: deleteRequestsError } = await supabase
          .from('lgpd_solicitacoes')
          .delete()
          .in('id', resolvedIds);

        if (deleteRequestsError) {
          throw deleteRequestsError;
        }
      }
    }

    const { data: deletedOpsEvents, error: opsError } = await supabase
      .from('ops_events')
      .delete()
      .lt('created_at', retention180.toISOString())
      .select('id');

    if (opsError) {
      if (!isMissingTableError(opsError)) {
        throw opsError;
      }
    } else {
      expiredOpsEventsDeleted = deletedOpsEvents?.length ?? 0;
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          overdue_requests_closed: overdueRequestsClosed,
          expired_requests_deleted: expiredRequestsDeleted,
          expired_ops_events_deleted: expiredOpsEventsDeleted,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('LGPD cleanup function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
