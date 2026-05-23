import Link from "next/link";
import { getContasBancarias } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Contas Bancárias - Instituição - Admin GEEF",
};

async function ContasContent() {
  const contas = await getContasBancarias();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Contas Bancárias e PIX</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/contas/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {contas.length === 0 ? (
            <div className="area-empty">Nenhuma conta registrada.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Banco</th>
                  <th>Conta</th>
                  <th>Finalidade</th>
                  <th>PIX</th>
                  <th>Visibilidade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contas.map((conta: any) => (
                  <tr key={conta.id}>
                    <td style={{ fontWeight: 600 }}>{conta.banco || "—"}</td>
                    <td style={{ fontSize: "0.9rem" }}>
                      {conta.agencia ? `${conta.agencia} / ${conta.conta}` : "—"}
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>{conta.finalidade || "—"}</td>
                    <td style={{ fontSize: "0.9rem" }}>{conta.chave_pix ? "✅" : "—"}</td>
                    <td style={{ fontSize: "0.9rem" }}>
                      {conta.visibilidade === "publica" ? "🌐 Pública" : "🔒 Privada"}
                    </td>
                    <td>
                      <span className={conta.ativo ? "inline-status inline-status-success" : "inline-status inline-status-danger"}>
                        {conta.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ContasPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ContasContent />
    </Suspense>
  );
}
