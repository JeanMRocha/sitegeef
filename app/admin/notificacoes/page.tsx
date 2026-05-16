import Link from "next/link";
import { getNotificacoes } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Notificações - Admin GEEF",
};

async function NotificacoesContent() {
  const notificacoes = await getNotificacoes();
  const pendentes = notificacoes.filter((n: any) => n.status === "pendente");
  const lidas = notificacoes.filter((n: any) => n.status === "lida");

  const cards = [
    { label: "Pendentes", value: pendentes.length },
    { label: "Lidas", value: lidas.length },
    { label: "Total", value: notificacoes.length },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Mensageria</p>
            <h1 className="area-hero-title">Notificações</h1>
          </div>
        </div>
        <p className="area-subtitle">Painel de notificações do sistema.</p>
      </section>

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
        <div className="area-section-title">
          <h2>Todas as notificações</h2>
          <p>Visão geral do histórico e do estado de envio.</p>
        </div>
        <div className="table-surface">
          {notificacoes.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Mensagem</th>
                  <th>Canal</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {notificacoes.map((notif: any) => (
                  <tr key={notif.id} style={{ backgroundColor: notif.status === "pendente" ? "rgba(59, 130, 246, 0.02)" : "transparent" }}>
                    <td style={{ color: "var(--muted)" }}>{new Date(notif.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td>{notif.tipo}</td>
                    <td style={{ fontWeight: 500, maxWidth: "150px" }}>{notif.titulo}</td>
                    <td style={{ color: "var(--muted)", maxWidth: "200px" }}>{notif.mensagem.substring(0, 50)}...</td>
                    <td>{notif.canal}</td>
                    <td>
                      <span className="inline-status" style={{
                        backgroundColor:
                          notif.status === "pendente"
                            ? "rgba(249, 115, 22, 0.1)"
                            : notif.status === "enviado"
                              ? "rgba(34, 197, 94, 0.1)"
                              : notif.status === "falhou"
                                ? "rgba(239, 68, 68, 0.1)"
                                : "rgba(107, 114, 128, 0.1)",
                        color:
                          notif.status === "pendente"
                            ? "#f97316"
                            : notif.status === "enviado"
                              ? "#22c55e"
                              : notif.status === "falhou"
                                ? "#ef4444"
                                : "#6b7280",
                      }}>
                        {notif.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/notificacoes/${notif.id}`} className="profile-form-btn profile-form-btn-secondary">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">Nenhuma notificação.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function NotificacoesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <NotificacoesContent />
    </Suspense>
  );
}
