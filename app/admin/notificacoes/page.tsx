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
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Notificações</span>
          <h1 className="admin-page-title">Notificações</h1>
          <p className="admin-page-subtitle">Painel de notificações do sistema</p>
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
        <div className="admin-card">
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.1rem", color: "var(--text)" }}>Todas as notificações</h2>

          {notificacoes.length > 0 ? (
            <div className="table-surface">
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
                      <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                        {new Date(notif.criado_em).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ fontSize: "0.9rem" }}>
                        {notif.tipo === "sistema" && "⚙️ Sistema"}
                        {notif.tipo === "alerta" && "⚠️ Alerta"}
                        {notif.tipo === "sucesso" && "✓ Sucesso"}
                        {notif.tipo === "info" && "ℹ️ Info"}
                      </td>
                      <td style={{ fontWeight: 500, maxWidth: "150px" }}>{notif.titulo}</td>
                      <td style={{ fontSize: "0.9rem", color: "var(--muted)", maxWidth: "200px" }}>
                        {notif.mensagem.substring(0, 50)}...
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {notif.canal === "interno" && "🔔 Interno"}
                        {notif.canal === "email" && "📧 E-mail"}
                        {notif.canal === "whatsapp" && "💬 WhatsApp"}
                      </td>
                      <td>
                        <span
                          className="inline-status"
                          style={{
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
                          }}
                        >
                          {notif.status === "pendente" && "⏳ Pendente"}
                          {notif.status === "enviado" && "✓ Enviado"}
                          {notif.status === "falhou" && "✕ Falhou"}
                          {notif.status === "lida" && "👁️ Lida"}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/notificacoes/${notif.id}`} className="admin-btn admin-btn-small">
                          👁️ Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
