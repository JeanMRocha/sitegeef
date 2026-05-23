import Link from "next/link";
import { getInstituicao } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Descritivo - Instituição - Admin GEEF",
};

async function DescritivoContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Descritivo</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/descritivo/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {instituicao?.descricao && (
            <div className="area-panel-item" style={{ marginBottom: '1.5rem' }}>
              <strong>Descrição</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{instituicao.descricao}</p>
            </div>
          )}

          {instituicao?.historia && (
            <div className="area-panel-item">
              <strong>História</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{instituicao.historia}</p>
            </div>
          )}

          {!instituicao?.descricao && !instituicao?.historia && (
            <div className="area-empty">Nenhum descritivo registrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function DescritivoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <DescritivoContent />
    </Suspense>
  );
}
