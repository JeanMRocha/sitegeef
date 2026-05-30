import { redirect } from "next/navigation";
import { createMusicaSessao } from "@/lib/musicas";

export const metadata = {
  title: "Exibição pública - Músicas GEEF",
  description: "Tela de exibição pareada para músicas do GEEF.",
};

export default async function MusicasExibirPage() {
  const sessao = await createMusicaSessao({ modo: "exibicao" });
  redirect(`/musicas/exibir/${sessao.codigo_pareamento}`);
}
