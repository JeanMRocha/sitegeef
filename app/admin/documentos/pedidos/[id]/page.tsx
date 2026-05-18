import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { getPessoasDisponiveis, getTitularSolicitacaoById, updateTitularSolicitacao } from '../../actions';

export const metadata = {
  title: 'Pedido do Titular - Admin GEEF',
};

function resolveLabel(tipo: string) {
  if (tipo === 'acesso') return 'Acesso';
  if (tipo === 'correcao') return 'Correção';
  if (tipo === 'revogacao') return 'Revogação';
  if (tipo === 'eliminacao') return 'Eliminação';
  return tipo;
}

function resolveStatusLabel(status: string) {
  if (status === 'aberta') return 'Aberta';
  if (status === 'em_andamento') return 'Em andamento';
  if (status === 'respondida') return 'Respondida';
  if (status === 'encerrada') return 'Encerrada';
  return status;
}

async function handleSave(id: string, formData: FormData) {
  'use server';

  const status = String(formData.get('status') || '').trim();
  const responsavelId = String(formData.get('responsavel_id') || '').trim();
  const resposta = String(formData.get('resposta') || '').trim();
  const prazoResposta = String(formData.get('prazo_resposta') || '').trim();

  const allowedStatuses = new Set(['aberta', 'em_andamento', 'respondida', 'encerrada']);

  if (!allowedStatuses.has(status)) {
    redirect(buildFlashNoticeUrl(`/admin/documentos/pedidos/${id}`, { variant: 'error', message: 'Selecione um status válido.' }));
  }

  const result = await updateTitularSolicitacao(id, {
    status,
    responsavel_id: responsavelId || null,
    resposta: resposta || null,
    prazo_resposta: prazoResposta || null,
  });

  if (!result.success) {
    redirect(buildFlashNoticeUrl(`/admin/documentos/pedidos/${id}`, { variant: 'error', message: 'Não foi possível atualizar o pedido.' }));
  }

  redirect(buildFlashNoticeUrl(`/admin/documentos/pedidos/${id}`, { variant: 'success', message: 'Pedido atualizado.' }));
}

async function PedidoContent({ id }: { id: string }) {
  const [pedido, pessoas] = await Promise.all([
    getTitularSolicitacaoById(id),
    getPessoasDisponiveis(),
  ]);

  if (!pedido) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Pedido do Titular</h1>
            <p className="admin-page-subtitle">Registro não encontrado.</p>
          </div>
        </div>

        <div className="admin-card">
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            O pedido pode ter sido removido ou você não tem acesso.
          </p>
        </div>
      </div>
    );
  }

  const colors =
    pedido.status === 'aberta'
      ? { bg: 'rgba(59, 130, 246, 0.1)', fg: 'var(--primary)' }
      : pedido.status === 'em_andamento'
        ? { bg: 'rgba(245, 158, 11, 0.1)', fg: '#d97706' }
        : pedido.status === 'respondida'
          ? { bg: 'rgba(34, 197, 94, 0.1)', fg: '#22c55e' }
          : { bg: 'rgba(107, 114, 128, 0.1)', fg: '#6b7280' };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pedido do Titular</h1>
          <p className="admin-page-subtitle">
            {pedido.titular_nome || pedido.titular_email || 'Titular'}
          </p>
        </div>
        <Link href="/admin/documentos/pedidos" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(138, 0, 90, 0.06)', color: 'var(--muted)', lineHeight: 1.6 }}>
          Trate o pedido com o mínimo necessário e registre a resposta no mesmo fluxo.
        </div>

        <div className="area-panel-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="area-panel-item">
            <strong>Titular</strong>
            <p>{pedido.titular_nome || '—'}</p>
            <p style={{ color: 'var(--muted)' }}>{pedido.titular_email || '—'}</p>
          </div>
          <div className="area-panel-item">
            <strong>Pedido</strong>
            <p>{resolveLabel(pedido.request_type)}</p>
          </div>
          <div className="area-panel-item">
            <strong>Status</strong>
            <p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.35rem 0.7rem',
                  backgroundColor: colors.bg,
                  color: colors.fg,
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                }}
              >
                {resolveStatusLabel(pedido.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="area-panel-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="area-panel-item">
            <strong>Solicitado em</strong>
            <p>{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="area-panel-item">
            <strong>Prazo</strong>
            <p>{pedido.prazo_resposta ? new Date(pedido.prazo_resposta + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</p>
          </div>
          <div className="area-panel-item">
            <strong>Responsável</strong>
            <p>{pedido.responsavel_id ? pessoas.find((p: any) => p.id === pedido.responsavel_id)?.nome || '—' : '—'}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <form action={(formData) => handleSave(id, formData)}>
          <div className="module-grid">
            <label className="profile-form-field">
              <span>Status</span>
              <select name="status" defaultValue={pedido.status} className="profile-form-input">
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em andamento</option>
                <option value="respondida">Respondida</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </label>

            <label className="profile-form-field">
              <span>Responsável</span>
              <select name="responsavel_id" defaultValue={pedido.responsavel_id || ''} className="profile-form-input">
                <option value="">—</option>
                {pessoas.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="profile-form-field">
              <span>Prazo de resposta</span>
              <input
                type="date"
                name="prazo_resposta"
                defaultValue={pedido.prazo_resposta || ''}
                className="profile-form-input"
              />
            </label>

            <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
              <span>Resposta curta</span>
              <textarea
                name="resposta"
                className="profile-form-input"
                rows={5}
                defaultValue={pedido.resposta || ''}
                placeholder="Resposta objetiva para o titular."
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/documentos/pedidos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function PedidoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PedidoContent id={resolvedParams.id} />
    </Suspense>
  );
}
