import Link from "next/link";
import { getInstituicao, getEnderecos, getContatos, getContasBancarias } from "./actions";
import { Suspense } from "react";
import { contentPages, site } from "@/lib/site-data";

export const metadata = {
  title: "Instituição - Admin GEEF",
};

const QUEM_SOMOS = contentPages["quem-somos"];

const FALLBACK_INSTITUICAO = {
  nome_oficial: site.name,
  nome_curto: site.shortName,
  cnpj: undefined as string | undefined,
  data_fundacao: undefined as string | undefined,
  descricao: QUEM_SOMOS?.intro,
  missao: QUEM_SOMOS?.sections.find((section) => section.heading === "Nossa missão")?.text,
};

function formatCnpj(value: string | undefined) {
  const digits = value?.replace(/\D/g, '') || '';
  if (digits.length !== 14) {
    return value || "—";
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

async function InstituicaoContent() {
  const instituicao = await getInstituicao();
  const enderecos = await getEnderecos();
  const contatos = await getContatos();
  const contas = await getContasBancarias();

  const endereco = enderecos[0];
  const instituicaoBase = instituicao ?? FALLBACK_INSTITUICAO;

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Instituição</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {!instituicao ? <span className="inline-status inline-status-warning">Base do site</span> : null}
            <Link href="/admin/instituicao/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <div className="area-section-title">
            <h2>Dados básicos</h2>
          </div>
          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="area-panel-item">
              <strong>Nome oficial</strong>
              <p>{instituicaoBase.nome_oficial}</p>
            </div>
            <div className="area-panel-item">
              <strong>Nome curto</strong>
              <p>{instituicaoBase.nome_curto || "—"}</p>
            </div>
                <div className="area-panel-item">
                  <strong>CNPJ</strong>
                  <p>{formatCnpj(instituicaoBase.cnpj)}</p>
                </div>
            <div className="area-panel-item">
              <strong>Data de fundação</strong>
              <p>{instituicaoBase.data_fundacao ? new Date(instituicaoBase.data_fundacao).toLocaleDateString("pt-BR") : "—"}</p>
            </div>
          </div>

          {instituicaoBase.missao ? (
            <div className="area-panel-item" style={{ marginTop: "1rem" }}>
              <strong>Missão</strong>
              <p>{instituicaoBase.missao}</p>
            </div>
          ) : null}
        </div>
      </section>

      {endereco ? (
        <section className="area-section">
          <div className="table-surface">
            <div className="area-section-title">
              <h2>Endereço</h2>
            </div>
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="area-panel-item">
                <strong>Logradouro</strong>
                <p>{endereco.logradouro ? `${endereco.logradouro}, ${endereco.numero}` : "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Bairro</strong>
                <p>{endereco.bairro || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>CEP</strong>
                <p>{endereco.cep || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Cidade</strong>
                <p>{endereco.cidade || "—"}</p>
              </div>
              <div className="area-panel-item">
                <strong>Estado</strong>
                <p>{endereco.estado || "—"}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="area-section">
        <div className="table-surface">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>Contatos</h2>
                <Link href="/admin/instituicao/editar?tab=contatos" className="profile-form-btn profile-form-btn-secondary">
                  Adicionar
                </Link>
              </div>

          {contatos.length === 0 ? (
            <div className="area-empty">Nenhum contato registrado.</div>
          ) : (
            <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {contatos.map((contato: any) => (
                <div key={contato.id} className="area-panel-item">
                  <strong>{contato.tipo || "Contato"}</strong>
                  <p>
                    {contato.telefone && <>☎️ {contato.telefone}<br /></>}
                    {contato.whatsapp && <>💬 {contato.whatsapp}<br /></>}
                    {contato.email && <>📧 {contato.email}<br /></>}
                    {contato.instagram && <>📸 {contato.instagram}</>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>Contas bancárias e PIX</h2>
                <Link href="/admin/instituicao/editar?tab=contas" className="profile-form-btn profile-form-btn-secondary">
                  Adicionar
                </Link>
              </div>

          {contas.length === 0 ? (
            <div className="area-empty">Nenhuma conta registrada.</div>
          ) : (
            <div className="table-surface">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Banco</th>
                    <th>Conta</th>
                    <th>Finalidade</th>
                    <th>PIX</th>
                    <th>Visibilidade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((conta: any) => (
                    <tr key={conta.id}>
                      <td style={{ fontWeight: 600 }}>{conta.banco || "—"}</td>
                      <td style={{ fontSize: "0.9rem" }}>
                        {conta.agencia ? `${conta.agencia} / ${conta.conta}` : "—"}
                      </td>
                      <td style={{ fontSize: "0.9rem" }}>{conta.finalidade || "—"}</td>
                      <td style={{ fontSize: "0.9rem" }}>{conta.chave_pix ? "✅" : "—"}</td>
                      <td style={{ fontSize: "0.9rem" }}>
                        {conta.visibilidade === "publica" ? "🌐 Pública" : "🔒 Privada"}
                      </td>
                      <td>
                        <span className={conta.ativo ? "inline-status inline-status-success" : "inline-status inline-status-danger"}>
                          {conta.ativo ? "Ativa" : "Inativa"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function InstituicaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <InstituicaoContent />
    </Suspense>
  );
}
