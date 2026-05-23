import Link from "next/link";
import { getEnderecos } from "../actions";
import { Suspense } from "react";

export const metadata = {
  title: "Endereço - Instituição - Admin GEEF",
};

async function EnderecoContent() {
  const enderecos = await getEnderecos();
  const endereco = enderecos[0];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Endereço</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/admin/instituicao/endereco/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {endereco ? (
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="area-panel-item">
                <strong>Logradouro</strong>
                <p>{endereco.logradouro ? `${endereco.logradouro}, ${endereco.numero}` : "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Complemento</strong>
                <p>{endereco.complemento || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Bairro</strong>
                <p>{endereco.bairro || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>CEP</strong>
                <p>{endereco.cep || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Cidade</strong>
                <p>{endereco.cidade || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Estado</strong>
                <p>{endereco.estado || "—"}</p>
              </div>
            </div>
          ) : (
            <div className="area-empty">Nenhum endereço registrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function EnderecoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <EnderecoContent />
    </Suspense>
  );
}
