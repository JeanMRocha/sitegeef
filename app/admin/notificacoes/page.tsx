import Link from "next/link";
import { getNotificacoes } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Notificações - Admin GEEF",
};

type NotificacaoItem = {
  id: string;
  criado_em: string;
  tipo?: string | null;
  titulo: string;
  mensagem: string;
  canal?: string | null;
  status?: string | null;
};

async function NotificacoesContent() {
  const notificacoes = await getNotificacoes();
  const notificacaoList = notificacoes as NotificacaoItem[];
  const pendentes = notificacaoList.filter((n) => n.status === "pendente");
  const lidas = notificacaoList.filter((n) => n.status === "lida");

  const cards = [
    { label: "Pendentes", value: pendentes.length },
    { label: "Lidas", value: lidas.length },
    { label: "Total", value: notificacaoList.length },
  ];

  const getStatusClass = (status?: string | null) => {
    if (status === "pendente") return "inline-status inline-status-warning";
    if (status === "enviado") return "inline-status inline-status-success";
    if (status === "falhou") return "inline-status inline-status-danger";
    return "inline-status inline-status-neutral";
  };

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
          {notificacaoList.length > 0 ? (
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
                {notificacaoList.map((notif) => (
                  <tr key={notif.id} className={notif.status === "pendente" ? "table-row-info" : undefined}>
                    <td className="text-sm-muted">{new Date(notif.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td>{notif.tipo}</td>
                    <td className="table-cell-truncate"><strong>{notif.titulo}</strong></td>
                    <td className="text-sm-muted table-cell-truncate">{notif.mensagem.substring(0, 50)}...</td>
                    <td>{notif.canal}</td>
                    <td>
                      <span className={getStatusClass(notif.status)}>
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
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <NotificacoesContent />
    </Suspense>
  );
}
