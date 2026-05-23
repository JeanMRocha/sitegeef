import { getContatoTipos, getPessoasDisponiveis } from "../../actions";
import { Suspense } from "react";
import ContatosForm from "@/components/admin/instituicao/contatos-form";

export const metadata = {
  title: "Editar Contatos - Instituição - Admin GEEF",
};

async function ContatosEditContent() {
  const tipos = await getContatoTipos();
  const pessoas = await getPessoasDisponiveis();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Editar Contatos</h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <ContatosForm tiposDisponiveis={tipos} pessoasDisponiveis={pessoas} />
        </div>
      </section>
    </div>
  );
}

export default function ContatosEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ContatosEditContent />
    </Suspense>
  );
}
