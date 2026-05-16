import { NextRequest, NextResponse } from "next/server";
import { recordOpsEvent } from "@/lib/ops-events";
import { getRequestOrigin } from "@/lib/security";

type IncomingOpsEvent = {
  source?: string;
  eventType?: "log" | "heartbeat" | "weekly_report";
  level?: "debug" | "info" | "warn" | "error";
  message?: string;
  payload?: Record<string, unknown>;
  happenedAt?: string;
};

const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 20;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const maxRequestBodySize = 16 * 1024;

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

  let body: IncomingOpsEvent | null = null;

  try {
    body = (rawBody ? JSON.parse(rawBody) : null) as IncomingOpsEvent | null;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const validEventTypes = new Set<NonNullable<IncomingOpsEvent["eventType"]>>([
    "log",
    "heartbeat",
    "weekly_report",
  ]);
  const validLevels = new Set<NonNullable<IncomingOpsEvent["level"]>>([
    "debug",
    "info",
    "warn",
    "error",
  ]);

  const source = typeof body.source === "string" && body.source.trim()
    ? body.source.trim().slice(0, 120)
    : "client-error";

  const eventType = validEventTypes.has(body.eventType ?? "log")
    ? body.eventType ?? "log"
    : "log";
  const level = validLevels.has(body.level ?? "error")
    ? body.level ?? "error"
    : "error";

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
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      },
      happenedAt: body.happenedAt,
    });

    return NextResponse.json({ ok: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to store ops event:", error);
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
