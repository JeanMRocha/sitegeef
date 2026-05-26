import Link from "next/link";
import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { MusicaEditorForm } from "@/components/admin/musicas/musica-editor-form";
import {
  createMusicaSessaoAction,
  deleteMusicaAction,
  saveMusicaAction,
  saveMusicaSessaoAction,
} from "./actions";
import {
  getMusicaById,
  getMusicasResumo,
  listMusicaSessoes,
  listMusicas,
} from "@/lib/musicas";

export const metadata = {
  title: "Músicas - Admin GEEF",
};

type PageProps = {
  searchParams?: Promise<{ q?: string; id?: string; codigo?: string }>;
};

async function MusicasContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = typeof params.q === "string" ? params.q : "";
  const selectedId = typeof params.id === "string" ? params.id : "";
  const selectedCodigo = typeof params.codigo === "string" ? params.codigo.toUpperCase() : "";

  const [musicas, musicasResumo, sessoes, selectedMusica] = await Promise.all([
    listMusicas(q),
    getMusicasResumo(),
    listMusicaSessoes(),
    selectedId ? getMusicaById(selectedId) : Promise.resolve(null),
  ]);

  const currentSession = selectedCodigo ? sessoes.find((sessao) => sessao.codigo_pareamento === selectedCodigo) ?? null : null;
  const selectedSongId = currentSession?.musica_id ?? selectedMusica?.id ?? "";

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Institucional</p>
            <h1 className="area-hero-title">Músicas</h1>
          </div>
          <form action={createMusicaSessaoAction}>
            <button type="submit" className="profile-form-btn profile-form-btn-primary">
              Criar tela de exibição
            </button>
          </form>
        </div>
        <p className="area-subtitle">
          Cadastre músicas com estrofes, refrões e cifras, e controle a exibição pública por código de pareamento.
        </p>
      </section>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Músicas cadastradas</span>
            <strong>{musicasResumo.length}</strong>
          </div>
          <div className="stat-card">
            <span>Sessões ativas</span>
            <strong>{sessoes.filter((sessao) => sessao.ativo).length}</strong>
          </div>
          <div className="stat-card">
            <span>Modo exibição</span>
            <strong>{sessoes.filter((sessao) => sessao.modo === "exibicao").length}</strong>
          </div>
          <div className="stat-card">
            <span>Modo catálogo</span>
            <strong>{sessoes.filter((sessao) => sessao.modo === "catalogo").length}</strong>
          </div>
        </div>
      </section>

      <section className="area-section">
        <form method="get" className="admin-search-bar">
          <input name="q" type="search" defaultValue={q} placeholder="Buscar por autor, título ou trecho da letra" />
          <button type="submit" className="profile-form-btn profile-form-btn-secondary">
            Buscar
          </button>
        </form>
      </section>

      <section className="area-section admin-grid-two">
        <div className="table-surface">
          <div className="area-section-title">
            <h2>Catálogo</h2>
            <p>Abra uma música para editar ou revisar a estrutura já cadastrada.</p>
          </div>

          {musicas.length === 0 ? (
            <div className="area-empty">
              <p>Nenhuma música encontrada.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Tom</th>
                  <th>Partes</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {musicas.map((musica) => (
                  <tr key={musica.id}>
                    <td style={{ fontWeight: 600 }}>{musica.titulo}</td>
                    <td>{musica.autor}</td>
                    <td>{musica.tom || "—"}</td>
                    <td>{musica.partes.length}</td>
                    <td>
                      <Link href={`/admin/instituicao/musicas?id=${musica.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="table-surface">
          <div className="area-section-title">
            <h2>{selectedMusica ? "Editar música" : "Nova música"}</h2>
            <p>Os blocos viram a leitura pública na mesma ordem em que você cadastrar.</p>
          </div>

          <MusicaEditorForm key={selectedMusica?.id ?? "new"} musica={selectedMusica} action={saveMusicaAction} />

          {selectedMusica ? (
            <form action={deleteMusicaAction} style={{ marginTop: "1rem" }}>
              <input type="hidden" name="id" value={selectedMusica.id} readOnly />
              <button type="submit" className="profile-form-btn profile-form-btn-secondary" style={{ color: "#8a005a" }}>
                Excluir música
              </button>
            </form>
          ) : null}
        </div>
      </section>

      <section className="area-section admin-grid-two">
        <div className="table-surface">
          <div className="area-section-title">
            <h2>Pareamento</h2>
            <p>Vincule uma tela pública pelo código e escolha a música controlada pelo telefone.</p>
          </div>

          <form action={saveMusicaSessaoAction} className="music-pairing-form">
            <div className="admin-grid-two">
              <label className="musica-field">
                <span>Código de pareamento</span>
                <input name="codigo_pareamento" defaultValue={currentSession?.codigo_pareamento ?? selectedCodigo} placeholder="Ex.: A7K3P9" />
              </label>

              <label className="musica-field">
                <span>Nome da tela</span>
                <input name="nome_tela" defaultValue={currentSession?.nome_tela ?? ""} placeholder="Ex.: Nave principal" />
              </label>

              <label className="musica-field">
                <span>Música</span>
                <select name="musica_id" defaultValue={selectedSongId}>
                  <option value="">Nenhuma selecionada</option>
                  {musicasResumo.map((musica) => (
                    <option key={musica.id} value={musica.id}>
                      {musica.titulo} - {musica.autor}
                    </option>
                  ))}
                </select>
              </label>

              <label className="musica-field">
                <span>Modo</span>
                <select name="modo" defaultValue={currentSession?.modo ?? "exibicao"}>
                  <option value="exibicao">Exibição</option>
                  <option value="catalogo">Catálogo</option>
                </select>
              </label>

              <label className="musica-field musica-field--checkbox">
                <input type="checkbox" name="ativo" defaultChecked={currentSession?.ativo ?? true} />
                <span>Sessão ativa</span>
              </label>
            </div>

            <div className="musica-editor-actions">
              <button type="submit" className="button button-primary">
                Salvar pareamento
              </button>
            </div>
          </form>
        </div>

        <div className="table-surface">
          <div className="area-section-title">
            <h2>Sessões</h2>
            <p>Veja quais telas estão conectadas e abra a exibição pública correspondente.</p>
          </div>

          {sessoes.length === 0 ? (
            <div className="area-empty">Nenhuma sessão criada ainda.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Modo</th>
                  <th>Sessão</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao) => {
                  const musica = musicasResumo.find((item) => item.id === sessao.musica_id);

                  return (
                    <tr key={sessao.id}>
                      <td style={{ fontWeight: 600 }}>{sessao.codigo_pareamento}</td>
                      <td>{sessao.modo === "exibicao" ? "Exibição" : "Catálogo"}</td>
                      <td>{musica ? musica.titulo : "Sem música"}</td>
                      <td>
                        <Link href={`/musicas/exibir/${sessao.codigo_pareamento}`} className="profile-form-btn profile-form-btn-secondary" target="_blank" rel="noreferrer">
                          Abrir tela
                        </Link>
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

export default function MusicasAdminPage(props: PageProps) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={["diretoria", "secretaria", "comunicacao"]}
      redirectPath="/admin/instituicao/musicas"
      title="Músicas"
    >
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
        <MusicasContent {...props} />
      </Suspense>
    </AdminModuleGate>
  );
}
