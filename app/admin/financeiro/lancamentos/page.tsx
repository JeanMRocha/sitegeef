import Link from 'next/link';
import { getMovimentosFinanceiros } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Lançamentos - Admin GEEF',
};

async function LancamentosContent({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  const hoje = new Date();
  const mes = searchParams.mes ? parseInt(searchParams.mes) : hoje.getMonth() + 1;
  const ano = searchParams.ano ? parseInt(searchParams.ano) : hoje.getFullYear();

  const movimentos = await getMovimentosFinanceiros(mes, ano);

  const mesTexto = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Lançamentos</h1>
          <p className="admin-page-subtitle">{mesTexto}</p>
        </div>
        <Link href="/admin/financeiro/lancamentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Lançamento
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
        {movimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Conta</th>
                  <th>Valor</th>
                  <th>Centro de Custo</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {movimentos.map((mov: any) => (
                  <tr key={mov.id}>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(mov.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {mov.descricao}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: mov.tipo === 'entrada' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: mov.tipo === 'entrada' ? '#22c55e' : '#ef4444',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {mov.tipo === 'entrada' ? '📥' : '📤'} {mov.tipo}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {mov.plano_contas?.codigo}
                    </td>
                    <td style={{ fontWeight: 600, color: mov.tipo === 'entrada' ? '#22c55e' : '#ef4444' }}>
                      {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {mov.centros_custo?.nome || '—'}
                    </td>
                    <td>
                      <Link href={`/admin/financeiro/lancamentos/${mov.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhum lançamento neste período.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LancamentosPage({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <LancamentosContent searchParams={searchParams} />
    </Suspense>
  );
}
