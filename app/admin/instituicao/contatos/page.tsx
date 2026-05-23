import Link from "next/link";
import { getContatos } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Contatos - Instituição - Admin GEEF",
};

async function ContatosContent() {
  const contatos = await getContatos();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Contatos</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/contatos/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {contatos.length === 0 ? (
            <div className="area-empty">Nenhum contato registrado.</div>
          ) : (
            <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {contatos.map((contato: any) => (
                <div key={contato.id} className="area-panel-item instituicao-contato-card">
                  <strong>{contato.tipo || "Contato"}</strong>
                  <p>
                    {contato.telefone && <>☎️ {contato.telefone}<br /></>}
                    {contato.whatsapp && <>💬 {contato.whatsapp}<br /></>}
                    {contato.email && <>📧 {contato.email}<br /></>}
                    {contato.instagram && <>📸 {contato.instagram}</>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ContatosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ContatosContent />
    </Suspense>
  );
}
