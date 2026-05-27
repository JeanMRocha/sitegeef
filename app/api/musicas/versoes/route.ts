import { createServiceRoleClient } from "@/lib/supabase/server";
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

    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("musica_versoes")
      .insert({ nome: nome.trim() })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating version:", error);
    return NextResponse.json(
      { error: "Erro ao criar versão" },
      { status: 500 }
    );
  }
}
