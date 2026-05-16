import { NextRequest, NextResponse } from "next/server";
import { recordOpsEvent } from "@/lib/ops-events";

type IncomingOpsEvent = {
  source?: string;
  eventType?: "log" | "heartbeat" | "weekly_report";
  level?: "debug" | "info" | "warn" | "error";
  message?: string;
  payload?: Record<string, unknown>;
  happenedAt?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as IncomingOpsEvent | null;

  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const source = typeof body.source === "string" && body.source.trim()
    ? body.source.trim().slice(0, 120)
    : "client-error";

  const eventType = body.eventType ?? "log";
  const level = body.level ?? "error";

  try {
    const event = await recordOpsEvent({
      source,
      eventType,
      level,
      message: body.message.slice(0, 500),
      payload: {
        ...(body.payload ?? {}),
        pathname: typeof body.payload?.pathname === "string" ? body.payload.pathname : request.headers.get("referer") ?? null,
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for"),
      },
      happenedAt: body.happenedAt,
    });

    return NextResponse.json({ ok: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to store ops event:", error);
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
