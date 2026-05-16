import Link from "next/link";
import { getDiretorias, getCargos, getCargoOcupacoes, getAssembleias } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Governança - Admin GEEF",
};

async function GovernancaContent() {
  const diretorias = await getDiretorias();
  const cargos = await getCargos();
  const ocupacoes = await getCargoOcupacoes();
  const assembleias = await getAssembleias();
  const diretoriaAtiva = diretorias.find((d: any) => d.status === "ativa");

  const cards = [
    { label: "Diretorias", value: diretorias.length },
    { label: "Cargos cadastrados", value: cargos.length },
    { label: "Pessoas em cargo", value: ocupacoes.filter((o: any) => o.status === "ativo").length },
    { label: "Assembleias", value: assembleias.length },
  ];

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Governança</span>
          <h1 className="admin-page-title">Governança</h1>
          <p className="admin-page-subtitle">Gestão de diretorias, cargos e assembleias</p>
        </div>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          {cards.map((item) => (
            <div key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="module-grid">
          <Link href="/admin/governanca/diretorias" className="module-card">
            <p className="module-title">👔 Diretorias</p>
            <p>Cadastros e períodos de gestão.</p>
          </Link>
          <Link href="/admin/governanca/cargos" className="module-card">
            <p className="module-title">🎖️ Cargos</p>
            <p>Estrutura de funções e responsabilidades.</p>
          </Link>
          <Link href="/admin/governanca/assembleias" className="module-card">
            <p className="module-title">🏛️ Assembleias</p>
            <p>Reuniões e atas institucionais.</p>
          </Link>
        </div>
      </section>

      {diretoriaAtiva && (
        <section className="area-section">
          <div className="admin-card">
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.1rem", color: "var(--text)" }}>
              Diretoria ativa: {diretoriaAtiva.nome}
            </h2>

            {ocupacoes.length > 0 ? (
              <div className="table-surface">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pessoa</th>
                      <th>Cargo</th>
                      <th>Data de Início</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocupacoes
                      .filter((o: any) => o.diretoria_id === diretoriaAtiva.id && o.status === "ativo")
                      .map((ocupacao: any) => (
                        <tr key={ocupacao.id}>
                          <td style={{ fontWeight: 500 }}>{ocupacao.pessoa?.nome}</td>
                          <td style={{ fontSize: "0.9rem" }}>{ocupacao.cargo?.nome}</td>
                          <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                            {ocupacao.data_inicio ? new Date(ocupacao.data_inicio).toLocaleDateString("pt-BR") : "—"}
                          </td>
                          <td>
                            <span className="inline-status inline-status-success">✓ Ativo</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="area-empty">Nenhuma pessoa em cargo nesta diretoria.</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default function GovernancaPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <GovernancaContent />
    </Suspense>
  );
}
