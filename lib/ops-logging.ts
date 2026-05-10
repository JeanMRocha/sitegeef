import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const OPS_EVENT_LEVELS = ["debug", "info", "warn", "error"] as const;
export const OPS_EVENT_TYPES = ["log", "heartbeat", "weekly_report"] as const;

export type OpsEventLevel = (typeof OPS_EVENT_LEVELS)[number];
export type OpsEventType = (typeof OPS_EVENT_TYPES)[number];

export type OpsEventPayload = {
  source?: string;
  event_type?: string;
  level?: string;
  message?: string;
  payload?: unknown;
  happened_at?: string;
};

export type StoredOpsEvent = {
  source: string;
  event_type: OpsEventType;
  level: OpsEventLevel;
  message: string;
  payload: Record<string, unknown>;
  happened_at: string;
};

const INGEST_TOKEN_HEADER = "x-geef-log-token";

export function assertOpsIngestToken(request: Request) {
  const expected = process.env.GEEF_LOG_INGEST_TOKEN;

  if (!expected) {
    throw new Error("Missing GEEF_LOG_INGEST_TOKEN.");
  }

  const authorization = request.headers.get("authorization");
  const tokenFromAuth = authorization?.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : null;
  const tokenFromHeader = request.headers.get(INGEST_TOKEN_HEADER)?.trim();
  const providedToken = tokenFromAuth || tokenFromHeader;

  if (!providedToken || providedToken !== expected) {
    return false;
  }

  return true;
}

export function normalizeOpsEvent(input: OpsEventPayload): StoredOpsEvent {
  const source = normalizeText(input.source, "vpsgeef");
  const eventType = normalizeEnum(input.event_type, OPS_EVENT_TYPES, "log");
  const level = normalizeEnum(input.level, OPS_EVENT_LEVELS, "info");
  const message = normalizeText(input.message, "No message provided.");
  const happenedAt = normalizeTimestamp(input.happened_at);

  return {
    source,
    event_type: eventType,
    level,
    message,
    payload: normalizePayload(input.payload),
    happened_at: happenedAt,
  };
}

export async function insertOpsEvent(event: StoredOpsEvent) {
  const supabase = getSupabaseAdminClient();
  return supabase
    .from("ops_events")
    .insert({
    source: event.source,
    event_type: event.event_type,
    level: event.level,
    message: event.message,
    payload: event.payload,
    happened_at: event.happened_at,
    })
    .select("id")
    .single();
}

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof value === "string" && allowed.includes(value as T)) {
    return value as T;
  }

  return fallback;
}

function normalizePayload(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function normalizeTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}
