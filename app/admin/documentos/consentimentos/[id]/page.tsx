import Link from 'next/link';
import { getConsentimentoById, revogaConsentimento } from '../../actions';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Consentimento LGPD - Admin GEEF',
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

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Consentimento LGPD</h1>
          <p className="admin-page-subtitle">{consentimento.pessoas?.nome}</p>
        </div>
        {consentimento.status === 'ativo' && (
          <form action={() => handleRevoke(id)}>
            <button
              type="submit"
              className="admin-btn"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
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

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Finalidade</p>
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.95rem', fontWeight: 500 }}>{consentimento.finalidade}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Base Legal</p>
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.95rem' }}>{consentimento.base_legal || '—'}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</p>
            <p style={{ margin: '0.5rem 0 1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.35rem 0.7rem',
                backgroundColor: consentimento.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: consentimento.status === 'ativo' ? '#22c55e' : '#ef4444',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
              }}>
                {consentimento.status}
              </span>
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Consentimento em</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
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
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Revogado em</p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#ef4444' }}>
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
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Canais Autorizados</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{consentimento.canal_autorizado}</p>
          </div>
        )}
      </div>

      {/* Voltar */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/admin/documentos/consentimentos" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}

export default async function ConsentimentoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ConsentimentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
