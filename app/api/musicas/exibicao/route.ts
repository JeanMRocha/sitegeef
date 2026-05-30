import { NextResponse } from "next/server";
import { getMusicaExibicaoAtual } from "@/lib/musicas";

export async function GET() {
  const data = await getMusicaExibicaoAtual();

  if (!data) {
    return NextResponse.json({ sessao: null, musica: null });
  }

  return NextResponse.json(data);
}
