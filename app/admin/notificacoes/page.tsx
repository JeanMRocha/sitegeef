import Link from 'next/link';
import { getNotificacoes } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Notificações - Admin GEEF',
};

async function NotificacoesContent() {
  const notificacoes = await getNotificacoes();
  const pendentes = notificacoes.filter((n: any) => n.status === 'pendente');
  const lidas = notificacoes.filter((n: any) => n.status === 'lida');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Notificações</h1>
          <p className="admin-page-subtitle">Painel de notificações do sistema</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Pendentes
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {pendentes.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Lidas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {lidas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {notificacoes.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Todas as Notificações</h2>

        {notificacoes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Mensagem</th>
                  <th>Canal</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {notificacoes.map((notif: any) => (
                  <tr key={notif.id} style={{ backgroundColor: notif.status === 'pendente' ? 'rgba(59, 130, 246, 0.02)' : 'transparent' }}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {new Date(notif.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {notif.tipo === 'sistema' && '⚙️ Sistema'}
                      {notif.tipo === 'alerta' && '⚠️ Alerta'}
                      {notif.tipo === 'sucesso' && '✓ Sucesso'}
                      {notif.tipo === 'info' && 'ℹ️ Info'}
                    </td>
                    <td style={{ fontWeight: 500, maxWidth: '150px' }}>
                      {notif.titulo}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)', maxWidth: '200px' }}>
                      {notif.mensagem.substring(0, 50)}...
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {notif.canal === 'interno' && '🔔 Interno'}
                      {notif.canal === 'email' && '📧 E-mail'}
                      {notif.canal === 'whatsapp' && '💬 WhatsApp'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: notif.status === 'pendente' ? 'rgba(249, 115, 22, 0.1)' : notif.status === 'enviado' ? 'rgba(34, 197, 94, 0.1)' : notif.status === 'falhou' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: notif.status === 'pendente' ? '#f97316' : notif.status === 'enviado' ? '#22c55e' : notif.status === 'falhou' ? '#ef4444' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {notif.status === 'pendente' && '⏳ Pendente'}
                        {notif.status === 'enviado' && '✓ Enviado'}
                        {notif.status === 'falhou' && '✕ Falhou'}
                        {notif.status === 'lida' && '👁️ Lida'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/notificacoes/${notif.id}`} className="admin-btn admin-btn-small">
                        👁️ Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma notificação.</p>
        )}
      </div>
    </div>
  );
}

export default function NotificacoesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <NotificacoesContent />
    </Suspense>
  );
}
