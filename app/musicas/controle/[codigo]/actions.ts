"use server";

import { patchMusicaSessao } from "@/lib/musicas";
import { invalidateMusicasCache } from "@/lib/admin/cache";

export async function setMusicaAtualAction(codigo: string, musicaId: string) {
  const sessao = await patchMusicaSessao(codigo, {
    musica_id: musicaId,
    ultimo_acesso_em: new Date().toISOString(),
  });

  if (!sessao) {
    throw new Error("Sessão não encontrada");
  }

  invalidateMusicasCache();
  return sessao;
}
