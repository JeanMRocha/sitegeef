import { getInstituicao } from "../../actions";
import { Suspense } from "react";
import IdentificacaoForm from "@/components/admin/instituicao/identificacao-form";

export const metadata = {
  title: "Editar Identificação - Instituição - Admin GEEF",
};

async function IdentificacaoEditContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Identificação</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <IdentificacaoForm initialData={instituicao} />
        </div>
      </section>
    </div>
  );
}

export default function IdentificacaoEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <IdentificacaoEditContent />
    </Suspense>
  );
}
