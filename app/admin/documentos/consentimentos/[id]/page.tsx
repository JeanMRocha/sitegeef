import Link from 'next/link';
import { getConsentimentoById, revogaConsentimento } from '../../actions';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Consentimento LGPD - Admin GEEF',
};

type ConsentimentoPageParams = {
  id: string;
};

async function handleRevoke(id: string) {
  'use server';

  try {
    await revogaConsentimento(id);
    redirect(buildFlashNoticeUrl(`/admin/documentos/consentimentos/${id}`, { variant: 'success', message: 'Consentimento revogado.' }));
  } catch (error) {
    console.error('Erro ao revogar consentimento:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/consentimentos/${id}`, { variant: 'error', message: 'Não foi possível revogar o consentimento.' }));
    return;
  }
}

async function ConsentimentoContent({ id }: { id: string }) {
  const consentimento = await getConsentimentoById(id);

  if (!consentimento) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Consentimento LGPD</h1>
            <p className="admin-page-subtitle">Registro não encontrado.</p>
          </div>
        </div>

        <div className="admin-card">
          <p className="mb-0 text-sm-muted">
            O registro pode ter sido removido ou você não tem acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Consentimento LGPD</h1>
          <p className="admin-page-subtitle">{consentimento.pessoas?.nome}</p>
        </div>
        {consentimento.status === 'ativo' && (
          <form action={() => handleRevoke(id)}>
            <button
              type="submit"
              className="admin-btn status-toggle-btn status-toggle-btn--active"
              onClick={(e) => {
                if (!confirm('Tem certeza que deseja revogar este consentimento?')) {
                  e.preventDefault();
                }
              }}
            >
              ✕ Revogar
            </button>
          </form>
        )}
      </div>

      <div className="admin-card mb-2">
        <div className="content-surface-note">
          Revogue apenas quando o pedido vier do titular ou quando houver base para encerrar o tratamento.
        </div>
        <div className="module-grid grid-auto-300">
          <div>
            <p className="text-xs-muted">Finalidade</p>
            <p className="mt-035 text-sm-500">{consentimento.finalidade}</p>
          </div>
          <div>
            <p className="text-xs-muted">Base Legal</p>
            <p className="mt-035 text-sm-muted">{consentimento.base_legal || '—'}</p>
          </div>
          <div>
            <p className="text-xs-muted">Status</p>
            <p className="mt-035">
              <span className={consentimento.status === 'ativo' ? 'inline-status inline-status-success' : 'inline-status inline-status-danger'}>
                {consentimento.status}
              </span>
            </p>
          </div>
        </div>

        <div className="form-grid-2 mt-2 content-surface-note-bordered">
          <div>
            <p className="text-xs-muted">Consentimento em</p>
            <p className="mt-035">
              {new Date(consentimento.data_consentimento).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {consentimento.data_revogacao && (
            <div>
              <p className="text-xs-muted">Revogado em</p>
              <p className="mt-035 text-danger">
                {new Date(consentimento.data_revogacao).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {consentimento.canal_autorizado && (
          <div className="content-surface-note-bordered mt-2">
            <p className="text-xs-muted">Canais Autorizados</p>
            <p className="mt-035 text-sm-muted">{consentimento.canal_autorizado}</p>
          </div>
        )}
      </div>

      <div className="table-actions-inline">
        <Link href="/admin/documentos/consentimentos" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}

export default async function ConsentimentoPage({ params }: { params: Promise<ConsentimentoPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <ConsentimentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
