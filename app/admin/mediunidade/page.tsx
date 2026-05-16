import Link from 'next/link';
import { getGrupos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Mediunidade - Admin GEEF',
};

async function MediunidadeContent() {
  const grupos = await getGrupos();
  const ativos = grupos.filter((g: any) => g.status === 'ativo');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Mediunidade</h1>
          <p className="admin-page-subtitle">🔒 Módulo Restrito — Gestão de grupos mediúnicos</p>
        </div>
        <Link href="/admin/mediunidade/novo-grupo" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Novo Grupo
        </Link>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '0.6rem',
        marginBottom: '2rem',
        borderLeft: '4px solid #a855f7',
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          🔒 <strong>Acesso Restrito:</strong> Este módulo é privado. Apenas usuários com permissão <code>pode_mediunidade</code> podem acessar.
        </p>
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
            Total de Grupos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {grupos.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Grupos Mediúnicos</h2>

        {grupos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Coordenador</th>
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
                      {grupo.coordenador?.nome || '—'}
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
                      <Link href={`/admin/mediunidade/${grupo.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum grupo cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function MediunidadePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <MediunidadeContent />
    </Suspense>
  );
}
