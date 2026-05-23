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
          {instituicao?.missao && (
            <div className="area-panel-item" style={{ marginBottom: '1.5rem' }}>
              <strong>Missão</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{instituicao.missao}</p>
            </div>
          )}

          {instituicao?.visao && (
            <div className="area-panel-item" style={{ marginBottom: '1.5rem' }}>
              <strong>Visão</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{instituicao.visao}</p>
            </div>
          )}

          {instituicao?.valores && (
            <div className="area-panel-item">
              <strong>Valores</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{instituicao.valores}</p>
            </div>
          )}

          {!instituicao?.missao && !instituicao?.visao && !instituicao?.valores && (
            <div className="area-empty">Nenhuma missão ou valores registrados.</div>
          )}
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
