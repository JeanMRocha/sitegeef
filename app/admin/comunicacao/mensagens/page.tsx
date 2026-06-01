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

type ContatoMensagem = {
  id: string;
  criado_em?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  assunto?: string | null;
  status: "novo" | "lido" | "respondido" | string;
  pagina_origem?: string | null;
  referer?: string | null;
};

export default async function AdminContatoMensagensPage() {
  const mensagens = (await loadContatoMensagensAdmin()) as ContatoMensagem[];

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
                    <td className="text-xs-muted table-cell-truncate">{formatDate(mensagem.criado_em)}</td>
                    <td className="text-sm-500">{mensagem.nome}</td>
                    <td className="text-sm-muted">
                      {mensagem.email}
                      <br />
                      {mensagem.telefone || "—"}
                    </td>
                    <td className="text-sm-muted table-cell-truncate table-cell-truncate-260">{mensagem.assunto || "—"}</td>
                    <td>
                      <span
                        className={`inline-status ${
                          mensagem.status === "novo"
                            ? "inline-status-info"
                            : mensagem.status === "lido"
                              ? "inline-status-warning"
                              : mensagem.status === "respondido"
                                ? "inline-status-success"
                                : "inline-status-neutral"
                        }`}
                      >
                        {mensagem.status}
                      </span>
                    </td>
                    <td className="text-sm-muted">
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
