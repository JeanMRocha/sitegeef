import Link from "next/link";
import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { IconPlus, IconSearch } from "@/components/icons";
import { getMusicasResumo, listMusicas } from "@/lib/musicas";

export const metadata = {
  title: "Músicas - Reunião pública - Admin GEEF",
};

type PageProps = {
  searchParams?: Promise<{ q?: string; salvo?: string }>;
};

async function MusicasContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = typeof params.q === "string" ? params.q : "";
  const isSaved = params.salvo === "1";

  const [musicas, musicasResumo] = await Promise.all([listMusicas(q), getMusicasResumo()]);

  return (
    <div className="area-page">
      <div className="admin-page-header admin-page-header--music-catalog">
        <div className="admin-page-header-copy">
          <span className="admin-dashboard-kicker">Reunião pública</span>
          <div className="admin-page-title-row">
            <h1 className="admin-page-title">Músicas</h1>
            <span className="music-catalog-count-pill">{musicasResumo.length} cadastradas</span>
          </div>
        </div>

        <form method="get" className="admin-search-bar admin-search-bar--catalog">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por autor, título ou letra..."
          />
          <button type="submit" className="profile-form-btn profile-form-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconSearch size={16} />
            Buscar
          </button>
        </form>

        <Link href="/admin/reuniao-publica/musicas/nova" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IconPlus size={18} />
          Nova música
        </Link>
      </div>

      {isSaved && (
        <section className="area-section">
          <div style={{ padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", borderRadius: "0.5rem" }}>
            <p style={{ margin: 0, color: "#16a34a", fontSize: "0.95rem" }}>✓ Música salva com sucesso!</p>
          </div>
        </section>
      )}

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Catálogo</h2>
          </div>

          {musicas.length === 0 ? (
            <div className="area-empty">
              <p>Nenhuma música encontrada.</p>
              {q && (
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "var(--text-muted)" }}>
                  Tente outro termo de busca ou{" "}
                  <Link href="/admin/reuniao-publica/musicas" style={{ color: "var(--primary)" }}>
                    limpe a busca
                  </Link>
                  .
                </p>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Tom</th>
                  <th>Partes</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {musicas.map((musica) => (
                  <tr key={musica.id}>
                    <td style={{ fontWeight: 600 }}>{musica.titulo}</td>
                    <td>{musica.autor}</td>
                    <td>{musica.tom || "—"}</td>
                    <td>{musica.partes.length}</td>
                    <td>
                      <span
                        className="inline-status"
                        style={{
                          backgroundColor:
                            musica.status === "ativa"
                              ? "var(--status-success-bg)"
                              : musica.status === "rascunho"
                                ? "var(--status-info-bg)"
                                : "var(--surface-secondary-hover)",
                          color:
                            musica.status === "ativa"
                              ? "var(--status-success-text)"
                              : musica.status === "rascunho"
                                ? "var(--status-info-text)"
                                : "var(--text-primary)",
                          border: "1px solid var(--border-medium)",
                        }}
                      >
                        {musica.status === "ativa"
                          ? "Ativa"
                          : musica.status === "rascunho"
                            ? "Rascunho"
                            : "Inativa"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <Link
                          href={`/admin/reuniao-publica/musicas/${musica.id}`}
                          className="admin-btn admin-btn-small"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/musicas/${musica.slug}`}
                          className="admin-btn admin-btn-small"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default function MusicasPage(props: PageProps) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={["diretoria", "secretaria", "comunicacao"]}
      redirectPath="/admin/reuniao-publica/musicas"
      title="Músicas"
    >
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
        <MusicasContent {...props} />
      </Suspense>
    </AdminModuleGate>
  );
}
