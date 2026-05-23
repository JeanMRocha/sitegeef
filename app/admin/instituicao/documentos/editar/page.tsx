import { getInstituicao } from "../../actions";
import { Suspense } from "react";
import DocumentosForm from "@/components/admin/instituicao/documentos-form";

export const metadata = {
  title: "Editar Documentos - Instituição - Admin GEEF",
};

async function DocumentosEditContent() {
  const instituicao = await getInstituicao();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Documentos</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <DocumentosForm initialData={instituicao} />
        </div>
      </section>
    </div>
  );
}

export default function DocumentosEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <DocumentosEditContent />
    </Suspense>
  );
}
