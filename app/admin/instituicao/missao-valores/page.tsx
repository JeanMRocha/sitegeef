import Link from "next/link";
import { getInstituicao } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Missão e Valores - Instituição - Admin GEEF",
};

async function MissaoValoresContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Missão e Valores</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/missao-valores/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <div className="area-panel-item">
            <strong>Missão</strong>
            <p>{instituicao?.missao || "Nenhuma missão registrada."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MissaoValoresPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <MissaoValoresContent />
    </Suspense>
  );
}
