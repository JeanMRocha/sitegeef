import { getEnderecos } from "../../actions";
import { Suspense } from "react";
import EnderecoForm from "@/components/admin/instituicao/endereco-form";

export const metadata = {
  title: "Editar Endereço - Instituição - Admin GEEF",
};

async function EnderecoEditContent() {
  const enderecos = await getEnderecos();
  const endereco = enderecos[0] || null;

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Endereço</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <EnderecoForm initialData={endereco} />
        </div>
      </section>
    </div>
  );
}

export default function EnderecoEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <EnderecoEditContent />
    </Suspense>
  );
}
