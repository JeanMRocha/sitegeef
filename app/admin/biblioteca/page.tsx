import Link from "next/link";
import { getObras } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Biblioteca - Admin GEEF",
};

async function BibliotecaList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";

  const { obras, total, pageSize } = await getObras(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Biblioteca</span>
          <h1 className="admin-page-title">Biblioteca</h1>
          <p className="admin-page-subtitle">Gerenciamento de obras e exemplares</p>
        </div>
        <Link href="/admin/biblioteca/nova-obra" className="admin-btn admin-btn-primary">
          ➕ Nova Obra
        </Link>
      </div>

      <section className="area-section">
        <div className="admin-card">
          <form method="get" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "minmax(0, 1fr) auto auto", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                Buscar por título ou autor
              </label>
              <input
                type="text"
                name="search"
                placeholder="Buscar por título ou autor..."
                defaultValue={search}
                className="profile-form-input"
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "auto" }}>
              🔍 Buscar
            </button>
            {search ? (
              <Link href="/admin/biblioteca" className="admin-btn admin-btn-secondary" style={{ width: "auto" }}>
                ✕ Limpar
              </Link>
            ) : (
              <span />
            )}
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card table-surface">
          {obras.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
              <p>{search ? "Nenhuma obra encontrada." : "Nenhuma obra cadastrada."}</p>
              <Link href="/admin/biblioteca/nova-obra" className="admin-btn admin-btn-primary" style={{ marginTop: "1rem" }}>
                ➕ Adicionar primeira obra
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoria</th>
                  <th>Público</th>
                  <th>Exemplares</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {obras.map((obra: any) => (
                  <tr key={obra.id}>
                    <td style={{ fontWeight: 500 }}>{obra.titulo}</td>
                    <td style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{obra.autor || "—"}</td>
                    <td>
                      {obra.categoria ? (
                        <span className="inline-status" style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--uva-700)" }}>
                          {obra.categoria}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        className="inline-status"
                        style={{
                          backgroundColor:
                            obra.publico === "adulto"
                              ? "rgba(59, 130, 246, 0.1)"
                              : obra.publico === "jovem"
                                ? "rgba(168, 85, 247, 0.1)"
                                : "rgba(34, 197, 94, 0.1)",
                          color:
                            obra.publico === "adulto"
                              ? "var(--uva-700)"
                              : obra.publico === "jovem"
                                ? "#a855f7"
                                : "#22c55e",
                        }}
                      >
                        {obra.publico}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, textAlign: "center" }}>{obra.exemplares?.length || 0}</td>
                    <td>
                      <Link href={`/admin/biblioteca/${obra.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
          {page > 1 && (
            <Link href={`/admin/biblioteca?page=${page - 1}${search ? `&search=${search}` : ""}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: "0.6rem 1.2rem", alignSelf: "center", fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/biblioteca?page=${page + 1}${search ? `&search=${search}` : ""}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function BibliotecaPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <BibliotecaList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
