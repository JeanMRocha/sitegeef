import Link from "next/link";
import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { IconArrowLeft, IconPlus, IconEdit, IconExternalLink, IconPower, IconTrash } from "@/components/icons";
import { EncerrarMusicasSessoesButton } from "@/components/admin/encerrar-musicas-sessoes-button";
import {
  encerrarTodasMusicaSessoesAction,
  setMusicaSessaoAtivaAction,
  deleteMusicaSessaoAction,
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

  const [sessoes, musicasResumo] = await Promise.all([listMusicaSessoes(), getMusicasResumo()]);
  const sessoesAtivas = sessoes.filter((sessao) => sessao.ativo);
  const sessoesAtivasLabel = sessoesAtivas.length === 1 ? "1 sessão ativa" : `${sessoesAtivas.length} sessões ativas`;

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Músicas</span>
          <h1 className="admin-page-title">Sessões de pareamento</h1>
        </div>
        <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary" title="Voltar">
          <IconArrowLeft size={18} />
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
        <div
          className="admin-card"
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Encerramento em lote</h2>
            <p style={{ margin: "0.35rem 0 0", color: "var(--text-muted)" }}>
              {sessoesAtivasLabel} serão encerradas de uma vez.
            </p>
          </div>
          <EncerrarMusicasSessoesButton
            action={encerrarTodasMusicaSessoesAction}
            disabled={sessoesAtivas.length === 0}
            count={sessoesAtivas.length}
          />
        </div>
      </section>

      <section className="area-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>Sessões ativas</h2>
          <Link href="/admin/reuniao-publica/musicas/sessoes/novo" className="admin-btn admin-btn-primary" title="Nova sessão">
            <IconPlus size={18} />
          </Link>
        </div>

        <div className="admin-card table-surface">
          <div className="area-section-title">
            <p>Clique em um código para editar, abrir a tela pública ou encerrar/reativar a sessão.</p>
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
                            href={`/admin/reuniao-publica/musicas/sessoes/novo?codigo=${sessao.codigo_pareamento}`}
                            className="admin-btn admin-btn-small"
                            title="Editar"
                          >
                            <IconEdit size={16} />
                          </Link>
                          <Link
                            href={`/musicas/exibir/${sessao.codigo_pareamento}`}
                            className="admin-btn admin-btn-small"
                            target="_blank"
                            rel="noreferrer"
                            title="Abrir em nova aba"
                          >
                            <IconExternalLink size={16} />
                          </Link>
                          {sessao.ativo ? (
                            <form action={setMusicaSessaoAtivaAction} style={{ display: "inline" }}>
                              <input type="hidden" name="codigo_pareamento" value={sessao.codigo_pareamento} />
                              <input type="hidden" name="ativo" value="false" />
                              <button
                                type="submit"
                                className="admin-btn admin-btn-small"
                                style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.25)" }}
                                title="Encerrar sessão"
                              >
                                <IconPower size={16} />
                              </button>
                            </form>
                          ) : (
                            <form action={deleteMusicaSessaoAction} style={{ display: "inline" }}>
                              <input type="hidden" name="codigo_pareamento" value={sessao.codigo_pareamento} />
                              <button
                                type="submit"
                                className="admin-btn admin-btn-small"
                                style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.25)" }}
                                title="Excluir sessão"
                              >
                                <IconTrash size={16} />
                              </button>
                            </form>
                          )}
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
