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
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Acervo</p>
            <h1 className="area-hero-title">Biblioteca</h1>
          </div>
          <Link href="/admin/biblioteca/nova-obra" className="profile-form-btn profile-form-btn-primary">
            Nova Obra
          </Link>
        </div>
        <p className="area-subtitle">Gerenciamento de obras, exemplares e catálogo.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <form method="get" className="module-grid" style={{ alignItems: "end" }}>
            <label className="profile-form-field" style={{ gridColumn: "1 / -2" }}>
              <span>Buscar por título ou autor</span>
              <input type="text" name="search" placeholder="Buscar por título ou autor..." defaultValue={search} className="profile-form-input" />
            </label>
            <div className="area-panel-item">
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Buscar</button>
              {search ? <Link href="/admin/biblioteca" className="profile-form-btn profile-form-btn-secondary">Limpar</Link> : null}
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {obras.length === 0 ? (
            <div className="area-empty">
              <p>{search ? "Nenhuma obra encontrada." : "Nenhuma obra cadastrada."}</p>
              <Link href="/admin/biblioteca/nova-obra" className="profile-form-btn profile-form-btn-primary">
                Adicionar primeira obra
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
                      {obra.categoria ? <span className="tag">{obra.categoria}</span> : "—"}
                    </td>
                    <td>
                      <span className="inline-status inline-status-success">
                        {obra.publico}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, textAlign: "center" }}>{obra.exemplares?.length || 0}</td>
                    <td>
                      <Link href={`/admin/biblioteca/${obra.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
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
        <div className="area-panel-grid" style={{ justifyContent: "center", marginTop: "2rem" }}>
          {page > 1 && (
            <Link href={`/admin/biblioteca?page=${page - 1}${search ? `&search=${search}` : ""}`} className="profile-form-btn profile-form-btn-secondary">
              Anterior
            </Link>
          )}
          <span className="area-panel-item" style={{ alignSelf: "center", fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/biblioteca?page=${page + 1}${search ? `&search=${search}` : ""}`} className="profile-form-btn profile-form-btn-secondary">
              Próxima
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
