import Link from "next/link";
import { getSaldoMes, getMovimentosFinanceiros } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Financeiro - Admin GEEF",
};

async function FinanceiroContent() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const { entradas, saidas, saldo } = await getSaldoMes(mesAtual, anoAtual);
  const movimentos = await getMovimentosFinanceiros(mesAtual, anoAtual);

  const quickLinks = [
    { href: "/admin/financeiro/plano-contas", title: "Plano de Contas", text: "Estrutura contábil e categorias" },
    { href: "/admin/financeiro/centros-custo", title: "Centros de Custo", text: "Organização por áreas" },
    { href: "/admin/financeiro/lancamentos", title: "Lançamentos", text: "Movimentos e registros" },
    { href: "/admin/financeiro/dre", title: "Relatório DRE", text: "Resumo gerencial e análise" },
  ];

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Financeiro</span>
          <h1 className="admin-page-title">Financeiro</h1>
          <p className="admin-page-subtitle">
            {new Date(anoAtual, mesAtual - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Entradas</span>
            <strong style={{ color: "#22c55e" }}>R$ {entradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="stat-card">
            <span>Saídas</span>
            <strong style={{ color: "#ef4444" }}>R$ {saidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="stat-card">
            <span>Saldo</span>
            <strong style={{ color: saldo >= 0 ? "#3b82f6" : "#ef4444" }}>R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="module-grid">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="module-card">
              <p className="module-title">{item.title}</p>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>Últimos lançamentos</h2>
            <Link href="/admin/financeiro/lancamentos" className="admin-btn admin-btn-small">
              Ver Todos →
            </Link>
          </div>

          {movimentos.length > 0 ? (
            <div className="table-surface">
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
                      <td style={{ fontSize: "0.9rem" }}>{new Date(mov.data).toLocaleDateString("pt-BR")}</td>
                      <td style={{ fontSize: "0.9rem", fontWeight: 500 }}>{mov.descricao}</td>
                      <td>
                        <span
                          className="inline-status"
                          style={{
                            backgroundColor: mov.tipo === "entrada" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: mov.tipo === "entrada" ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {mov.tipo === "entrada" ? "📥 Entrada" : "📤 Saída"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: mov.tipo === "entrada" ? "#22c55e" : "#ef4444" }}>
                        R$ {mov.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{mov.centros_custo?.nome || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">
              <p style={{ margin: 0 }}>Nenhum lançamento neste mês.</p>
              <Link href="/admin/financeiro/lancamentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
                ➕ Novo Lançamento
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function FinanceiroPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <FinanceiroContent />
    </Suspense>
  );
}
