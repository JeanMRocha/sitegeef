import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { getPessoasDisponiveis, getTitularSolicitacaoById, updateTitularSolicitacao } from '../../actions';
import { recordActionFailureEvent } from '@/lib/observability';

export const metadata = {
  title: 'Pedido do Titular - Admin GEEF',
};

type PedidoDetalhe = {
  id: string;
  titular_nome?: string | null;
  titular_email?: string | null;
  request_type: string;
  status: string;
  responsavel_id?: string | null;
  created_at: string;
  prazo_resposta?: string | null;
  resposta?: string | null;
};

type PessoaItem = {
  id: string;
  nome: string;
};

type PedidoParams = {
  id: string;
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

function resolveStatusClass(status: string) {
  if (status === 'aberta') return 'inline-status inline-status-info';
  if (status === 'em_andamento') return 'inline-status inline-status-warning';
  if (status === 'respondida') return 'inline-status inline-status-success';
  return 'inline-status inline-status-neutral';
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
    await recordActionFailureEvent({
      source: 'admin/documentos/pedidos',
      action: 'updateTitularSolicitacao',
      message: 'Falha ao salvar o pedido do titular.',
      payload: { id, status, responsavelId: responsavelId || null },
    });
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

        <div className="admin-card panel-accent-card">
          <p className="text-sm-muted">O pedido pode ter sido removido ou você não tem acesso.</p>
        </div>
      </div>
    );
  }

  const people = pessoas as PessoaItem[];
  const pedidoDetalhe = pedido as PedidoDetalhe;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pedido do Titular</h1>
          <p className="admin-page-subtitle">
            {pedidoDetalhe.titular_nome || pedidoDetalhe.titular_email || 'Titular'}
          </p>
        </div>
        <Link href="/admin/documentos/pedidos" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>

      <div className="admin-card panel-accent-card">
        <div className="content-surface-note">
          Trate o pedido com o mínimo necessário e registre a resposta no mesmo fluxo.
        </div>

        <div className="area-panel-grid">
          <div className="area-panel-item">
            <strong>Titular</strong>
            <p>{pedidoDetalhe.titular_nome || '—'}</p>
            <p className="text-sm-muted">{pedidoDetalhe.titular_email || '—'}</p>
          </div>
          <div className="area-panel-item">
            <strong>Pedido</strong>
            <p>{resolveLabel(pedidoDetalhe.request_type)}</p>
          </div>
          <div className="area-panel-item">
            <strong>Status</strong>
            <p>
              <span className={resolveStatusClass(pedidoDetalhe.status)}>
                {resolveStatusLabel(pedidoDetalhe.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card panel-accent-card">
        <div className="area-panel-grid">
          <div className="area-panel-item">
            <strong>Solicitado em</strong>
            <p>{new Date(pedidoDetalhe.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="area-panel-item">
            <strong>Prazo</strong>
            <p>
              {pedidoDetalhe.prazo_resposta
                ? new Date(pedidoDetalhe.prazo_resposta + 'T00:00:00').toLocaleDateString('pt-BR')
                : '—'}
            </p>
          </div>
          <div className="area-panel-item">
            <strong>Responsável</strong>
            <p>
              {pedidoDetalhe.responsavel_id
                ? people.find((p) => p.id === pedidoDetalhe.responsavel_id)?.nome || '—'
                : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <form action={(formData) => handleSave(id, formData)}>
          <div className="module-grid">
            <label className="profile-form-field">
              <span>Status</span>
              <select name="status" defaultValue={pedidoDetalhe.status} className="profile-form-input">
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em andamento</option>
                <option value="respondida">Respondida</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </label>

            <label className="profile-form-field">
              <span>Responsável</span>
              <select
                name="responsavel_id"
                defaultValue={pedidoDetalhe.responsavel_id || ''}
                className="profile-form-input"
              >
                <option value="">—</option>
                {people.map((p) => (
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
                defaultValue={pedidoDetalhe.prazo_resposta || ''}
                className="profile-form-input"
              />
            </label>

            <label className="profile-form-field form-field-full">
              <span>Resposta curta</span>
              <textarea
                name="resposta"
                className="profile-form-input"
                rows={5}
                defaultValue={pedidoDetalhe.resposta || ''}
                placeholder="Resposta objetiva para o titular."
              />
            </label>
          </div>

          <div className="form-actions-row">
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

export default async function PedidoPage({ params }: { params: Promise<PedidoParams> }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <PedidoContent id={resolvedParams.id} />
    </Suspense>
  );
}
