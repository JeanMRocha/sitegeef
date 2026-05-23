import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Identidade Visual - Instituição - Admin GEEF",
};

function IdentidadeVisualContent() {
  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Identidade Visual</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/identidade-visual/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <div className="area-empty">Gerenciar logo, cores e identidade visual.</div>
        </div>
      </section>
    </div>
  );
}

export default function IdentidadeVisualPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <IdentidadeVisualContent />
    </Suspense>
  );
}
