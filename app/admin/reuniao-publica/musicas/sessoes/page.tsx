import Link from "next/link";
import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { IconArrowLeft, IconPlus } from "@/components/icons";
import { EncerrarMusicasSessoesButton } from "@/components/admin/encerrar-musicas-sessoes-button";
import { SessoesList } from "@/components/admin/musicas/sessoes-list";
import { encerrarTodasMusicaSessoesAction } from "../actions";
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
            <SessoesList initialSessoes={sessoes} musicas={musicasResumo} />
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
