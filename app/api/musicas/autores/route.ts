import { saveMusicaAutor } from "@/lib/musicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nome } = await request.json();

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const data = await saveMusicaAutor({ nome: nome.trim() });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { error: "Erro ao criar autor" },
      { status: 500 }
    );
  }
}
