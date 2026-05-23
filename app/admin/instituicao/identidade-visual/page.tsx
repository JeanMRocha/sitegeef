import Link from "next/link";
import { getInstituicao } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Identidade Visual - Instituição - Admin GEEF",
};

async function IdentidadeVisualContent() {
  const instituicao = await getInstituicao();

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
          {instituicao?.logo_url || instituicao?.logo_com_fundo_url ? (
            <>
              <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "0.5rem" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Logotipos</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                  {instituicao.logo_url && (
                    <div>
                      <strong style={{ display: "block", marginBottom: "0.5rem" }}>Logo (Transparente)</strong>
                      <img src={instituicao.logo_url} alt="Logo" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "0.5rem" }} />
                    </div>
                  )}
                  {instituicao.logo_com_fundo_url && (
                    <div>
                      <strong style={{ display: "block", marginBottom: "0.5rem" }}>Logo (Com Fundo)</strong>
                      <img src={instituicao.logo_com_fundo_url} alt="Logo com Fundo" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "0.5rem" }} />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {instituicao?.identidade_visual_descricao || instituicao?.identidade_visual_letras_descricao || instituicao?.identidade_visual_visual_descricao || instituicao?.identidade_visual_composicao || instituicao?.identidade_visual_uso || instituicao?.identidade_visual_exemplos ? (
            <div className="stat-grid" style={{ gridTemplateColumns: "1fr" }}>
              {instituicao?.identidade_visual_descricao && (
                <div className="area-panel-item">
                  <strong>Descrição Geral</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_descricao}</p>
                </div>
              )}
              {instituicao?.identidade_visual_letras_descricao && (
                <div className="area-panel-item">
                  <strong>Descrição das Letras</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_letras_descricao}</p>
                </div>
              )}
              {instituicao?.identidade_visual_visual_descricao && (
                <div className="area-panel-item">
                  <strong>Descrição Visual</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_visual_descricao}</p>
                </div>
              )}
              {instituicao?.identidade_visual_composicao && (
                <div className="area-panel-item">
                  <strong>Composição</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_composicao}</p>
                </div>
              )}
              {instituicao?.identidade_visual_uso && (
                <div className="area-panel-item">
                  <strong>Diretrizes de Uso</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_uso}</p>
                </div>
              )}
              {instituicao?.identidade_visual_exemplos && (
                <div className="area-panel-item">
                  <strong>Exemplos</strong>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{instituicao.identidade_visual_exemplos}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="area-empty">Nenhuma informação de identidade visual registrada.</div>
          )}
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
