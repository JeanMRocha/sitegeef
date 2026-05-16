import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type OpsEventLevel = "debug" | "info" | "warn" | "error";
export type OpsEventType = "log" | "heartbeat" | "weekly_report";

export type OpsEvent = {
  id: number;
  source: string;
  event_type: OpsEventType;
  level: OpsEventLevel;
  message: string;
  payload: Record<string, unknown>;
  happened_at: string;
  created_at: string;
};

type RecordOpsEventInput = {
  source: string;
  eventType: OpsEventType;
  level: OpsEventLevel;
  message: string;
  payload?: Record<string, unknown>;
  happenedAt?: string;
};

type ListOpsEventsFilters = {
  limit?: number;
  level?: OpsEventLevel | "all";
  source?: string;
  query?: string;
};

let cachedClient: SupabaseClient | null = null;

function getSupabaseUrl() {
  return process.env.GEEF_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseServiceRoleKey() {
  return (
    process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getOpsClient() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url) {
    throw new Error("Missing Supabase URL for ops events.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing Supabase service role key for ops events.");
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedClient;
}

function normalizeLimit(limit?: number) {
  if (!limit || Number.isNaN(limit)) {
    return 50;
  }

  return Math.max(1, Math.min(limit, 200));
}

export async function recordOpsEvent(input: RecordOpsEventInput) {
  const supabase = getOpsClient();
  const payload = input.payload ?? {};

  const { data, error } = await supabase
    .from("ops_events")
    .insert({
      source: input.source,
      event_type: input.eventType,
      level: input.level,
      message: input.message,
      payload,
      happened_at: input.happenedAt ?? new Date().toISOString(),
    })
    .select("id, source, event_type, level, message, payload, happened_at, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as OpsEvent;
}

export async function listOpsEvents(filters: ListOpsEventsFilters = {}) {
  const supabase = getOpsClient();
  const limit = normalizeLimit(filters.limit);

  let query = supabase
    .from("ops_events")
    .select("id, source, event_type, level, message, payload, happened_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.level && filters.level !== "all") {
    query = query.eq("level", filters.level);
  }

  if (filters.source) {
    query = query.ilike("source", `%${filters.source}%`);
  }

  if (filters.query) {
    query = query.ilike("message", `%${filters.query}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as OpsEvent[];
}

export async function getOpsEventStats(events: OpsEvent[]) {
  const last24hThreshold = Date.now() - 24 * 60 * 60 * 1000;
  const last24h = events.filter((event) => new Date(event.created_at).getTime() >= last24hThreshold);

  return {
    total: events.length,
    last24h: last24h.length,
    errors: events.filter((event) => event.level === "error").length,
    warnings: events.filter((event) => event.level === "warn").length,
    sources: new Set(events.map((event) => event.source)).size,
  };
}
