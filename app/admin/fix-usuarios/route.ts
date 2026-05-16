import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Buscar todos os usuários que não têm usuarios_sistema
    const { data: authUsers } = await supabase.auth.admin.listUsers();

    if (!authUsers?.users) {
      return NextResponse.json({ error: "Couldn't fetch users" }, { status: 500 });
    }

    const { data: existing } = await supabase
      .from("usuarios_sistema")
      .select("id");

    const existingIds = new Set(existing?.map((u: any) => u.id) || []);
    const usersToCreate = authUsers.users.filter((u) => !existingIds.has(u.id));

    if (usersToCreate.length === 0) {
      return NextResponse.json({
        message: "All users already have usuarios_sistema records",
        created: 0,
      });
    }

    const results = [];

    for (const authUser of usersToCreate) {
      const { error } = await supabase
        .from("usuarios_sistema")
        .insert({
          id: authUser.id,
          perfil: "publico",
          pode_escalas: false,
          pode_biblioteca: false,
          pode_livraria: false,
          pode_financeiro: false,
          pode_pessoas: false,
          pode_publicar: false,
          pode_mediunidade: false,
          pode_atendimento: false,
          pode_apse: false,
        });

      results.push({
        email: authUser.email,
        success: !error,
        error: error?.message,
      });
    }

    return NextResponse.json({
      message: "Processo concluído",
      created: usersToCreate.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
