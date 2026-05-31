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
          <div className="admin-actions">
            <Link href="/admin/instituicao/missao-valores/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {instituicao?.missao && (
            <div className="area-panel-item mb-1-5">
              <strong>Missão</strong>
              <p className="text-pre-wrap">{instituicao.missao}</p>
            </div>
          )}

          {instituicao?.visao && (
            <div className="area-panel-item mb-1-5">
              <strong>Visão</strong>
              <p className="text-pre-wrap">{instituicao.visao}</p>
            </div>
          )}

          {instituicao?.valores && (
            <div className="area-panel-item">
              <strong>Valores</strong>
              <p className="text-pre-wrap">{instituicao.valores}</p>
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
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <MissaoValoresContent />
    </Suspense>
  );
}
