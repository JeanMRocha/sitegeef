import Link from 'next/link';
import { getFuncoes } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Funções e Temas - Admin GEEF',
};

async function FuncoesList() {
  const funcoes = await getFuncoes();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Funções e Temas</h1>
          <p className="admin-page-subtitle">Configure funções de escalas e temas doutrinários</p>
        </div>
        <Link href="/admin/funcoes/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Função
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link href="/admin/funcoes" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          ⚙️ Funções
        </Link>
        <Link href="/admin/funcoes/temas" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          📚 Temas Doutrinários
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {funcoes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhuma função cadastrada.</p>
            <Link href="/admin/funcoes/nova" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Criar primeira função
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {funcoes.map((funcao: any) => (
                <tr key={funcao.id}>
                  <td style={{ fontWeight: 600 }}>{funcao.nome}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    {funcao.descricao || '—'}
                  </td>
                  <td>
                    <Link href={`/admin/funcoes/${funcao.id}`} className="admin-btn admin-btn-small">
                      ✏️ Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function FuncoesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FuncoesList />
    </Suspense>
  );
}
