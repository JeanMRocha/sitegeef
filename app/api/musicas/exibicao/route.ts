import { NextResponse } from "next/server";
import { getMusicaExibicaoPublicaAtual } from "@/lib/musicas";

export async function GET() {
  const data = await getMusicaExibicaoPublicaAtual();

  if (!data) {
    return NextResponse.json({ sessao: null, musica: null });
  }

  return NextResponse.json(data);
}
