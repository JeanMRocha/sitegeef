import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildTitularExport } from '@/lib/lgpd/export';
import { createTitularSolicitacao } from '@/app/admin/documentos/actions';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const exportData = await buildTitularExport(user.id);
  const pessoaIdResult = await supabase
    .from('usuarios_sistema')
    .select('pessoa_id')
    .eq('id', user.id)
    .maybeSingle();

  const pessoaId = pessoaIdResult.data?.pessoa_id ?? null;
  const now = new Date().toISOString();
  const titularNome = exportData.data.pessoa?.nome ?? user.user_metadata?.nome ?? null;
  const titularEmail = exportData.data.pessoa?.email ?? user.email ?? null;

  await createTitularSolicitacao({
    user_id: user.id,
    pessoa_id: pessoaId,
    titular_nome: titularNome,
    titular_email: titularEmail,
    request_type: 'acesso',
    details: 'Exportação automática gerada pela área do usuário.',
    origem: 'api/lgpd/export',
    status: 'respondida',
    resposta: 'Exportação disponibilizada ao titular.',
    resolvido_em: now,
  });

  const filename = `lgpd-export-${now.slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
