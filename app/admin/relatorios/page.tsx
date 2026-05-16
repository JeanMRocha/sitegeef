import Link from 'next/link';
import { getRelatorioFinanceiro, getEstatisticasGerais, getMesesDisponiveis, getAnosDisponiveis } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Relatórios - Admin GEEF',
};

async function RelatoriosContent() {
  const stats = await getEstatisticasGerais();
  const relatorio = await getRelatorioFinanceiro();
  const meses = await getMesesDisponiveis();
  const anos = await getAnosDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Relatórios</h1>
          <p className="admin-page-subtitle">Síntese e análise de dados da organização</p>
        </div>
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
            Pessoas Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {stats.pessoasAtivas}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Cursos Ativos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {stats.cursosAtivos}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Turmas Total
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {stats.turmasTotal}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Famílias Assistidas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {stats.familiasAssistidas}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Resumo Financeiro — {meses[relatorio.mes - 1]?.nome} de {relatorio.ano}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '0.6rem',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Receitas</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
              R$ {relatorio.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.6rem',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Despesas</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
              R$ {relatorio.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: relatorio.resultado >= 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            border: relatorio.resultado >= 0 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.6rem',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Resultado</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: relatorio.resultado >= 0 ? '#22c55e' : '#ef4444' }}>
              R$ {relatorio.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
          💡 Relatórios detalhados estão disponíveis nos módulos específicos (Financeiro, Estudos, Atendimento, etc).
        </p>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Links para Relatórios por Módulo</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          <Link href="/admin/financeiro/dre" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>💰 DRE Financeiro</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Receitas, despesas, resultado por centro de custo</p>
          </Link>

          <Link href="/admin/estudos" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>📖 Estudos Doutrinários</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Cursos, turmas, frequências, facilitadores</p>
          </Link>

          <Link href="/admin/livraria" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>🛒 Livraria</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Vendas, estoque, movimentos, relatórios</p>
          </Link>

          <Link href="/admin/biblioteca" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>📚 Biblioteca</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Empréstimos, reservas, acervo, devoluções</p>
          </Link>

          <Link href="/admin/atendimento" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>🙏 Atendimento Espiritual</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Estatísticas, histórico, irradiações ativas</p>
          </Link>

          <Link href="/admin/apse" style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>🤝 APSE</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Famílias assistidas, campanhas, atendimentos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <RelatoriosContent />
    </Suspense>
  );
}
