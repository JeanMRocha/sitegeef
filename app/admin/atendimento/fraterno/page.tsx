import Link from 'next/link';
import { getAtendimentosFraterno } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Atendimento Fraterno - Admin GEEF',
};

async function FraternoContent({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  const hoje = new Date();
  const mes = searchParams.mes ? parseInt(searchParams.mes) : hoje.getMonth() + 1;
  const ano = searchParams.ano ? parseInt(searchParams.ano) : hoje.getFullYear();

  const atendimentos = await getAtendimentosFraterno(mes, ano);
  const mesTexto = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimento Fraterno</h1>
          <p className="admin-page-subtitle">{mesTexto}</p>
        </div>
        <Link href="/admin/atendimento/fraterno/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Atendimento
        </Link>
      </div>

      {/* Filtros */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <form method="get" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>Mês</label>
              <select
                name="mes"
                defaultValue={mes}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(ano, m - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>Ano</label>
              <select
                name="ano"
                defaultValue={ano}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              >
                {Array.from({ length: 5 }, (_, i) => ano - 2 + i).map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
            🔍 Filtrar
          </button>
        </form>
      </div>

      {/* Tabela */}
      <div className="admin-card">
        {atendimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pessoa</th>
                  <th>Atendente</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Privacidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {atendimentos.map((atend: any) => (
                  <tr key={atend.id}>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {new Date(atend.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {atend.pessoas?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {atend.atendente?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {atend.tipo}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: atend.status === 'em_aberto' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                        color: atend.status === 'em_aberto' ? '#22c55e' : '#a855f7',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {atend.status === 'em_aberto' ? '🔓 Aberto' : '✓ Encerrado'}
                      </span>
                    </td>
                    <td>
                      {atend.sigilo ? (
                        <span style={{ fontSize: '0.9rem', color: '#ef4444' }}>🔒 Sigiloso</span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Registro</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/atendimento/fraterno/${atend.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhum atendimento fraterno neste período.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function FraternoPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FraternoContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

