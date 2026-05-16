import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EnsureUserSystem } from "@/components/ensure-user-system";

export const metadata = {
  title: "Minha Área",
};

async function MinhaAreaContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/minha-area");
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: usuario } = await supabase
    .from("usuarios_sistema")
    .select("*")
    .eq("id", user.id)
    .single();

  const pessoaId = usuario?.pessoa_id;

  let pessoa: any = null;
  let emprestimos: any[] = [];
  let reservas: any[] = [];
  let movimentosLivraria: any[] = [];
  let escalas: any[] = [];
  let voluntariados: any[] = [];
  let consentimentos: any[] = [];

  if (pessoaId) {
    const { data } = await supabase
      .from("pessoas")
      .select("*")
      .eq("id", pessoaId)
      .single();
    pessoa = data;

    if (usuario?.pode_biblioteca) {
      const { data: emps } = await supabase
        .from("emprestimos")
        .select(`
          id, data_retirada, prazo_devolucao, status,
          exemplares (codigo, obra:obras (titulo, autor))
        `)
        .eq("pessoa_id", pessoaId)
        .eq("status", "em_aberto")
        .order("prazo_devolucao", { ascending: true });
      emprestimos = emps || [];

      const { data: reservas_data } = await supabase
        .from("reservas")
        .select(`
          id, posicao_fila, criado_em,
          obras (titulo, autor)
        `)
        .eq("pessoa_id", pessoaId)
        .eq("status", "aguardando")
        .order("posicao_fila", { ascending: true });
      reservas = reservas_data || [];
    }

    if (usuario?.pode_livraria) {
      const { data: movs } = await supabase
        .from("movimentos_livraria")
        .select(`
          id, tipo, quantidade, valor_total, criado_em,
          produtos_livraria (titulo, autor)
        `)
        .eq("pessoa_id", pessoaId)
        .order("criado_em", { ascending: false })
        .limit(10);
      movimentosLivraria = movs || [];
    }

    if (usuario?.pode_escalas) {
      const { data: esc } = await supabase
        .from("escala_funcoes")
        .select(`
          id, observacao,
          reunioes (data, escala:escalas_mensais (mes, ano)),
          funcoes (nome)
        `)
        .eq("pessoa_id", pessoaId)
        .order("reunioes(data)", { ascending: false })
        .limit(10);
      escalas = esc || [];
    }

    const { data: voluntarios } = await supabase
      .from("servicos_voluntarios")
      .select("*")
      .eq("pessoa_id", pessoaId)
      .eq("status", "ativo");
    voluntariados = voluntarios || [];

    const { data: consent } = await supabase
      .from("consentimentos_lgpd")
      .select("*")
      .eq("pessoa_id", pessoaId)
      .eq("status", "ativo");
    consentimentos = consent || [];
  }

  const today = new Date().toISOString().split("T")[0];
  const emprestimosVencidos = emprestimos.filter((e: any) => e.prazo_devolucao < today);
  const emprestimosAtivos = emprestimos.filter((e: any) => e.prazo_devolucao >= today);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}>
      <EnsureUserSystem />
      <h1 style={{ margin: "0 0 2rem", fontSize: "2rem", fontWeight: 700 }}>
        👤 Minha Área
      </h1>

      {/* Dados Pessoais */}
      <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>Dados Pessoais</h2>
        {pessoa ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.95rem" }}>
            <div>
              <span style={{ color: "#666" }}>Nome:</span> {pessoa.nome}
            </div>
            <div>
              <span style={{ color: "#666" }}>Email:</span> {user.email}
            </div>
            <div>
              <span style={{ color: "#666" }}>CPF:</span> {pessoa.cpf || "Não informado"}
            </div>
            <div>
              <span style={{ color: "#666" }}>Telefone:</span> {pessoa.telefone || "Não informado"}
            </div>
            <div>
              <span style={{ color: "#666" }}>Status:</span> {pessoa.status}
            </div>
            <div>
              <span style={{ color: "#666" }}>Perfil:</span> {usuario?.perfil || "Público"}
            </div>
          </div>
        ) : (
          <p style={{ color: "#999" }}>Dados pessoais não encontrados</p>
        )}
      </section>

      {/* Biblioteca */}
      {usuario?.pode_biblioteca && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>📚 Biblioteca</h2>

          {emprestimosVencidos.length > 0 && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "0.5rem", border: "1px solid #fca5a5" }}>
              <h3 style={{ margin: "0 0 0.5rem", color: "#b91c1c", fontSize: "1rem" }}>⚠️ Empréstimos Vencidos ({emprestimosVencidos.length})</h3>
              {emprestimosVencidos.map((e: any) => (
                <div key={e.id} style={{ marginBottom: "0.5rem", color: "#991b1b", fontSize: "0.9rem" }}>
                  {e.exemplares?.obra?.titulo} - Vence em {e.prazo_devolucao}
                </div>
              ))}
            </div>
          )}

          {emprestimosAtivos.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#333" }}>Empréstimos Ativos ({emprestimosAtivos.length})</h3>
              {emprestimosAtivos.map((e: any) => (
                <div key={e.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
                  {e.exemplares?.obra?.titulo} - Devolve em {e.prazo_devolucao}
                </div>
              ))}
            </div>
          )}

          {reservas.length > 0 && (
            <div>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#333" }}>Reservas ({reservas.length})</h3>
              {reservas.map((r: any) => (
                <div key={r.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
                  {r.obras?.titulo} - Posição na fila: {r.posicao_fila}
                </div>
              ))}
            </div>
          )}

          {emprestimos.length === 0 && reservas.length === 0 && (
            <p style={{ color: "#999", margin: 0 }}>Nenhum empréstimo ou reserva ativo</p>
          )}
        </section>
      )}

      {/* Livraria */}
      {usuario?.pode_livraria && movimentosLivraria.length > 0 && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>🛒 Livraria</h2>
          {movimentosLivraria.map((m: any) => (
            <div key={m.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
              {m.produtos_livraria?.titulo} ({m.tipo}) - {new Date(m.criado_em).toLocaleDateString("pt-BR")}
            </div>
          ))}
        </section>
      )}

      {/* Escalas */}
      {usuario?.pode_escalas && escalas.length > 0 && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>📅 Escalas</h2>
          {escalas.map((e: any) => (
            <div key={e.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
              {e.funcoes?.nome} - {e.reunioes?.data}
            </div>
          ))}
        </section>
      )}

      {/* Voluntariado */}
      {voluntariados.length > 0 && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>🤝 Voluntariado</h2>
          {voluntariados.map((v: any) => (
            <div key={v.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
              {v.servico} - {v.horarios}
            </div>
          ))}
        </section>
      )}

      {/* LGPD */}
      {consentimentos.length > 0 && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0.8rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.3rem", fontWeight: 600 }}>🔒 Consentimentos LGPD</h2>
          {consentimentos.map((c: any) => (
            <div key={c.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.4rem", fontSize: "0.9rem" }}>
              {c.finalidade} - Consentido em {new Date(c.data_consentimento).toLocaleDateString("pt-BR")}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default MinhaAreaContent;
