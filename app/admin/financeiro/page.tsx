import Link from 'next/link';
import { getSaldoMes, getMovimentosFinanceiros } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Financeiro - Admin GEEF',
};

async function FinanceiroContent() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const { entradas, saidas, saldo } = await getSaldoMes(mesAtual, anoAtual);
  const movimentos = await getMovimentosFinanceiros(mesAtual, anoAtual);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Financeiro</h1>
          <p className="admin-page-subtitle">
            {new Date(anoAtual, mesAtual - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
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
            Entradas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#22c55e' }}>
            R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Saídas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>
            R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Saldo
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: saldo >= 0 ? '#3b82f6' : '#ef4444' }}>
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Menu Rápido */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/financeiro/plano-contas" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          📋 Plano de Contas
        </Link>
        <Link href="/admin/financeiro/centros-custo" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🎯 Centros de Custo
        </Link>
        <Link href="/admin/financeiro/lancamentos" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          💰 Lançamentos
        </Link>
        <Link href="/admin/financeiro/dre" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(249, 115, 22, 0.05)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          📊 Relatório DRE
        </Link>
      </div>

      {/* Últimos Lançamentos */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Últimos Lançamentos</h2>
          <Link href="/admin/financeiro/lancamentos" className="admin-btn admin-btn-small">
            Ver Todos →
          </Link>
        </div>

        {movimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Centro de Custo</th>
                </tr>
              </thead>
              <tbody>
                {movimentos.slice(0, 10).map((mov: any) => (
                  <tr key={mov.id}>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(mov.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
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
                        {mov.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: mov.tipo === 'entrada' ? '#22c55e' : '#ef4444' }}>
                      R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {mov.centros_custo?.nome || '—'}
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
            <p>Nenhum lançamento neste mês.</p>
            <Link href="/admin/financeiro/lancamentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              ➕ Novo Lançamento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FinanceiroPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FinanceiroContent />
    </Suspense>
  );
}
