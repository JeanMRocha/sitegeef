import Link from 'next/link';
import { getTurmas } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Turmas - Admin GEEF',
};

async function TurmasContent() {
  const turmas = await getTurmas();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Evangelização</p>
            <h1 className="area-hero-title">Turmas de Evangelização</h1>
          </div>
          <Link href="/admin/evangelizacao/turmas/nova" className="profile-form-btn profile-form-btn-primary">
            Nova Turma
          </Link>
        </div>
        <p className="area-subtitle">Gestão de turmas infantis.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {turmas.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Faixa etária</th>
                  <th>Horário</th>
                  <th>Sala</th>
                  <th>Capacidade</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma: any) => (
                  <tr key={turma.id}>
                    <td style={{ fontWeight: 500 }}>{turma.nome}</td>
                    <td>{turma.faixa_etaria}</td>
                    <td>{turma.horario}</td>
                    <td style={{ color: 'var(--muted)' }}>{turma.sala}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{turma.capacidade}</td>
                    <td>
                      <span className={turma.status === 'ativa' ? 'inline-status inline-status-success' : 'inline-status'}>
                        {turma.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/evangelizacao/turmas/${turma.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">Nenhuma turma cadastrada.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function TurmasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <TurmasContent />
    </Suspense>
  );
}
