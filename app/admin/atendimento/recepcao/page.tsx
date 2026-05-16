import Link from 'next/link';
import { getRecepcoes } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Recepção - Admin GEEF',
};

async function RecepcaoContent({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  const hoje = new Date();
  const mes = searchParams.mes ? parseInt(searchParams.mes) : hoje.getMonth() + 1;
  const ano = searchParams.ano ? parseInt(searchParams.ano) : hoje.getFullYear();

  const recepcoes = await getRecepcoes(mes, ano);
  const mesTexto = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimento Recepção</h1>
          <p className="admin-page-subtitle">{mesTexto}</p>
        </div>
        <Link href="/admin/atendimento/recepcao/novo" className="admin-btn admin-btn-primary">
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
        {recepcoes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pessoas Atendidas</th>
                  <th>Motivo Geral</th>
                  <th>Encaminhamento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {recepcoes.map((rec: any) => (
                  <tr key={rec.id}>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {new Date(rec.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>
                      {rec.pessoas_atendidas}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {rec.motivo_geral}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {rec.encaminhamento || '—'}
                    </td>
                    <td>
                      <Link href={`/admin/atendimento/recepcao/${rec.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhum atendimento de recepção neste período.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecepcaoPage({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <RecepcaoContent searchParams={searchParams} />
    </Suspense>
  );
}
