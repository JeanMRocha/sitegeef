import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordLgpdEvent } from "@/lib/lgpd/persistence";

type Body = {
  categoria?: "cookies" | "privacidade" | "termos_uso" | "marketing" | "whatsapp" | "sensivel" | "crianca" | "upload" | "checkout" | "login" | "finalidade_nova";
  acao?: string;
  status?: "registrado" | "aceito" | "recusado" | "ciencia" | "revogado" | "informado";
  versao?: string;
  escopo?: Record<string, unknown>;
  severity?: "info" | "low" | "medium" | "high" | "critical";
  origem?: string;
  canal?: string;
  expiresAt?: string | null;
};

export async function POST(request: NextRequest) {
  let body: Body | null = null;

  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body?.categoria || !body.acao) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuario } = user
    ? await supabase
        .from("usuarios_sistema")
        .select("pessoa_id")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const result = await recordLgpdEvent({
    categoria: body.categoria,
    acao: body.acao,
    status: body.status,
    versao: body.versao,
    escopo: body.escopo,
    severity: body.severity,
    origem: body.origem ?? "api/lgpd/registros",
    canal: body.canal ?? "web",
    expiresAt: body.expiresAt ?? null,
    userId: user?.id ?? null,
    pessoaId: usuario?.pessoa_id ?? null,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "store_failed" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, id: result.id }, { status: 201 });

  if (body.categoria === "cookies") {
    response.cookies.set("geef_lgpd_cookies", encodeURIComponent(JSON.stringify({
      version: body.versao ?? "2026-05-18",
      essential: true,
      marketing: Boolean(body.escopo?.marketing),
      analytics: Boolean(body.escopo?.analytics),
      tracking: Boolean(body.escopo?.tracking),
      decision: body.acao,
    })), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}
