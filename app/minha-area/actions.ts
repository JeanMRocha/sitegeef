"use server";

import { createClient } from "@/lib/supabase/server";

export async function ensureUserSystemRecord() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  // Verificar se já existe registro
  const { data: existing } = await supabase
    .from("usuarios_sistema")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existing) {
    return { success: true, message: "Registro já existe" };
  }

  // Criar registro para novo usuário
  const { error } = await supabase
    .from("usuarios_sistema")
    .insert({
      id: user.id,
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

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Registro criado com sucesso" };
}
