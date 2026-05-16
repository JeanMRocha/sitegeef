import Link from 'next/link';
import { getDiretorias } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Diretorias - Admin GEEF',
};

async function DiretoriasContent() {
  const diretorias = await getDiretorias();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Diretorias</h1>
          <p className="admin-page-subtitle">Gestão de gestões e mandatos</p>
        </div>
        <Link href="/admin/governanca/diretorias/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Diretoria
        </Link>
      </div>

      <div className="admin-card">
        {diretorias.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {diretorias.map((diretoria: any) => (
                  <tr key={diretoria.id}>
                    <td style={{ fontWeight: 500 }}>
                      {diretoria.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {diretoria.data_inicio ? new Date(diretoria.data_inicio).toLocaleDateString('pt-BR') : '—'} a {diretoria.data_fim ? new Date(diretoria.data_fim).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: diretoria.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: diretoria.status === 'ativa' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {diretoria.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/governanca/diretorias/${diretoria.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma diretoria cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function DiretoriasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <DiretoriasContent />
    </Suspense>
  );
}
