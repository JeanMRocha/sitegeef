import Link from "next/link";
import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import {
  createMusicaSessaoAction,
  saveMusicaSessaoAction,
} from "../actions";
import { getMusicasResumo, listMusicaSessoes } from "@/lib/musicas";

export const metadata = {
  title: "Sessões de pareamento - Admin GEEF",
};

type PageProps = {
  searchParams?: Promise<{ codigo?: string }>;
};

async function SessoesContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedCodigo = typeof params.codigo === "string" ? params.codigo.toUpperCase() : "";

  const [sessoes, musicasResumo] = await Promise.all([listMusicaSessoes(), getMusicasResumo()]);

  const currentSession = selectedCodigo ? sessoes.find((sessao) => sessao.codigo_pareamento === selectedCodigo) ?? null : null;
  const selectedSongId = currentSession?.musica_id ?? "";

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Músicas</span>
          <h1 className="admin-page-title">Sessões de pareamento</h1>
        </div>
        <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary">
          Voltar
        </Link>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Sessões criadas</span>
            <strong>{sessoes.length}</strong>
          </div>
          <div className="stat-card">
            <span>Ativas</span>
            <strong>{sessoes.filter((s) => s.ativo).length}</strong>
          </div>
          <div className="stat-card">
            <span>Modo exibição</span>
            <strong>{sessoes.filter((s) => s.modo === "exibicao").length}</strong>
          </div>
          <div className="stat-card">
            <span>Modo catálogo</span>
            <strong>{sessoes.filter((s) => s.modo === "catalogo").length}</strong>
          </div>
        </div>
      </section>

      <section className="area-section admin-grid-two">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Nova sessão</h2>
            <p>Crie uma tela de exibição pareada ou cole um código existente para editar.</p>
          </div>

          <form action={saveMusicaSessaoAction} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gap: "1rem" }}>
              <label className="profile-form-field">
                <span>Código de pareamento</span>
                <input
                  className="profile-form-input"
                  name="codigo_pareamento"
                  defaultValue={currentSession?.codigo_pareamento ?? selectedCodigo}
                  placeholder="Ex.: A7K3P9 (ou deixe em branco para gerar)"
                />
              </label>

              <label className="profile-form-field">
                <span>Nome da tela</span>
                <input
                  className="profile-form-input"
                  name="nome_tela"
                  defaultValue={currentSession?.nome_tela ?? ""}
                  placeholder="Ex.: Nave principal"
                />
              </label>

              <label className="profile-form-field">
                <span>Música</span>
                <select className="profile-form-input" name="musica_id" defaultValue={selectedSongId}>
                  <option value="">Nenhuma selecionada</option>
                  {musicasResumo.map((musica) => (
                    <option key={musica.id} value={musica.id}>
                      {musica.titulo} — {musica.autor}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-form-field">
                <span>Modo</span>
                <select className="profile-form-input" name="modo" defaultValue={currentSession?.modo ?? "exibicao"}>
                  <option value="exibicao">Exibição (apresentação)</option>
                  <option value="catalogo">Catálogo (selecionar música)</option>
                </select>
              </label>

              <label
                className="profile-form-field"
                style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" }}
              >
                <input type="checkbox" name="ativo" defaultChecked={currentSession?.ativo ?? true} />
                <span>Sessão ativa</span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Salvar sessão
              </button>
            </div>
          </form>

          <form action={createMusicaSessaoAction} style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-medium)" }}>
            <button type="submit" className="profile-form-btn profile-form-btn-secondary">
              Gerar nova sessão
            </button>
          </form>
        </div>

        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Sessões ativas</h2>
            <p>Clique em um código para editar ou abra a tela pública em outra janela.</p>
          </div>

          {sessoes.length === 0 ? (
            <div className="area-empty">
              <p>Nenhuma sessão criada ainda.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome da tela</th>
                  <th>Modo</th>
                  <th>Música</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao) => {
                  const musica = musicasResumo.find((item) => item.id === sessao.musica_id);

                  return (
                    <tr key={sessao.id}>
                      <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{sessao.codigo_pareamento}</td>
                      <td>{sessao.nome_tela || "—"}</td>
                      <td>{sessao.modo === "exibicao" ? "Exibição" : "Catálogo"}</td>
                      <td>{musica ? musica.titulo : "Nenhuma"}</td>
                      <td>
                        <span
                          className="inline-status"
                          style={{
                            backgroundColor: sessao.ativo ? "rgba(34, 197, 94, 0.2)" : "rgba(107, 114, 128, 0.2)",
                            color: sessao.ativo ? "#16a34a" : "#6b7280",
                          }}
                        >
                          {sessao.ativo ? "Ativa" : "Inativa"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <Link
                            href={`/admin/reuniao-publica/musicas/sessoes?codigo=${sessao.codigo_pareamento}`}
                            className="admin-btn admin-btn-small"
                          >
                            Editar
                          </Link>
                          <Link
                            href={`/musicas/exibir/${sessao.codigo_pareamento}`}
                            className="admin-btn admin-btn-small"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SessoesPage(props: PageProps) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={["diretoria", "secretaria", "comunicacao"]}
      redirectPath="/admin/reuniao-publica/musicas/sessoes"
      title="Sessões"
    >
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
        <SessoesContent {...props} />
      </Suspense>
    </AdminModuleGate>
  );
}
