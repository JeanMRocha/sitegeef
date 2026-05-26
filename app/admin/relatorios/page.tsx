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
  const moduleLinks = [
    {
      href: "/admin/financeiro/dre",
      title: "DRE Financeiro",
      text: "Receitas, despesas e resultado por centro de custo",
    },
    {
      href: "/admin/estudos",
      title: "Estudos Doutrinários",
      text: "Cursos, turmas, frequências, facilitadores",
    },
    {
      href: "/admin/livraria",
      title: "Livraria",
      text: "Vendas, estoque, movimentos e relatórios",
    },
    {
      href: "/admin/biblioteca",
      title: "Biblioteca",
      text: "Empréstimos, reservas, acervo e devoluções",
    },
    {
      href: "/admin/operacao",
      title: "Atendimento Espiritual",
      text: "Estatísticas, histórico e irradiações ativas",
    },
    {
      href: "/admin/apse",
      title: "APSE",
      text: "Famílias assistidas, campanhas e atendimentos",
    },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Relatórios</p>
            <h1 className="area-hero-title">Relatórios</h1>
          </div>
        </div>
        <p className="area-subtitle">Síntese e análise de dados da organização.</p>
      </section>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Pessoas ativas</span>
            <strong>{stats.pessoasAtivas}</strong>
          </div>
          <div className="stat-card">
            <span>Cursos ativos</span>
            <strong>{stats.cursosAtivos}</strong>
          </div>
          <div className="stat-card">
            <span>Turmas total</span>
            <strong>{stats.turmasTotal}</strong>
          </div>
          <div className="stat-card">
            <span>Famílias assistidas</span>
            <strong>{stats.familiasAssistidas}</strong>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Resumo financeiro - {meses[relatorio.mes - 1]?.nome} de {relatorio.ano}</h2>
          <p>Consolidação do período selecionado.</p>
        </div>
        <div className="table-surface">

          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="stat-card">
              <span>Receitas</span>
              <strong style={{ color: '#22c55e' }}>
                R$ {relatorio.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="stat-card">
              <span>Despesas</span>
              <strong style={{ color: '#ef4444' }}>
                R$ {relatorio.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="stat-card">
              <span>Resultado</span>
              <strong style={{ color: relatorio.resultado >= 0 ? '#22c55e' : '#ef4444' }}>
                R$ {relatorio.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          <p style={{ margin: '1rem 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}>Relatórios detalhados estão disponíveis nos módulos específicos.</p>
        </div>
      </section>

      <section className="area-section">
        <div className="module-grid">
          {moduleLinks.map((item) => (
            <Link key={item.href} href={item.href} className="module-card">
              <p className="module-title">{item.title}</p>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </section>
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
