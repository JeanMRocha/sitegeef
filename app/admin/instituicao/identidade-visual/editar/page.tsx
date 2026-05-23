import { getInstituicao } from "../../actions";
import { Suspense } from "react";
import IdentidadeVisualForm from "@/components/admin/instituicao/identidade-visual-form";

export const metadata = {
  title: "Editar Identidade Visual - Instituição - Admin GEEF",
};

async function IdentidadeVisualEditContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Identidade Visual</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <IdentidadeVisualForm initialData={instituicao} />
        </div>
      </section>
    </div>
  );
}

export default function IdentidadeVisualEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <IdentidadeVisualEditContent />
    </Suspense>
  );
}
