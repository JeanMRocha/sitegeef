import Link from "next/link";
import { getContatos } from "../actions";
import { Suspense } from "react";
import ContatosDeleteButton from "@/components/admin/instituicao/contatos-delete-button";

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
              + Adicionar Contato
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
                <div key={contato.id} className="area-panel-item instituicao-contato-card" style={{ position: 'relative', paddingRight: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <strong>{contato.tipo || "Contato"}</strong>
                    <ContatosDeleteButton contatoId={contato.id} />
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    {contato.telefone && <>☎️ {contato.telefone}<br /></>}
                    {contato.whatsapp && <>💬 {contato.whatsapp}<br /></>}
                    {contato.email && <>📧 {contato.email}<br /></>}
                    {contato.instagram && <>📸 @{contato.instagram}<br /></>}
                    {contato.facebook && <>f {contato.facebook}<br /></>}
                    {contato.youtube && <>▶️ {contato.youtube}<br /></>}
                    {contato.site && <><🌐 {contato.site}<br /></>}
                  </p>
                  {contato.pessoas?.nome && (
                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      👤 {contato.pessoas.nome}
                    </p>
                  )}
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
