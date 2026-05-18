"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildFlashNoticeUrl } from "@/lib/notificacoes/flash-notice";
import { createTitularSolicitacao } from "@/app/admin/documentos/actions";

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

export async function submitTitularRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/minha-area");
  }

  const requestType = String(formData.get("request_type") || "").trim();
  const details = String(formData.get("details") || "").trim();
  const allowedTypes = new Set(["acesso", "correcao", "revogacao", "eliminacao"]);

  if (!requestType || !allowedTypes.has(requestType)) {
    redirect(
      buildFlashNoticeUrl("/minha-area", {
        variant: "error",
        message: "Selecione um tipo de pedido válido.",
      })
    );
  }

  const usuarioResult = await supabase.from("usuarios_sistema").select("pessoa_id").eq("id", user.id).maybeSingle();
  const pessoaId = usuarioResult.data?.pessoa_id ?? null;

  const pessoaResult = pessoaId
    ? await supabase.from("pessoas").select("nome, email").eq("id", pessoaId).maybeSingle()
    : { data: null };

  const titularNome = pessoaResult.data?.nome ?? user.user_metadata?.nome ?? null;
  const titularEmail = pessoaResult.data?.email ?? user.email ?? null;

  const solicitacao = await createTitularSolicitacao({
    user_id: user.id,
    pessoa_id: pessoaId,
    titular_nome: titularNome,
    titular_email: titularEmail,
    request_type: requestType,
    details: details || "Pedido enviado pela área do usuário.",
    origem: "minha-area",
  });

  if (!solicitacao) {
    redirect(
      buildFlashNoticeUrl("/minha-area", {
        variant: "error",
        message: "Não foi possível registrar o pedido.",
      })
    );
  }

  redirect(
    buildFlashNoticeUrl("/minha-area", {
      variant: "success",
      message: "Pedido registrado. Vamos revisar em breve.",
    })
  );
}
