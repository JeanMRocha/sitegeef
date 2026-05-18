"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { recordOpsEvent } from "@/lib/ops-events";
import { buildFlashNoticeUrl } from "@/lib/notificacoes/flash-notice";

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

async function recordTitularRequestEvent(input: {
  userId: string;
  personId: string | null;
  email: string | null;
  requestType: string;
  details: string;
}) {
  try {
    await recordOpsEvent({
      source: "user-area/lgpd",
      eventType: "log",
      level: "info",
      message: "Solicitação do titular registrada",
      payload: {
        user_id: input.userId,
        pessoa_id: input.personId,
        email: input.email,
        request_type: input.requestType,
        details: input.details,
      },
    });
  } catch {
    // A solicitação não pode falhar por causa da trilha de auditoria.
  }
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

  const [usuarioResult, pessoaResult] = await Promise.all([
    supabase.from("usuarios_sistema").select("pessoa_id").eq("id", user.id).maybeSingle(),
    supabase.from("profiles").select("email").eq("id", user.id).maybeSingle(),
  ]);

  const pessoaId = usuarioResult.data?.pessoa_id ?? null;
  const email = pessoaResult.data?.email ?? user.email ?? null;

  await recordTitularRequestEvent({
    userId: user.id,
    personId: pessoaId,
    email,
    requestType,
    details: details || "Pedido enviado pela área do usuário.",
  });

  redirect(
    buildFlashNoticeUrl("/minha-area", {
      variant: "success",
      message: "Pedido registrado. Vamos revisar em breve.",
    })
  );
}
