import { getRelatorioFinanceiro } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'DRE - Admin GEEF',
};

async function DREContent({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  const hoje = new Date();
  const mes = searchParams.mes ? parseInt(searchParams.mes) : hoje.getMonth() + 1;
  const ano = searchParams.ano ? parseInt(searchParams.ano) : hoje.getFullYear();

  const movimentos = await getRelatorioFinanceiro(mes, ano);

  const mesTexto = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Agrupar por tipo de conta
  const receitas = movimentos.filter((m: any) => m.plano_contas?.tipo === 'receita');
  const despesas = movimentos.filter((m: any) => m.plano_contas?.tipo === 'despesa');

  const totalReceitas = receitas.reduce((sum: number, m: any) => sum + m.valor, 0);
  const totalDespesas = despesas.reduce((sum: number, m: any) => sum + m.valor, 0);
  const resultado = totalReceitas - totalDespesas;

  // Agrupar despesas por categoria
  const despesasPorCategoria: { [key: string]: number } = {};
  despesas.forEach((m: any) => {
    if (!despesasPorCategoria[m.categoria]) {
      despesasPorCategoria[m.categoria] = 0;
    }
    despesasPorCategoria[m.categoria] += m.valor;
  });

  const categorias = Object.entries(despesasPorCategoria)
    .map(([cat, valor]) => ({ categoria: cat, valor }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Demonstração de Resultado</h1>
          <p className="admin-page-subtitle">{mesTexto}</p>
        </div>
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
                    {new Date(ano, m - 1).toLocaleDateString('pt-BR', { month: 'short' })}
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
            🔍 Gerar
          </button>
        </form>
      </div>

      {/* DRE */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 2rem', fontSize: '1.2rem', fontWeight: 600 }}>
          Demonstração de Resultado do Exercício
        </h2>

        <div style={{ maxWidth: '600px' }}>
          {/* Receitas */}
          <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--admin-border)', paddingBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#22c55e', fontWeight: 600 }}>
              📥 RECEITAS
            </h3>
            {receitas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {receitas.map((mov: any) => (
                  <div key={mov.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{mov.descricao}</span>
                    <span style={{ fontWeight: 500, color: '#22c55e' }}>
                      +R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Nenhuma receita registrada.</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 600, paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
              <span>Total de Receitas</span>
              <span style={{ color: '#22c55e' }}>
                R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Despesas */}
          <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--admin-border)', paddingBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#ef4444', fontWeight: 600 }}>
              📤 DESPESAS
            </h3>
            {despesas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {despesas.map((mov: any) => (
                  <div key={mov.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{mov.descricao}</span>
                    <span style={{ fontWeight: 500, color: '#ef4444' }}>
                      -R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Nenhuma despesa registrada.</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 600, paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
              <span>Total de Despesas</span>
              <span style={{ color: '#ef4444' }}>
                R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Resultado */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: resultado >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>RESULTADO DO EXERCÍCIO</span>
            <span style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: resultado >= 0 ? '#22c55e' : '#ef4444',
            }}>
              {resultado >= 0 ? '+' : '-'} R$ {Math.abs(resultado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Despesas por Categoria */}
      {categorias.length > 0 && (
        <div className="admin-card">
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            Despesas por Categoria
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categorias.map(({ categoria, valor }, index) => {
              const percentual = (valor / totalDespesas) * 100;
              return (
                <div key={categoria}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: 500 }}>{categoria}</span>
                    <span style={{ fontWeight: 600 }}>
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentual.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{
                    height: '24px',
                    backgroundColor: 'var(--admin-bg)',
                    borderRadius: '0.3rem',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentual}%`,
                      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#a855f7'][index % 5],
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function DREPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <DREContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

