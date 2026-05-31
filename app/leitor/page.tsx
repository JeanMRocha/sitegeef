import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCachedUserArea } from "@/lib/areas/user-area";
import { getRequestLocale } from "@/lib/multilingual/server";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "en" ? "My Area | GEEF Library" : "Minha Área - Biblioteca GEEF",
    description:
      locale === "en"
        ? "Track your loans and reservations in the GEEF library."
        : "Acompanhe seus empréstimos e reservas na biblioteca do GEEF.",
  };
}

export default async function LeitorPage() {
  const locale = await getRequestLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const copy =
    locale === "en"
      ? {
          hello: "Hello",
          lead: "Track your loans and reservations in the library.",
          loansActive: "Active Loans",
          overdue: "Overdue",
          reservations: "Pending Reservations",
          userNotFound: "User not found. Please contact administration.",
          overdueBanner: (count: number) =>
            `You have ${count} overdue book${count === 1 ? "" : "s"}. Please contact the library to return them.`,
          loansTitle: "My Loans",
          dueIn: "Due in",
          day: "day",
          days: "days",
          noLoans: "You don't have any borrowed books right now.",
          visitLibrary: "View schedule",
          reservationsTitle: "My Reservations",
          queue: "Queue position",
          waiting: "ago",
          noReservations: "You don't have pending reservations.",
        }
      : {
          hello: "Olá",
          lead: "Acompanhe seus empréstimos e reservas na biblioteca.",
          loansActive: "Empréstimos Ativos",
          overdue: "Em Atraso",
          reservations: "Reservas Aguardando",
          userNotFound: "Usuário não encontrado. Entre em contato com a administração.",
          overdueBanner: (count: number) =>
            `Você tem ${count} livro${count === 1 ? "" : "s"} com prazo de devolução vencido. Entre em contato com a biblioteca para devolvê-los.`,
          loansTitle: "Meus Empréstimos",
          dueIn: "Devolve em",
          day: "dia",
          days: "dias",
          noLoans: "Você não tem livros emprestados no momento.",
          visitLibrary: "Visitar biblioteca",
          reservationsTitle: "Minhas Reservas",
          queue: "Posição na fila",
          waiting: "aguardando",
          noReservations: "Você não tem reservas pendentes.",
        };

  const area = await getCachedUserArea(user.id);
  const pessoa = area.pessoa;
  const emprestimos = area.emprestimos || [];
  const reservas = area.reservas || [];

  if (!area.usuario) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.8rem",
            color: "#666",
          }}
        >
          <p>{copy.userNotFound}</p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const emprestimosVencidos = emprestimos.filter((e: any) => e.prazo_devolucao < today);
  const emprestimosAtivos = emprestimos.filter((e: any) => e.prazo_devolucao >= today);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem", fontWeight: 700 }}>
          👋 {copy.hello}, {pessoa?.nome}!
        </h1>
        <p style={{ margin: 0, color: "#666" }}>{copy.lead}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "0.8rem",
          }}
        >
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "#999" }}>{copy.loansActive}</p>
          <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>{emprestimosAtivos.length}</p>
        </div>
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "0.8rem",
          }}
        >
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "#999" }}>{copy.overdue}</p>
          <p
            style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: 700,
              color: emprestimosVencidos.length > 0 ? "#ef4444" : "#22c55e",
            }}
          >
            {emprestimosVencidos.length}
          </p>
        </div>
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "0.8rem",
          }}
        >
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "#999" }}>{copy.reservations}</p>
          <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>{reservas.length}</p>
        </div>
      </div>

      {emprestimosVencidos.length > 0 && (
        <div
          style={{
            padding: "1.5rem",
            marginBottom: "2rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "0.8rem",
          }}
        >
          <p style={{ margin: 0, color: "#ef4444", fontWeight: 600 }}>
            ⚠️ {copy.overdueBanner(emprestimosVencidos.length)}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>{copy.loansTitle}</h2>
        {emprestimosAtivos.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {emprestimosAtivos.map((emp: any) => {
              const diasRestantes = Math.ceil(
                (new Date(`${emp.prazo_devolucao}T00:00:00`).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const dayLabel = diasRestantes === 1 ? copy.day : copy.days;

              return (
                <div
                  key={emp.id}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "0.8rem",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "1rem" }}>
                      {emp.exemplares?.obra?.titulo}
                    </p>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#666" }}>
                      {emp.exemplares?.obra?.autor && `${locale === "en" ? "by" : "por"} ${emp.exemplares.obra.autor}`}
                    </p>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#999" }}>
                      {locale === "en" ? "Code" : "Código"}: {emp.exemplares?.codigo}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#999" }}>{copy.dueIn}</p>
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: diasRestantes <= 3 ? "#f97316" : "#22c55e",
                      }}
                    >
                      {diasRestantes} {dayLabel}
                    </p>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "#999" }}>
                      {new Date(`${emp.prazo_devolucao}T00:00:00`).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "0.8rem",
              color: "#999",
            }}
          >
            <p>{copy.noLoans}</p>
            <Link
              href="/escalas"
              style={{
                marginTop: "1rem",
                display: "inline-block",
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {copy.visitLibrary} →
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>{copy.reservationsTitle}</h2>
        {reservas.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {reservas.map((res: any) => {
              const diasEsperando = Math.floor(
                (new Date().getTime() - new Date(res.criado_em).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={res.id}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "0.8rem",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "1rem" }}>
                      {res.obras?.titulo}
                    </p>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#666" }}>
                      {res.obras?.autor && `${locale === "en" ? "by" : "por"} ${res.obras.autor}`}
                    </p>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#999" }}>
                      {locale === "en" ? "Waiting for availability" : "Aguardando disponibilidade"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#999" }}>{copy.queue}</p>
                    <p style={{ margin: "0.25rem 0", fontSize: "1.5rem", fontWeight: 600, color: "#a855f7" }}>
                      #{res.posicao_fila}
                    </p>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "#999" }}>
                      {locale === "en"
                        ? `${diasEsperando} ${diasEsperando === 1 ? "day" : "days"} ${copy.waiting}`
                        : `há ${diasEsperando} dia${diasEsperando !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "0.8rem",
              color: "#999",
            }}
          >
            <p>{copy.noReservations}</p>
          </div>
        )}
      </div>
    </div>
  );
}
