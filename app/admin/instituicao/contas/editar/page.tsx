import { Suspense } from "react";
import ContasForm from "@/components/admin/instituicao/contas-form";

export const metadata = {
  title: "Editar Contas Bancárias - Instituição - Admin GEEF",
};

function ContasEditContent() {
  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Contas Bancárias</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <ContasForm />
        </div>
      </section>
    </div>
  );
}

export default function ContasEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ContasEditContent />
    </Suspense>
  );
}
