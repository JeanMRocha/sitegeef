"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildFlashNoticeUrl } from "@/lib/notificacoes/flash-notice";
import { createTitularSolicitacao } from "@/app/admin/documentos/actions";
import { recordActionFailureEvent, recordSupabaseFailureEvent } from "@/lib/observability";

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
    await recordSupabaseFailureEvent({
      source: "user-area/setup",
      operation: "ensureUserSystemRecord",
      table: "usuarios_sistema",
      error,
      fallback: "null",
    });
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

  if (usuarioResult.error) {
    await recordSupabaseFailureEvent({
      source: "user-area/lgpd",
      operation: "lookup usuarios_sistema",
      table: "usuarios_sistema",
      error: usuarioResult.error,
      fallback: "null",
      payload: { userId: user.id },
    });
  }

  const pessoaResult = pessoaId
    ? await supabase.from("pessoas").select("nome, email").eq("id", pessoaId).maybeSingle()
    : { data: null };

  if ("error" in pessoaResult && pessoaResult.error) {
    await recordSupabaseFailureEvent({
      source: "user-area/lgpd",
      operation: "lookup pessoas",
      table: "pessoas",
      error: pessoaResult.error,
      fallback: "null",
      payload: { userId: user.id, pessoaId },
    });
  }

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
    await recordActionFailureEvent({
      source: "user-area/lgpd",
      action: "submitTitularRequest",
      message: "O pedido do titular não foi persistido.",
      payload: { userId: user.id, pessoaId, requestType },
    });
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
