import Link from "next/link";
import { loadContatoMensagensAdmin } from "@/lib/contato-mensagens";

export const metadata = {
  title: "Mensagens do site - Admin GEEF",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminContatoMensagensPage() {
  const mensagens = await loadContatoMensagensAdmin();

  const stats = [
    { label: "Novas", value: mensagens.filter((item) => item.status === "novo").length },
    { label: "Lidas", value: mensagens.filter((item) => item.status === "lido").length },
    { label: "Respondidas", value: mensagens.filter((item) => item.status === "respondido").length },
    { label: "Total", value: mensagens.length },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Comunicação</p>
            <h1 className="area-hero-title">Mensagens do site</h1>
            <p className="area-subtitle">Inbox interno dos envios feitos pela página pública de contato.</p>
          </div>
          <div className="admin-actions">
            <Link href="/admin/comunicacao" className="admin-btn admin-btn-secondary">
              Voltar à comunicação
            </Link>
            <Link href="/admin/notificacoes" className="admin-btn admin-btn-secondary">
              Notificações
            </Link>
          </div>
        </div>

        <div className="area-summary-grid">
          {stats.map((item) => (
            <div key={item.label} className="area-summary-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {mensagens.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Origem</th>
                </tr>
              </thead>
              <tbody>
                {mensagens.map((mensagem) => (
                  <tr key={mensagem.id}>
                    <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{formatDate(mensagem.criado_em)}</td>
                    <td style={{ fontWeight: 600 }}>{mensagem.nome}</td>
                    <td style={{ fontSize: "0.92rem" }}>
                      {mensagem.email}
                      <br />
                      {mensagem.telefone || "—"}
                    </td>
                    <td style={{ fontSize: "0.92rem", maxWidth: "260px" }}>{mensagem.assunto || "—"}</td>
                    <td>
                      <span className="inline-status" style={{
                        backgroundColor:
                          mensagem.status === "novo"
                            ? "rgba(59, 130, 246, 0.1)"
                            : mensagem.status === "lido"
                              ? "rgba(250, 204, 21, 0.12)"
                              : mensagem.status === "respondido"
                                ? "rgba(34, 197, 94, 0.1)"
                                : "rgba(107, 114, 128, 0.1)",
                        color:
                          mensagem.status === "novo"
                            ? "#2563eb"
                            : mensagem.status === "lido"
                              ? "#b45309"
                              : mensagem.status === "respondido"
                                ? "#16a34a"
                                : "#6b7280",
                      }}>
                        {mensagem.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.92rem" }}>
                      {mensagem.pagina_origem || "/contato"}
                      <br />
                      {mensagem.referer ? "com referer" : "sem referer"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">Nenhuma mensagem recebida.</div>
          )}
        </div>
      </section>
    </div>
  );
}

