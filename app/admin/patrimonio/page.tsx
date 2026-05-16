import Link from 'next/link';
import { getBens } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Patrimônio - Admin GEEF',
};

async function PatrimonioContent() {
  const bens = await getBens();
  const ativos = bens.filter((b: any) => b.status === 'ativo');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Patrimônio</h1>
          <p className="admin-page-subtitle">Gestão de bens e equipamentos</p>
        </div>
        <Link href="/admin/patrimonio/novo-bem" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Novo Bem
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
            Bens Ativos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {ativos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total de Bens
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {bens.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Todos os Bens</h2>

        {bens.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Localização</th>
                  <th>Responsável</th>
                  <th>Conservação</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {bens.map((bem: any) => (
                  <tr key={bem.id}>
                    <td style={{ fontWeight: 500 }}>
                      {bem.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {bem.categoria || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {bem.localizacao || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {bem.responsavel?.nome || '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: bem.conservacao === 'bom' ? 'rgba(34, 197, 94, 0.1)' : bem.conservacao === 'regular' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: bem.conservacao === 'bom' ? '#22c55e' : bem.conservacao === 'regular' ? '#f59e0b' : '#ef4444',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {bem.conservacao === 'bom' && '✓ Bom'}
                        {bem.conservacao === 'regular' && '⚠️ Regular'}
                        {bem.conservacao === 'ruim' && '✕ Ruim'}
                        {!bem.conservacao && '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: bem.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: bem.status === 'ativo' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {bem.status === 'ativo' ? '✓ Ativo' : '✕ Inativo'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/patrimonio/${bem.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum bem cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function PatrimonioPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PatrimonioContent />
    </Suspense>
  );
}
