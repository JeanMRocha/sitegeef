import { notFound } from "next/navigation";
import { getMusicaSessaoByCodigo, listPublicMusicas } from "@/lib/musicas";
import { MusicaControlRemote } from "@/components/musicas/musica-control-remote";

type PageProps = {
  params: Promise<{ codigo: string }>;
};

export const metadata = {
  title: "Controle de Sessão - GEEF",
  description: "Interface de controle remoto para gerenciar a reprodução de músicas.",
};

export default async function MusicaControlPage({ params }: PageProps) {
  const { codigo } = await params;
  const [sessao, musicas] = await Promise.all([getMusicaSessaoByCodigo(codigo), listPublicMusicas()]);

  if (!sessao) {
    notFound();
  }

  return <MusicaControlRemote codigo={codigo} initialSessao={sessao} musicas={musicas} />;
}
