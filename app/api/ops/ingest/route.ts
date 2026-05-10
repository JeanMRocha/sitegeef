import { NextResponse } from "next/server";
import {
  assertOpsIngestToken,
  insertOpsEvent,
  normalizeOpsEvent,
} from "@/lib/ops-logging";

export async function POST(request: Request) {
  if (!assertOpsIngestToken(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const event = normalizeOpsEvent(body as Record<string, unknown>);
  const { data, error } = await insertOpsEvent(event);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "insert_failed",
        details: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: data?.id ?? null,
    stored_at: new Date().toISOString(),
  });
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "method_not_allowed" },
    { status: 405 },
  );
}
