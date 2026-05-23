import { getInstituicao } from "../../actions";
import { Suspense } from "react";
import MissaoValoresForm from "@/components/admin/instituicao/missao-valores-form";

export const metadata = {
  title: "Editar Missão e Valores - Instituição - Admin GEEF",
};

async function MissaoValoresEditContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Missão e Valores</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <MissaoValoresForm initialData={instituicao} />
        </div>
      </section>
    </div>
  );
}

export default function MissaoValoresEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <MissaoValoresEditContent />
    </Suspense>
  );
}
