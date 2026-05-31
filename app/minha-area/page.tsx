import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EnsureUserSystem } from "@/components/ensure-user-system";
import { LgpdRequestModal } from "@/components/lgpd/lgpd-request-modal";
import { getCachedUserArea } from "@/lib/areas/user-area";
import { getRequestLocale } from "@/lib/multilingual/server";
import { createClient } from "@/lib/supabase/server";
import { submitTitularRequest } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "en" ? "My Area | GEEF" : "Minha Área",
  };
}

async function MinhaAreaContent() {
  const locale = await getRequestLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/minha-area");
  }

  const { usuario, pessoa, siteRole, hasAdminAccess, emprestimos, reservas, movimentosLivraria, escalas, voluntariados, consentimentos, pedidosTitular } =
    await getCachedUserArea(user.id);

  const today = new Date().toISOString().split("T")[0];
  const emprestimosVencidos = emprestimos.filter((e: any) => e.prazo_devolucao < today);
  const emprestimosAtivos = emprestimos.filter((e: any) => e.prazo_devolucao >= today);
  const copy =
    locale === "en"
      ? {
          eyebrow: "User area",
          title: "My Area",
          subtitle:
            "Centralized access to personal data, library, books, schedules, volunteering and consents.",
          summary: [
            ["Active loans", "Library"],
            ["Reservations", "Waiting list"],
            ["Movements", "Bookshop"],
            ["Schedules", "Appointments"],
            ["Services", "Volunteering"],
            ["LGPD", "Consents"],
          ],
          personalData: "Personal data",
          privacy: "Privacy",
          rights: "Access, correction, consent revocation and information on use.",
          process: "Use the privacy page or contact the house through the official channel.",
          policy: "Read privacy policy",
          details: "More details",
          download: "Export my data",
          requestTitle: "Data subject request",
          requestLead:
            "If you want to review, correct or request revocation, send a short request here. The record goes to the responsible team.",
          requestType: "Request type",
          requestTypes: {
            acesso: "Access to data",
            correcao: "Correct data",
            revogacao: "Consent revocation",
            eliminacao: "Deletion when applicable",
          },
          detailsLabel: "Optional details",
          detailsPlaceholder: "If you want, briefly explain your request.",
          send: "Send request",
          recent: "Recent requests",
          lib: "Library",
          overdue: "Overdue loans",
          activeLoans: "Active loans",
          dueIn: "Due in",
          returnsIn: "Returns in",
          queue: "Queue position",
          noActive: "No active loan or reservation",
          movements: "Bookshop",
          schedules: "Schedules",
          volunteering: "Volunteering",
          consents: "LGPD consents",
          consented: "Consented on",
          noPersonalData: "No personal data available",
          roleAdmin: "Administrator",
          rolePublic: "Public user",
        }
      : {
          eyebrow: "Área do usuário",
          title: "Minha Área",
          subtitle:
            "Centralizada para consultar dados pessoais, biblioteca, livraria, escalas, voluntariado e consentimentos.",
          summary: [
            ["Empréstimos ativos", "Biblioteca"],
            ["Reservas", "Fila de espera"],
            ["Movimentos", "Livraria"],
            ["Escalas", "Compromissos"],
            ["Serviços", "Voluntariado"],
            ["LGPD", "Consentimentos"],
          ],
          personalData: "Dados pessoais",
          privacy: "Privacidade",
          rights: "Acesso, correção, revogação de consentimento e informação sobre uso.",
          process: "Use a página de privacidade ou fale com a casa pelo canal oficial.",
          policy: "Ler política de privacidade",
          details: "Mais detalhes",
          download: "Exportar meus dados",
          requestTitle: "Pedido do titular",
          requestLead:
            "Se quiser revisar, corrigir ou pedir revogação, envie um pedido curto por aqui. O registro vai para a equipe responsável.",
          requestType: "Tipo do pedido",
          requestTypes: {
            acesso: "Acesso aos dados",
            correcao: "Correção de dados",
            revogacao: "Revogação de consentimento",
            eliminacao: "Eliminação quando cabível",
          },
          detailsLabel: "Detalhe opcional",
          detailsPlaceholder: "Se quiser, explique de forma breve o pedido.",
          send: "Enviar pedido",
          recent: "Pedidos recentes",
          lib: "Biblioteca",
          overdue: "Empréstimos vencidos",
          activeLoans: "Empréstimos ativos",
          dueIn: "Devolve em",
          returnsIn: "Vence em",
          queue: "Posição na fila",
          noActive: "Nenhum empréstimo ou reserva ativo",
          movements: "Livraria",
          schedules: "Escalas",
          volunteering: "Voluntariado",
          consents: "Consentimentos LGPD",
          consented: "Consentido em",
          noPersonalData: "Nenhum dado pessoal disponível",
          roleAdmin: "Administrador",
          rolePublic: "Usuário público",
        };

  const summaryCards = [
    { label: copy.summary[0][0], value: emprestimosAtivos.length, note: copy.summary[0][1] },
    { label: copy.summary[1][0], value: reservas.length, note: copy.summary[1][1] },
    { label: copy.summary[2][0], value: movimentosLivraria.length, note: copy.summary[2][1] },
    { label: copy.summary[3][0], value: escalas.length, note: copy.summary[3][1] },
    { label: copy.summary[4][0], value: voluntariados.length, note: copy.summary[4][1] },
    { label: copy.summary[5][0], value: consentimentos.length, note: copy.summary[5][1] },
  ];

  const menuItems = [
    { href: "#resumo", label: locale === "en" ? "Overview" : "Resumo", note: copy.title },
    pessoa ? { href: "#dados-pessoais", label: copy.personalData, note: locale === "en" ? "Personal data" : "Cadastro" } : null,
    { href: "#privacidade", label: copy.privacy, note: locale === "en" ? "LGPD" : "Direitos" },
    { href: "#pedido-titular", label: copy.requestTitle, note: locale === "en" ? "Privacy request" : "Solicitações" },
    pedidosTitular.length > 0 ? { href: "#pedidos-recentes", label: copy.recent, note: `${pedidosTitular.length} ${locale === "en" ? "items" : "registros"}` } : null,
    usuario?.pode_biblioteca ? { href: "#biblioteca", label: copy.lib, note: locale === "en" ? "Library access" : "Acervo" } : null,
    usuario?.pode_livraria && movimentosLivraria.length > 0 ? { href: "#livraria", label: copy.movements, note: `${movimentosLivraria.length} ${locale === "en" ? "records" : "registros"}` } : null,
    usuario?.pode_escalas && escalas.length > 0 ? { href: "#escalas", label: copy.schedules, note: `${escalas.length} ${locale === "en" ? "items" : "compromissos"}` } : null,
    voluntariados.length > 0 ? { href: "#voluntariado", label: copy.volunteering, note: `${voluntariados.length} ${locale === "en" ? "items" : "serviços"}` } : null,
    consentimentos.length > 0 ? { href: "#consentimentos", label: copy.consents, note: `${consentimentos.length} ${locale === "en" ? "items" : "consentimentos"}` } : null,
  ].filter(Boolean) as { href: string; label: string; note: string }[];

  return (
    <main className="area-page">
      <EnsureUserSystem />
      <section className="area-hero" id="resumo">
        <div className="area-hero-top">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="area-hero-title">{copy.title}</h1>
            <p className="area-subtitle">{copy.subtitle}</p>
          </div>
        </div>

        <div className="area-summary-grid">
          {summaryCards.map((item) => (
            <div key={item.label} className="area-summary-card">
              <strong>{item.value}</strong>
              <span>
                {item.label}
                <br />
                {item.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="area-body">
        <aside className="area-menu" aria-label={locale === "en" ? "Area menu" : "Menu da área"}>
          <div className="area-menu-card">
            <span className="area-menu-kicker">{locale === "en" ? "Quick menu" : "Menu rápido"}</span>
            <h2>{locale === "en" ? "Sections" : "Seções"}</h2>
            <nav className="area-menu-nav">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className="area-menu-link">
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="area-content">
          {pessoa && (
            <section className="area-section" id="dados-pessoais">
              <h2 className="area-section-title">{copy.personalData}</h2>
              <div className="admin-card">
                <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <div className="area-panel-item">
                    <strong>{locale === "en" ? "Name" : "Nome"}</strong>
                    <p>{pessoa.nome}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>Email</strong>
                    <p>{user.email}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>CPF</strong>
                    <p>{pessoa.cpf || (locale === "en" ? "Not informed" : "Não informado")}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>{locale === "en" ? "Phone" : "Telefone"}</strong>
                    <p>{pessoa.telefone || (locale === "en" ? "Not informed" : "Não informado")}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>{locale === "en" ? "Status" : "Status"}</strong>
                    <p>{pessoa.status}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>{locale === "en" ? "Profile" : "Perfil"}</strong>
                    <p>{usuario?.perfil || siteRole || (locale === "en" ? "Public" : "Público")}</p>
                  </div>
                  <div className="area-panel-item">
                    <strong>{locale === "en" ? "Role" : "Regra"}</strong>
                    <p>{hasAdminAccess ? copy.roleAdmin : copy.rolePublic}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="area-section" id="privacidade">
            <h2 className="area-section-title">{copy.privacy}</h2>
            <div className="admin-card">
              <div className="area-panel-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <div className="area-panel-item">
                  <strong>{locale === "en" ? "What you can request" : "O que você pode pedir"}</strong>
                  <p>{copy.rights}</p>
                </div>
                <div className="area-panel-item">
                  <strong>{locale === "en" ? "How to proceed" : "Como tratar"}</strong>
                  <p>{copy.process}</p>
                </div>
                <div className="area-panel-item">
                  <strong>{locale === "en" ? "Where to read" : "Onde ver"}</strong>
                  <p>
                    <Link href="/privacidade">{copy.policy}</Link> · <Link href="/lgpd">{copy.details}</Link>
                  </p>
                </div>
                <div className="area-panel-item">
                  <strong>{locale === "en" ? "Download data" : "Baixar dados"}</strong>
                  <p>
                    <Link href="/api/lgpd/export">{copy.download}</Link>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="area-section" id="pedido-titular">
            <h2 className="area-section-title">{copy.requestTitle}</h2>
            <div className="admin-card">
              <p className="area-section-lead">
                {copy.requestLead}
              </p>
              <LgpdRequestModal
                title={copy.requestTitle}
                lead={copy.requestLead}
                requestTypeLabel={copy.requestType}
                detailsLabel={copy.detailsLabel}
                detailsPlaceholder={copy.detailsPlaceholder}
                sendLabel={copy.send}
                openLabel={locale === "en" ? "Open request menu" : "Abrir pedido"}
                closeLabel={locale === "en" ? "Close" : "Fechar"}
                action={submitTitularRequest}
                requestTypes={[
                  { value: "acesso", label: copy.requestTypes.acesso },
                  { value: "correcao", label: copy.requestTypes.correcao },
                  { value: "revogacao", label: copy.requestTypes.revogacao },
                  { value: "eliminacao", label: copy.requestTypes.eliminacao },
                ]}
              />
            </div>
          </section>

          {pedidosTitular.length > 0 && (
            <section className="area-section" id="pedidos-recentes">
              <h2 className="area-section-title">{copy.recent}</h2>
              <div className="admin-card">
                <div className="area-panel-grid">
                  {pedidosTitular.map((pedido: any) => (
                    <div key={pedido.id} className="area-panel-item">
                      <strong>
                        {pedido.request_type === "acesso"
                          ? copy.requestTypes.acesso
                          : pedido.request_type === "correcao"
                            ? copy.requestTypes.correcao
                            : pedido.request_type === "revogacao"
                              ? copy.requestTypes.revogacao
                              : copy.requestTypes.eliminacao}
                      </strong>
                      <p style={{ marginBottom: '0.25rem' }}>
                        {pedido.status}
                        {pedido.resolvido_em
                          ? ` · ${locale === "en" ? "completed on" : "concluído em"} ${new Date(pedido.resolvido_em).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")}`
                          : ""}
                      </p>
                      <p style={{ color: "var(--muted)" }}>
                        {new Date(pedido.created_at).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {usuario?.pode_biblioteca && (
            <section className="area-section" id="biblioteca">
              <h2 className="area-section-title">{copy.lib}</h2>
              <div className="admin-card">
                {emprestimosVencidos.length > 0 && (
                  <div className="area-panel-item area-panel-error" style={{ marginBottom: "1rem" }}>
                    <strong className="inline-status inline-status-danger">
                      {locale === "en"
                        ? `Overdue loans (${emprestimosVencidos.length})`
                        : `Empréstimos vencidos (${emprestimosVencidos.length})`}
                    </strong>
                    <div className="area-panel-grid area-panel-grid--mt">
                      {emprestimosVencidos.map((e: any) => (
                        <div key={e.id} className="area-panel-item">
                          <strong>{e.exemplares?.obra?.titulo}</strong>
                          <p>{copy.returnsIn} {e.prazo_devolucao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {emprestimosAtivos.length > 0 && (
                  <div className="area-panel-grid area-panel-grid--mb">
                    <strong className="area-section-title area-section-title--sm">
                      {locale === "en"
                        ? `Active loans (${emprestimosAtivos.length})`
                        : `Empréstimos ativos (${emprestimosAtivos.length})`}
                    </strong>
                    {emprestimosAtivos.map((e: any) => (
                      <div key={e.id} className="area-panel-item">
                        <strong>{e.exemplares?.obra?.titulo}</strong>
                        <p>{copy.dueIn} {e.prazo_devolucao}</p>
                      </div>
                    ))}
                  </div>
                )}

                {reservas.length > 0 && (
                  <div className="area-panel-grid">
                    <strong className="area-section-title area-section-title--sm">
                      {locale === "en" ? `Reservations (${reservas.length})` : `Reservas (${reservas.length})`}
                    </strong>
                    {reservas.map((r: any) => (
                      <div key={r.id} className="area-panel-item">
                        <strong>{r.obras?.titulo}</strong>
                        <p>{copy.queue}: {r.posicao_fila}</p>
                      </div>
                    ))}
                  </div>
                )}

                {emprestimos.length === 0 && reservas.length === 0 && (
                  <div className="area-empty">{copy.noActive}</div>
                )}
              </div>
            </section>
          )}

          {usuario?.pode_livraria && movimentosLivraria.length > 0 && (
            <section className="area-section" id="livraria">
              <h2 className="area-section-title">{copy.movements}</h2>
              <div className="admin-card">
                <div className="area-panel-grid">
                  {movimentosLivraria.map((m: any) => (
                    <div key={m.id} className="area-panel-item">
                      <strong>{m.produtos_livraria?.titulo}</strong>
                      <p>
                        {m.tipo} · {new Date(m.criado_em).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {usuario?.pode_escalas && escalas.length > 0 && (
            <section className="area-section" id="escalas">
              <h2 className="area-section-title">{copy.schedules}</h2>
              <div className="admin-card">
                <div className="area-panel-grid">
                  {escalas.map((e: any) => (
                    <div key={e.id} className="area-panel-item">
                      <strong>{e.funcoes?.nome}</strong>
                      <p>{e.reunioes?.data}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {voluntariados.length > 0 && (
            <section className="area-section" id="voluntariado">
              <h2 className="area-section-title">{copy.volunteering}</h2>
              <div className="admin-card">
                <div className="area-panel-grid">
                  {voluntariados.map((v: any) => (
                    <div key={v.id} className="area-panel-item">
                      <strong>{v.servico}</strong>
                      <p>{v.horarios}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {consentimentos.length > 0 && (
            <section className="area-section" id="consentimentos">
              <h2 className="area-section-title">{copy.consents}</h2>
              <div className="admin-card">
                <div className="area-panel-grid">
                  {consentimentos.map((c: any) => (
                    <div key={c.id} className="area-panel-item">
                      <strong>{c.finalidade}</strong>
                      <p>
                        {copy.consented} {new Date(c.data_consentimento).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

    </main>
  );
}

export default MinhaAreaContent;
