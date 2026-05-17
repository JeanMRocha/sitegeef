import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getNotificacaoById, marcarComoLida, deletarNotificacao } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Notificação - Admin GEEF',
};

async function handleMarcarLida(id: string) {
  'use server';

  try {
    await marcarComoLida(id);
    redirect(buildFlashNoticeUrl(`/admin/notificacoes/${id}`, { variant: 'success', message: 'Notificação marcada como lida.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/notificacoes/${id}`, { variant: 'error', message: 'Não foi possível atualizar a notificação.' }));
    return;
  }
}

async function handleDeletar(id: string) {
  'use server';

  try {
    await deletarNotificacao(id);
    redirect(buildFlashNoticeUrl('/admin/notificacoes', { variant: 'success', message: 'Notificação removida.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/notificacoes', { variant: 'error', message: 'Não foi possível remover a notificação.' }));
    return;
  }
}

async function NotificacaoContent({ id }: { id: string }) {
  const notif = await getNotificacaoById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{notif.titulo}</h1>
          <p className="admin-page-subtitle">
            {notif.tipo === 'sistema' && '⚙️ Notificação do Sistema'}
            {notif.tipo === 'alerta' && '⚠️ Alerta'}
            {notif.tipo === 'sucesso' && '✓ Sucesso'}
            {notif.tipo === 'info' && 'ℹ️ Informação'}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: notif.tipo === 'alerta' ? 'rgba(239, 68, 68, 0.05)' : notif.tipo === 'sucesso' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(59, 130, 246, 0.05)',
          borderLeft: `4px solid ${notif.tipo === 'alerta' ? '#ef4444' : notif.tipo === 'sucesso' ? '#22c55e' : '#3b82f6'}`,
          borderRadius: '0.6rem',
        }}>
          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
            {notif.mensagem}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Informações</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Data de Criação</p>
            <p style={{ margin: 0, fontWeight: 500 }}>
              {new Date(notif.criado_em).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Canal</p>
            <p style={{ margin: 0, fontWeight: 500 }}>
              {notif.canal === 'interno' && '🔔 Interno'}
              {notif.canal === 'email' && '📧 E-mail'}
              {notif.canal === 'whatsapp' && '💬 WhatsApp'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Status</p>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.6rem',
              backgroundColor: notif.status === 'pendente' ? 'rgba(249, 115, 22, 0.1)' : notif.status === 'enviado' ? 'rgba(34, 197, 94, 0.1)' : notif.status === 'falhou' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              color: notif.status === 'pendente' ? '#f97316' : notif.status === 'enviado' ? '#22c55e' : notif.status === 'falhou' ? '#ef4444' : '#6b7280',
              borderRadius: '0.3rem',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}>
              {notif.status === 'pendente' && '⏳ Pendente'}
              {notif.status === 'enviado' && '✓ Enviado'}
              {notif.status === 'falhou' && '✕ Falhou'}
              {notif.status === 'lida' && '👁️ Lida'}
            </span>
          </div>
          {notif.modulo_origem && (
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Módulo de Origem</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{notif.modulo_origem}</p>
            </div>
          )}
        </div>
      </div>

      {notif.status !== 'lida' && (
        <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
          <form action={() => handleMarcarLida(notif.id)}>
            <button type="submit" className="admin-btn admin-btn-primary">
              👁️ Marcar como Lida
            </button>
          </form>
        </div>
      )}

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>Ações</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/notificacoes" className="admin-btn admin-btn-secondary">
            ← Voltar
          </Link>
          <form action={() => handleDeletar(notif.id)}>
            <button type="submit" className="admin-btn" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
              🗑️ Deletar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function NotificacaoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <NotificacaoContent id={resolvedParams.id} />
    </Suspense>
  );
}
