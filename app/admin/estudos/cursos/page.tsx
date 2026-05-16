import Link from 'next/link';
import { getCursos } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Cursos - Admin GEEF',
};

async function CursosContent() {
  const cursos = await getCursos();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cursos de Estudo</h1>
          <p className="admin-page-subtitle">IEE, ESDE, EOB, EADE e outros</p>
        </div>
        <Link href="/admin/estudos/cursos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Curso
        </Link>
      </div>

      <div className="admin-card">
        {cursos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso: any) => (
                  <tr key={curso.id}>
                    <td style={{ fontWeight: 500 }}>
                      {curso.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {curso.descricao || '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: curso.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: curso.ativo ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {curso.ativo ? '✓ Ativo' : '✕ Inativo'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/estudos/cursos/${curso.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhum curso cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CursosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CursosContent />
    </Suspense>
  );
}
