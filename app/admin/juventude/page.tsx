import Link from 'next/link';
import { getGrupos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Juventude - Admin GEEF',
};

async function JuventudeContent() {
  const grupos = await getGrupos();
  const gruposAtivos = grupos.filter((g: any) => g.status === 'ativo');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Juventude</h1>
          <p className="admin-page-subtitle">Gestão de grupos e encontros de jovens</p>
        </div>
        <Link href="/admin/juventude/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Grupo
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
            Grupos Ativos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {gruposAtivos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total de Grupos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {grupos.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        {grupos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Coordenador</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((grupo: any) => (
                  <tr key={grupo.id}>
                    <td style={{ fontWeight: 500 }}>
                      {grupo.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {grupo.coordenador?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {grupo.descricao || '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: grupo.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: grupo.status === 'ativo' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {grupo.status === 'ativo' ? '✓ Ativo' : '✕ Inativo'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/juventude/${grupo.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhum grupo cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JuventudePagePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <JuventudeContent />
    </Suspense>
  );
}
