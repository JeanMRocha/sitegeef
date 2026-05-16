import Link from "next/link";
import { getInstituicao, getEnderecos, getContatos, getContasBancarias } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Instituição - Admin GEEF",
};

async function InstituicaoContent() {
  const instituicao = await getInstituicao();
  const enderecos = await getEnderecos();
  const contatos = await getContatos();
  const contas = await getContasBancarias();

  const endereco = enderecos[0];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Instituição</h1>
          </div>
          {instituicao && (
            <Link href="/admin/instituicao/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          )}
        </div>
        <p className="area-subtitle">Dados oficiais do GEEF.</p>
      </section>

      {!instituicao ? (
        <section className="area-section">
          <div className="area-empty">
            <p>Nenhum dado institucional registrado.</p>
            <Link href="/admin/instituicao/editar" className="profile-form-btn profile-form-btn-primary">Cadastrar dados institucionais</Link>
          </div>
        </section>
      ) : (
        <>
          <section className="area-section">
            <div className="table-surface">
              <div className="area-section-title">
                <h2>Dados básicos</h2>
                <p>Identificação institucional.</p>
              </div>
              <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <div className="area-panel-item">
                  <strong>Nome oficial</strong>
                  <p>{instituicao.nome_oficial}</p>
                </div>
                <div className="area-panel-item">
                  <strong>Nome curto</strong>
                  <p>{instituicao.nome_curto || "—"}</p>
                </div>
                <div className="area-panel-item">
                  <strong>CNPJ</strong>
                  <p>{instituicao.cnpj || "—"}</p>
                </div>
                <div className="area-panel-item">
                  <strong>Data de fundação</strong>
                  <p>
                    {instituicao.data_fundacao
                      ? new Date(instituicao.data_fundacao).toLocaleDateString("pt-BR")
                      : "—"}
                  </p>
                </div>
              </div>

              {instituicao.missao && (
                <div className="area-panel-item" style={{ marginTop: "1rem" }}>
                  <strong>Missão</strong>
                  <p>{instituicao.missao}</p>
                </div>
              )}
            </div>
          </section>

          {endereco && (
            <section className="area-section">
              <div className="table-surface">
                <div className="area-section-title">
                  <h2>Endereço</h2>
                  <p>Localização e referência geográfica.</p>
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

                {endereco.maps_link && (
                  <div style={{ marginTop: "1rem" }}>
                    <a
                      href={endereco.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-form-btn profile-form-btn-secondary"
                    >
                      Ver no Google Maps
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="area-section">
            <div className="table-surface">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>Contatos</h2>
                <Link href="/admin/instituicao/contatos" className="profile-form-btn profile-form-btn-secondary">
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
                <Link href="/admin/instituicao/contas" className="profile-form-btn profile-form-btn-secondary">
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
        </>
      )}
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
