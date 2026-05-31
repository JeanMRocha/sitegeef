import Link from "next/link";
import { getDepartamentos } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Departamentos - Admin GEEF",
};

type DepartamentoListItem = {
  id: string;
  nome: string;
  descricao?: string | null;
  coordenador_id?: string | null;
  departamento_membros?: Array<{ pessoa_id?: string | null }>;
};

async function DepartamentosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);

  const { departamentos, total, pageSize } = await getDepartamentos(page);
  const departamentoList = departamentos as DepartamentoListItem[];
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Estrutura</span>
          <h1 className="admin-page-title">Departamentos</h1>
          <p className="admin-page-subtitle">Organizações internas do GEEF</p>
        </div>
        <Link href="/admin/departamentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Departamento
        </Link>
      </div>

      <section className="area-section">
        <div className="admin-card table-surface">
          {departamentoList.length === 0 ? (
            <div className="suspense-center text-center-muted">
              <p>Nenhum departamento cadastrado.</p>
              <Link href="/admin/departamentos/novo" className="admin-btn admin-btn-primary mt-1">
                ➕ Criar primeiro departamento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Coordenador</th>
                    <th>Membros</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {departamentoList.map((dept) => (
                    <tr key={dept.id}>
                      <td>
                        <strong>{dept.nome}</strong>
                      </td>
                      <td className="text-sm-muted">
                        {dept.descricao ? dept.descricao.substring(0, 50) : "—"}
                        {dept.descricao && dept.descricao.length > 50 ? "..." : ""}
                      </td>
                      <td className="text-sm-muted">{dept.coordenador_id ? "✅ Sim" : "—"}</td>
                      <td className="text-sm-muted">
                        <strong>{dept.departamento_membros?.length || 0}</strong>
                      </td>
                      <td>
                        <Link href={`/admin/departamentos/${dept.id}`} className="admin-btn admin-btn-small">
                          ✏️ Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <div className="page-pagination">
          {page > 1 && (
            <Link href={`/admin/departamentos?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span className="page-pagination-label">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/departamentos?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function DepartamentosPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <DepartamentosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
