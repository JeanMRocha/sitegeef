import Link from "next/link";
import { getModelosDocumentos } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Documentos e LGPD - Admin GEEF",
};

async function ModelosList() {
  const modelos = await getModelosDocumentos();

  const tabs = [
    { href: "/admin/documentos", label: "📄 Modelos" },
    { href: "/admin/documentos/termos", label: "✍️ Termos Assinados" },
    { href: "/admin/documentos/consentimentos", label: "🔒 Consentimentos LGPD" },
    { href: "/admin/documentos/voluntariado", label: "🤝 Serviços Voluntários" },
  ];

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Documentos</span>
          <h1 className="admin-page-title">Documentos e LGPD</h1>
          <p className="admin-page-subtitle">Modelos de termos, consentimentos e voluntariado</p>
        </div>
        <Link href="/admin/documentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Modelo
        </Link>
      </div>

      <section className="area-section">
        <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="module-card">
              <p className="module-title">{tab.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card table-surface">
          {modelos.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
              <p>Nenhum modelo de documento cadastrado.</p>
              <Link href="/admin/documentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: "1rem" }}>
                ➕ Criar primeiro modelo
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Versão</th>
                  <th>Conteúdo</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {modelos.map((modelo: any) => (
                  <tr key={modelo.id}>
                    <td>
                      <span className="inline-status" style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--uva-700)" }}>
                        {modelo.tipo}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{modelo.titulo}</td>
                    <td style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{modelo.versao || "—"}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{modelo.conteudo ? "✓ Sim" : "—"}</td>
                    <td>
                      <Link href={`/admin/documentos/${modelo.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
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

export default function DocumentosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ModelosList />
    </Suspense>
  );
}
