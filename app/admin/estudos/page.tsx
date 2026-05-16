import Link from "next/link";
import { getCursos, getTurmas } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Estudos - Admin GEEF",
};

async function EstudosContent() {
  const cursos = await getCursos();
  const turmas = await getTurmas();
  const turmasAtivas = turmas.filter((t: any) => t.status === "em_andamento");

  const cards = [
    { label: "Cursos ativos", value: cursos.filter((c: any) => c.ativo).length },
    { label: "Turmas em andamento", value: turmasAtivas.length },
    { label: "Total de turmas", value: turmas.length },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Estudos</p>
            <h1 className="area-hero-title">Estudos Doutrinários</h1>
          </div>
        </div>
        <p className="area-subtitle">Gestão de cursos e turmas de estudo.</p>
      </section>

      <section className="area-section">
        <div className="stat-grid">
          {cards.map((item) => (
            <div key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="module-grid">
          <Link href="/admin/estudos/cursos" className="module-card">
            <p className="module-title">📚 Cursos</p>
            <p>Gerencie conteúdos, status e organização dos estudos.</p>
          </Link>
          <Link href="/admin/estudos/turmas" className="module-card">
            <p className="module-title">👨‍🏫 Turmas</p>
            <p>Controle grupos em andamento, histórico e acompanhamento.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Cursos disponíveis</h2>
          <p>Cards de acesso rápido para cada curso.</p>
        </div>
        <div className="table-surface">

          {cursos.length > 0 ? (
            <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
              {cursos.map((curso: any) => (
                <Link
                  key={curso.id}
                  href={`/admin/estudos/cursos/${curso.id}`}
                  className="module-card"
                >
                  <p className="module-title">{curso.nome}</p>
                  <p>{curso.descricao || "Sem descrição"}</p>
                  <span
                    className="inline-status"
                    style={{
                      marginTop: "0.75rem",
                      backgroundColor: curso.ativo ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)",
                      color: curso.ativo ? "#22c55e" : "#6b7280",
                    }}
                  >
                    {curso.ativo ? "✓ Ativo" : "✕ Inativo"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhum curso cadastrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function EstudosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <EstudosContent />
    </Suspense>
  );
}
