import { redirect } from "next/navigation";
import { createMusicaSessao } from "@/lib/musicas";

export default async function MusicasExibirPage() {
  const sessao = await createMusicaSessao();
  redirect(`/musicas/exibir/${sessao.codigo_pareamento}`);
}
