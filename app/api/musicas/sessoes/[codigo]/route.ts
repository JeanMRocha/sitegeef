import { NextResponse } from "next/server";
import { getMusicaSessaoComMusica, touchMusicaSessao } from "@/lib/musicas";

type RouteContext = {
  params: Promise<{ codigo: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { codigo } = await params;
  const data = await getMusicaSessaoComMusica(codigo);

  if (!data) {
    return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404 });
  }

  try {
    await touchMusicaSessao(codigo);
  } catch {
    // leitura continua mesmo se o touch falhar
  }

  return NextResponse.json(data);
}
