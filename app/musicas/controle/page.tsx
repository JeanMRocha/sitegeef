import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { MusicaControlRemote } from "@/components/musicas/musica-control-remote";
import { getMusicaExibicaoAtual, listPublicMusicas } from "@/lib/musicas";

export const metadata = {
  title: "Controle ao vivo - Músicas GEEF",
  description: "Controle da música exibida na tela pública.",
};

async function ControleConteudo() {
  const [exibicaoAtual, musicas] = await Promise.all([getMusicaExibicaoAtual(), listPublicMusicas()]);

  if (!exibicaoAtual) {
    return (
      <div className="area-page" style={{ paddingTop: "1rem" }}>
        <section className="area-section">
          <div className="admin-card">
            <div className="area-section-title">
              <h2>Controle ao vivo</h2>
              <p>Nenhuma sessão ativa foi encontrada. Abra o dashboard de sessões para ativar uma tela.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <MusicaControlRemote codigo={exibicaoAtual.sessao.codigo_pareamento} initialSessao={exibicaoAtual.sessao} musicas={musicas} />;
}

export default function MusicasControlePage() {
  return (
    <AdminModuleGate permission="pode_publicar" profiles={["diretoria", "secretaria", "comunicacao"]} redirectPath="/musicas/controle" title="Controle ao vivo">
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
        <ControleConteudo />
      </Suspense>
    </AdminModuleGate>
  );
}
