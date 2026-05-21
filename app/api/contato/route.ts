import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getRequestOrigin } from "@/lib/security";

type ContactPayload = {
  nome?: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem?: string;
  honeypot?: string;
  pagina_origem?: string;
};

const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 6;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const maxRequestBodySize = 20 * 1024;

function normalize(value?: string) {
  return value?.trim() ?? "";
}

function getRateLimitKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("user-agent") ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > rateLimitMaxRequests;
}

export async function POST(request: NextRequest) {
  const requestOrigin = getRequestOrigin(request);

  if (requestOrigin && requestOrigin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403 });
  }

  if (isRateLimited(getRateLimitKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const rawBody = await request.text().catch(() => "");

  if (rawBody.length > maxRequestBodySize) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: ContactPayload | null = null;

  try {
    body = (rawBody ? JSON.parse(rawBody) : null) as ContactPayload | null;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const nome = normalize(body?.nome);
  const email = normalize(body?.email);
  const telefone = normalize(body?.telefone);
  const assunto = normalize(body?.assunto);
  const mensagem = normalize(body?.mensagem);
  const honeypot = normalize(body?.honeypot);
  const paginaOrigem = normalize(body?.pagina_origem) || "/contato";

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!nome || !email || !assunto || !mensagem) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent");
  const referer = request.headers.get("referer");

  const contatoResult = await supabase
    .from("contato_mensagens")
    .insert([
    {
      nome,
      email,
      telefone: telefone || null,
      assunto: assunto.slice(0, 180),
      mensagem: mensagem.slice(0, 8000),
      pagina_origem: paginaOrigem.slice(0, 120),
      canal: "site",
      status: "novo",
      ip,
      user_agent: userAgent,
      referer,
      metadata: {
        origem: "site-publico",
        recebido_em: now,
      },
      criado_em: now,
      atualizado_em: now,
    },
  ])
    .select("id")
    .single();

  if (contatoResult.error) {
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }

  await supabase.from("notificacoes").insert([
    {
      pessoa_id: null,
      tipo: "info",
      titulo: "Novo contato do site",
      mensagem: `${nome} enviou uma mensagem pelo formulário de contato${assunto ? `: ${assunto}` : ""}.`,
      canal: "interno",
      status: "pendente",
      modulo_origem: "contato",
      criado_em: now,
    },
  ]);

  return NextResponse.json(
    {
      ok: true,
      id: contatoResult.data?.id ?? null,
    },
    { status: 201 }
  );
}
