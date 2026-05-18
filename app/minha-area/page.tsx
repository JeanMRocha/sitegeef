import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EnsureUserSystem } from "@/components/ensure-user-system";
import { getCachedUserArea } from "@/lib/areas/user-area";
import { submitTitularRequest } from "./actions";

export const metadata = {
  title: "Minha Área",
};

async function MinhaAreaContent() {
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

  const summaryCards = [
    { label: "Empréstimos ativos", value: emprestimosAtivos.length, note: "Biblioteca" },
    { label: "Reservas", value: reservas.length, note: "Fila de espera" },
    { label: "Movimentos", value: movimentosLivraria.length, note: "Livraria" },
    { label: "Escalas", value: escalas.length, note: "Compromissos" },
    { label: "Serviços", value: voluntariados.length, note: "Voluntariado" },
    { label: "LGPD", value: consentimentos.length, note: "Consentimentos" },
  ];

  return (
    <main className="area-page">
      <EnsureUserSystem />
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="eyebrow">Área do usuário</p>
            <h1 className="area-hero-title">Minha Área</h1>
            <p className="area-subtitle">
              Centralizada para consultar dados pessoais, biblioteca, livraria,
              escalas, voluntariado e consentimentos.
            </p>
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
          {hasAdminAccess && (
            <div className="area-summary-card" style={{ borderColor: "rgba(138, 0, 90, 0.25)" }}>
              <strong>Admin</strong>
              <span>
                Acesso administrativo
                <br />
                Painel liberado
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="area-section">
        <h2 className="area-section-title">Dados pessoais</h2>
        <div className="admin-card">
          {pessoa ? (
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <div className="area-panel-item">
                <strong>Nome</strong>
                <p>{pessoa.nome}</p>
              </div>
              <div className="area-panel-item">
                <strong>Email</strong>
                <p>{user.email}</p>
              </div>
              <div className="area-panel-item">
                <strong>CPF</strong>
                <p>{pessoa.cpf || "Não informado"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Telefone</strong>
                <p>{pessoa.telefone || "Não informado"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Status</strong>
                <p>{pessoa.status}</p>
              </div>
              <div className="area-panel-item">
                <strong>Perfil</strong>
                <p>{usuario?.perfil || siteRole || "Público"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Regra</strong>
                <p>{hasAdminAccess ? "Administrador" : "Usuário público"}</p>
              </div>
            </div>
          ) : (
            <div className="area-empty">Dados pessoais não encontrados</div>
          )}
        </div>
      </section>

      <section className="area-section">
        <h2 className="area-section-title">Privacidade</h2>
        <div className="admin-card">
          <div className="area-panel-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="area-panel-item">
              <strong>O que você pode pedir</strong>
              <p>Acesso, correção, revogação de consentimento e informação sobre uso.</p>
            </div>
            <div className="area-panel-item">
              <strong>Como tratar</strong>
              <p>Use a página de privacidade ou fale com a casa pelo canal oficial.</p>
            </div>
            <div className="area-panel-item">
              <strong>Onde ver</strong>
              <p>
                <a href="/privacidade">Ler política de privacidade</a> · <a href="/lgpd">Mais detalhes</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="area-section">
        <h2 className="area-section-title">Pedido do titular</h2>
        <div className="admin-card">
          <p style={{ marginTop: 0, color: "var(--muted)", lineHeight: 1.6 }}>
            Se quiser revisar, corrigir ou pedir revogação, envie um pedido curto por aqui. O registro vai para a equipe responsável.
          </p>
          <form action={submitTitularRequest} className="area-panel-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <label className="profile-form-field">
              <span>Tipo do pedido</span>
              <select name="request_type" className="profile-form-input" defaultValue="revogacao">
                <option value="acesso">Acesso aos dados</option>
                <option value="correcao">Correção de dados</option>
                <option value="revogacao">Revogação de consentimento</option>
                <option value="eliminacao">Eliminação quando cabível</option>
              </select>
            </label>

            <label className="profile-form-field" style={{ gridColumn: "1 / -1" }}>
              <span>Detalhe opcional</span>
              <textarea
                name="details"
                className="profile-form-input"
                rows={4}
                placeholder="Se quiser, explique de forma breve o pedido."
              />
            </label>

            <div className="area-panel-item" style={{ alignSelf: "end" }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Enviar pedido
              </button>
            </div>
          </form>
        </div>
      </section>

      {pedidosTitular.length > 0 && (
        <section className="area-section">
          <h2 className="area-section-title">Pedidos recentes</h2>
          <div className="admin-card">
            <div className="area-panel-grid">
              {pedidosTitular.map((pedido: any) => (
                <div key={pedido.id} className="area-panel-item">
                  <strong>
                    {pedido.request_type === "acesso"
                      ? "Acesso aos dados"
                      : pedido.request_type === "correcao"
                        ? "Correção de dados"
                        : pedido.request_type === "revogacao"
                          ? "Revogação"
                          : "Eliminação"}
                  </strong>
                  <p style={{ marginBottom: '0.25rem' }}>
                    {pedido.status}
                    {pedido.resolvido_em ? ` · concluído em ${new Date(pedido.resolvido_em).toLocaleDateString("pt-BR")}` : ""}
                  </p>
                  <p style={{ color: "var(--muted)" }}>
                    {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {usuario?.pode_biblioteca && (
        <section className="area-section">
          <h2 className="area-section-title">Biblioteca</h2>
          <div className="admin-card">
            {emprestimosVencidos.length > 0 && (
              <div className="area-panel-item" style={{ marginBottom: "1rem", background: "rgba(239, 68, 68, 0.05)" }}>
                <strong className="inline-status inline-status-danger">Empréstimos vencidos ({emprestimosVencidos.length})</strong>
                <div className="area-panel-grid" style={{ marginTop: "0.85rem" }}>
                  {emprestimosVencidos.map((e: any) => (
                    <div key={e.id} className="area-panel-item">
                      <strong>{e.exemplares?.obra?.titulo}</strong>
                      <p>Vence em {e.prazo_devolucao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {emprestimosAtivos.length > 0 && (
              <div className="area-panel-grid" style={{ marginBottom: "1rem" }}>
                <strong className="area-section-title" style={{ fontSize: "1rem" }}>Empréstimos ativos ({emprestimosAtivos.length})</strong>
                {emprestimosAtivos.map((e: any) => (
                  <div key={e.id} className="area-panel-item">
                    <strong>{e.exemplares?.obra?.titulo}</strong>
                    <p>Devolve em {e.prazo_devolucao}</p>
                  </div>
                ))}
              </div>
            )}

            {reservas.length > 0 && (
              <div className="area-panel-grid">
                <strong className="area-section-title" style={{ fontSize: "1rem" }}>Reservas ({reservas.length})</strong>
                {reservas.map((r: any) => (
                  <div key={r.id} className="area-panel-item">
                    <strong>{r.obras?.titulo}</strong>
                    <p>Posição na fila: {r.posicao_fila}</p>
                  </div>
                ))}
              </div>
            )}

            {emprestimos.length === 0 && reservas.length === 0 && (
              <div className="area-empty">Nenhum empréstimo ou reserva ativo</div>
            )}
          </div>
        </section>
      )}

      {usuario?.pode_livraria && movimentosLivraria.length > 0 && (
        <section className="area-section">
          <h2 className="area-section-title">Livraria</h2>
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
        <section className="area-section">
          <h2 className="area-section-title">Escalas</h2>
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
        <section className="area-section">
          <h2 className="area-section-title">Voluntariado</h2>
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
        <section className="area-section">
          <h2 className="area-section-title">Consentimentos LGPD</h2>
          <div className="admin-card">
            <div className="area-panel-grid">
              {consentimentos.map((c: any) => (
                <div key={c.id} className="area-panel-item">
                  <strong>{c.finalidade}</strong>
                  <p>Consentido em {new Date(c.data_consentimento).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}

export default MinhaAreaContent;
