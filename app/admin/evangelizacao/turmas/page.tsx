import Link from 'next/link';
import { getTurmas } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Turmas - Admin GEEF',
};

async function TurmasContent() {
  const turmas = await getTurmas();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Turmas de Evangelização</h1>
          <p className="admin-page-subtitle">Gestão de turmas infantis</p>
        </div>
        <Link href="/admin/evangelizacao/turmas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Turma
        </Link>
      </div>

      <div className="admin-card">
        {turmas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Faixa Etária</th>
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
                    <td style={{ fontWeight: 500 }}>
                      {turma.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {turma.faixa_etaria}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {turma.horario}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {turma.sala}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {turma.capacidade}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: turma.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: turma.status === 'ativa' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {turma.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/evangelizacao/turmas/${turma.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--admin-bg)',
            borderRadius: '0.6rem',
            color: 'var(--muted)',
          }}>
            <p>Nenhuma turma cadastrada.</p>
          </div>
        )}
      </div>
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
