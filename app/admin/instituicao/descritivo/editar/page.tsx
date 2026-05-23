import { getInstituicao } from "../../actions";
import { Suspense } from "react";
import DescritivoForm from "@/components/admin/instituicao/descritivo-form";

export const metadata = {
  title: "Editar Descritivo - Instituição - Admin GEEF",
};

async function DescritivoEditContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Descritivo</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <DescritivoForm initialData={instituicao} />
        </div>
      </section>
    </div>
  );
}

export default function DescritivoEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <DescritivoEditContent />
    </Suspense>
  );
}
