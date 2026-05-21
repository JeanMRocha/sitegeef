import Link from "next/link";
import { Suspense } from "react";
import { GovernancaDocumentosWorkspace } from "@/components/admin/governanca-documentos-workspace";

export const metadata = {
  title: "Documentos Institucionais - Governança - Admin GEEF",
};

function GovernancaDocumentosPageContent() {
  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Governança</p>
            <h1 className="area-hero-title">Documentos institucionais</h1>
          </div>
          <Link href="/admin/governanca" className="profile-form-btn profile-form-btn-secondary">
            ← Voltar para governança
          </Link>
        </div>
        <p className="area-subtitle">
          Estrutura online para Estatuto Social, CNPJ, Registro em Cartório, Diretoria constituída e Regimento Interno.
        </p>
      </section>

      <section className="area-section">
        <div className="area-panel-item">
          <strong>Direção do produto</strong>
          <p style={{ marginTop: "0.45rem" }}>
            O documento nasce como tela web navegável. Exportar e imprimir entram como ações auxiliares, sem PDF como formato principal.
          </p>
        </div>
      </section>

      <GovernancaDocumentosWorkspace />
    </div>
  );
}

export default function GovernancaDocumentosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <GovernancaDocumentosPageContent />
    </Suspense>
  );
}
