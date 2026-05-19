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
    { href: "/admin/observability?tab=fila", label: "🧭 Observabilidade" },
    { href: "/admin/lgpd", label: "🛡️ Central LGPD" },
    { href: "/admin/documentos/pedidos", label: "📮 Pedidos do Titular" },
    { href: "/admin/documentos/termos", label: "✍️ Termos Assinados" },
    { href: "/admin/documentos/consentimentos", label: "🔒 Consentimentos LGPD" },
    { href: "/admin/documentos/voluntariado", label: "🤝 Serviços Voluntários" },
    { href: "/admin/documentos/auditoria", label: "🧭 Auditoria LGPD" },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Documentos</p>
            <h1 className="area-hero-title">Documentos e LGPD</h1>
          </div>
          <Link href="/admin/documentos/novo" className="profile-form-btn profile-form-btn-primary">
            Novo Modelo
          </Link>
        </div>
        <p className="area-subtitle">Modelos, pedidos do titular, consentimentos, termos e voluntariado.</p>
      </section>

      <section className="area-section">
        <div className="area-panel-item">
          <strong>Nota rápida</strong>
          <p style={{ marginTop: '0.45rem' }}>
            Antes de registrar ou revogar consentimento, confirme finalidade, base legal e necessidade real do dado.
          </p>
        </div>
      </section>

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
        <div className="table-surface">
          {modelos.length === 0 ? (
            <div className="area-empty">
              <p>Nenhum modelo de documento cadastrado.</p>
              <Link href="/admin/documentos/novo" className="profile-form-btn profile-form-btn-primary">Criar primeiro modelo</Link>
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
                    <td><span className="tag">{modelo.tipo}</span></td>
                    <td style={{ fontWeight: 500 }}>{modelo.titulo}</td>
                    <td style={{ color: 'var(--muted)' }}>{modelo.versao || "—"}</td>
                    <td style={{ color: 'var(--muted)' }}>{modelo.conteudo ? "Sim" : "—"}</td>
                    <td>
                      <Link href={`/admin/documentos/${modelo.id}`} className="profile-form-btn profile-form-btn-secondary">Editar</Link>
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
