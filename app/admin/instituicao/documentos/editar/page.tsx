import { Suspense } from "react";

export const metadata = {
  title: "Editar Documentos - Instituição - Admin GEEF",
};

function DocumentosEditContent() {
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
          <div className="area-empty">
            <p>Gerenciamento de documentos legais, certificados e registros.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Esta funcionalidade será expandida em breve.</p>
          </div>
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
