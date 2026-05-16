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
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Encontros online</p>
            <h1 className="area-hero-title">Reuniões Virtuais</h1>
          </div>
          <Link href="/admin/reunioes-virtuais/nova" className="profile-form-btn profile-form-btn-primary">
            Nova Reunião
          </Link>
        </div>
        <p className="area-subtitle">Gestão de links, senhas, anfitriões e status.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Planejadas</span>
          <strong>{planejadas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Finalizadas</span>
          <strong>{finalizadas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{reunioes.length}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Todas as reuniões</h2>
          <p>Panorama dos encontros agendados e concluídos.</p>
        </div>
        <div className="table-surface">
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
                      <td style={{ fontWeight: 500 }}>{reuniao.titulo}</td>
                      <td>{reuniao.plataforma ? reuniao.plataforma : '—'}</td>
                      <td>{reuniao.anfitriao?.nome || '—'}</td>
                      <td style={{ color: 'var(--muted)' }}>
                        {reuniao.data_hora ? new Date(reuniao.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td>
                        <span className={reuniao.status === 'planejada' ? 'inline-status inline-status-warning' : 'inline-status inline-status-success'}>
                          {reuniao.status === 'planejada' ? 'Planejada' : 'Finalizada'}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/reunioes-virtuais/${reuniao.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">Nenhuma reunião cadastrada.</div>
          )}
        </div>
      </section>
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
