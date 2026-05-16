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
          <h1 className="admin-page-title">Turmas de Estudo</h1>
          <p className="admin-page-subtitle">Gerenciar turmas dos cursos</p>
        </div>
        <Link href="/admin/estudos/turmas/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Turma
        </Link>
      </div>

      <div className="admin-card">
        {turmas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Facilitador</th>
                  <th>Horário</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma: any) => (
                  <tr key={turma.id}>
                    <td style={{ fontWeight: 500 }}>
                      {turma.curso?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {turma.facilitador?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {turma.horario}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {new Date(turma.data_inicio).toLocaleDateString('pt-BR')} a {new Date(turma.data_fim).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: turma.status === 'em_andamento' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: turma.status === 'em_andamento' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {turma.status === 'em_andamento' ? '▶ Em andamento' : '✓ Finalizada'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/estudos/turmas/${turma.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma turma cadastrada.</p>
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
