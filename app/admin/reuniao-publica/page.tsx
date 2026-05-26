import Link from "next/link";

export const metadata = {
  title: "Reunião pública - Admin GEEF",
};

export default function ReuniaoPublicaPage() {
  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Publicação e exibição</p>
            <h1 className="area-hero-title">Reunião pública</h1>
          </div>
        </div>
        <p className="area-subtitle">
          Músicas, pareamento da tela pública e controle do que está sendo exibido ao vivo.
        </p>
      </section>

      <section className="area-section admin-grid-two">
        <div className="table-surface">
          <div className="area-section-title">
            <h2>Músicas</h2>
            <p>Acesse o catálogo, cadastre novas músicas e ajuste a estrutura de exibição pública.</p>
          </div>
          <div className="admin-dashboard-actions">
            <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-primary">
              🎵 Abrir músicas
            </Link>
            <Link href="/musicas/exibir" className="admin-btn admin-btn-secondary" target="_blank" rel="noreferrer">
              🖥️ Exibição pública
            </Link>
          </div>
        </div>

        <div className="table-surface">
          <div className="area-section-title">
            <h2>Atalho de operação</h2>
            <p>Use o telefone para trocar a música exibida sem precisar voltar ao computador.</p>
          </div>
          <div className="admin-dashboard-actions">
            <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary">
              Abrir painel
            </Link>
            <Link href="/admin/reuniao-publica/musicas?q=" className="admin-btn admin-btn-secondary">
              Buscar catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
