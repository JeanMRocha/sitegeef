import Link from 'next/link';
import { getReunioes } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Reuniões Virtuais - Admin GEEF',
};

async function ReunioesvirtualaisContent() {
  const reunioes = await getReunioes();
  const planejadas = reunioes.filter((r: any) => r.status === 'planejada');
  const finalizadas = reunioes.filter((r: any) => r.status === 'finalizada');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reuniões Virtuais</h1>
          <p className="admin-page-subtitle">Gestão de links, senhas e anfitriões</p>
        </div>
        <Link href="/admin/reunioes-virtuais/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Reunião
        </Link>
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
            Reuniões Planejadas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {planejadas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Finalizadas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {finalizadas.length}
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
            {reunioes.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Todas as Reuniões</h2>

        {reunioes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Plataforma</th>
                  <th>Anfitrião</th>
                  <th>Data/Hora</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {reunioes.map((reuniao: any) => (
                  <tr key={reuniao.id}>
                    <td style={{ fontWeight: 500 }}>
                      {reuniao.titulo}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {reuniao.plataforma ? (
                        <>
                          {reuniao.plataforma === 'zoom' && '🎥 Zoom'}
                          {reuniao.plataforma === 'google-meet' && '📹 Google Meet'}
                          {reuniao.plataforma === 'teams' && '💬 Teams'}
                          {reuniao.plataforma === 'jitsi' && '🔗 Jitsi'}
                          {!['zoom', 'google-meet', 'teams', 'jitsi'].includes(reuniao.plataforma) && reuniao.plataforma}
                        </>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {reuniao.anfitriao?.nome || '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {reuniao.data_hora ? new Date(reuniao.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: reuniao.status === 'planejada' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: reuniao.status === 'planejada' ? '#3b82f6' : '#22c55e',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {reuniao.status === 'planejada' ? '📋 Planejada' : '✓ Finalizada'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/reunioes-virtuais/${reuniao.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma reunião cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function ReunioesvirtualaisPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ReunioesvirtualaisContent />
    </Suspense>
  );
}
