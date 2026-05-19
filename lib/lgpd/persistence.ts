import { headers } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { LGPD_VERSIONS, type LgpdCategoria, type LgpdStatus } from "./constants";

export type LgpdEventInput = {
  categoria: LgpdCategoria;
  acao: string;
  status?: LgpdStatus;
  versao?: string;
  escopo?: Record<string, unknown>;
  userId?: string | null;
  pessoaId?: string | null;
  origem?: string | null;
  canal?: string | null;
  expiresAt?: string | null;
  consentidoEm?: string | null;
  revogadoEm?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
};

export function getLgpdVersion(categoria: LgpdCategoria) {
  if (categoria === "cookies") {
    return LGPD_VERSIONS.cookies;
  }

  if (categoria === "termos_uso") {
    return LGPD_VERSIONS.terms;
  }

  return LGPD_VERSIONS.privacy;
}

export async function getLgpdRequestMeta() {
  const requestHeaders = await headers();

  return {
    ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: requestHeaders.get("user-agent"),
    referer: requestHeaders.get("referer"),
  };
}

export async function recordLgpdEvent(input: LgpdEventInput) {
  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("lgpd_registros")
    .insert({
      user_id: input.userId ?? null,
      pessoa_id: input.pessoaId ?? null,
      categoria: input.categoria,
      acao: input.acao,
      status: input.status ?? "registrado",
      versao: input.versao ?? getLgpdVersion(input.categoria),
      escopo: input.escopo ?? {},
      origem: input.origem ?? null,
      canal: input.canal ?? "web",
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
      referer: input.referer ?? null,
      consentido_em: input.consentidoEm ?? now,
      revogado_em: input.revogadoEm ?? null,
      expires_at: input.expiresAt ?? null,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id as string };
}

export async function recordLgpdEvents(inputs: LgpdEventInput[]) {
  for (const input of inputs) {
    const result = await recordLgpdEvent(input);
    if (!result.success) {
      return result;
    }
  }

  return { success: true };
}
