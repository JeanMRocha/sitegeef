import Link from "next/link";
import { getInstituicao } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Documentos - Instituição - Admin GEEF",
};

async function DocumentosContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Documentos</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/documentos/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {instituicao?.estatuto_url ? (
            <div className="area-panel-item">
              <strong>Estatuto Social</strong>
              <p style={{ marginTop: "0.5rem" }}>
                <a href={instituicao.estatuto_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                  📄 Baixar documento
                </a>
              </p>
            </div>
          ) : (
            <div className="area-empty">Nenhum documento registrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function DocumentosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <DocumentosContent />
    </Suspense>
  );
}
