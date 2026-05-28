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
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Reunião pública</span>
          <h1 className="admin-page-title">Músicas</h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/reuniao-publica/musicas/autores" className="admin-btn admin-btn-secondary" title="Gerenciar autores">
            Autores
          </Link>
          <Link href="/admin/reuniao-publica/musicas/sessoes" className="admin-btn admin-btn-secondary" title="Sessões de pareamento">
            Sessões
          </Link>
          <Link href="/admin/reuniao-publica/musicas/nova" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconPlus size={18} />
            Nova música
          </Link>
        </div>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Músicas cadastradas</span>
            <strong>{musicasResumo.length}</strong>
          </div>
          <div className="stat-card">
            <span>Ativas</span>
            <strong>{musicasResumo.filter((m) => m.status === "ativa").length}</strong>
          </div>
          <div className="stat-card">
            <span>Rascunhos</span>
            <strong>{musicasResumo.filter((m) => m.status === "rascunho").length}</strong>
          </div>
          <div className="stat-card">
            <span>Inativas</span>
            <strong>{musicasResumo.filter((m) => m.status === "inativa").length}</strong>
          </div>
        </div>
      </section>

      {isSaved && (
        <section className="area-section">
          <div style={{ padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", borderRadius: "0.5rem" }}>
            <p style={{ margin: 0, color: "#16a34a", fontSize: "0.95rem" }}>✓ Música salva com sucesso!</p>
          </div>
        </section>
      )}

      <section className="area-section">
        <div className="admin-card">
          <form method="get" className="admin-search-bar">
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
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Catálogo</h2>
            <p>Abra uma música para editar, visualizar ou remover.</p>
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
                              ? "rgba(34, 197, 94, 0.2)"
                              : musica.status === "rascunho"
                                ? "rgba(168, 85, 247, 0.2)"
                                : "rgba(107, 114, 128, 0.2)",
                          color:
                            musica.status === "ativa"
                              ? "#16a34a"
                              : musica.status === "rascunho"
                                ? "#a855f7"
                                : "#6b7280",
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
