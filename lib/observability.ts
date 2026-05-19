import "server-only";

import { recordOpsEvent, type OpsEventLevel } from "@/lib/ops-events";
import { recordLgpdEvent, type LgpdEventInput, type LgpdSeverity } from "@/lib/lgpd/persistence";

type ErrorRecord = {
  name?: unknown;
  message?: unknown;
  stack?: unknown;
  code?: unknown;
  details?: unknown;
  hint?: unknown;
  status?: unknown;
  statusCode?: unknown;
};

function serializeError(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      name: typeof error === "string" ? "Error" : null,
      message: typeof error === "string" ? error : "Erro desconhecido",
      stack: null,
      code: null,
      details: null,
      hint: null,
      status: null,
      statusCode: null,
    };
  }

  const record = error as ErrorRecord;

  return {
    name: typeof record.name === "string" ? record.name : null,
    message: typeof record.message === "string" ? record.message : "Erro desconhecido",
    stack: typeof record.stack === "string" ? record.stack : null,
    code: typeof record.code === "string" ? record.code : null,
    details: typeof record.details === "string" ? record.details : null,
    hint: typeof record.hint === "string" ? record.hint : null,
    status: typeof record.status === "number" ? record.status : null,
    statusCode: typeof record.statusCode === "number" ? record.statusCode : null,
  };
}

type RecordActionFailureInput = {
  source: string;
  action: string;
  message: string;
  error?: unknown;
  level?: OpsEventLevel;
  payload?: Record<string, unknown>;
  happenedAt?: string;
};

export async function recordActionFailureEvent(input: RecordActionFailureInput) {
  try {
    await recordOpsEvent({
      source: input.source,
      eventType: "log",
      level: input.level ?? "error",
      message: input.message,
      payload: {
        action: input.action,
        error: input.error ? serializeError(input.error) : null,
        ...input.payload,
      },
      happenedAt: input.happenedAt,
    });
  } catch {
    // A observabilidade não deve bloquear a action principal.
  }
}

type RecordSupabaseFailureInput = {
  source: string;
  operation: string;
  message?: string;
  error?: unknown;
  table?: string;
  fallback?: "null" | "empty_list" | "false" | "empty_object";
  level?: OpsEventLevel;
  payload?: Record<string, unknown>;
  happenedAt?: string;
};

export async function recordSupabaseFailureEvent(input: RecordSupabaseFailureInput) {
  try {
    await recordOpsEvent({
      source: input.source,
      eventType: "log",
      level: input.level ?? "warn",
      message: input.message || `Falha silenciosa no Supabase em ${input.operation}`,
      payload: {
        operation: input.operation,
        table: input.table ?? null,
        fallback: input.fallback ?? null,
        error: input.error ? serializeError(input.error) : null,
        ...input.payload,
      },
      happenedAt: input.happenedAt,
    });
  } catch {
    // Sem observabilidade não há bloqueio de fluxo.
  }
}

type LgpdSeverityInput = LgpdEventInput & {
  severity?: LgpdSeverity;
};

function resolveLgpdSeverity(input: LgpdSeverityInput): LgpdSeverity {
  if (input.severity) {
    return input.severity;
  }

  if (input.escopo && typeof input.escopo.severity === "string") {
    return input.escopo.severity as LgpdSeverity;
  }

  if (input.categoria === "crianca" || input.categoria === "sensivel" || input.categoria === "upload" || input.categoria === "checkout" || input.categoria === "finalidade_nova") {
    return "high";
  }

  if (input.categoria === "marketing" || input.categoria === "whatsapp") {
    return "medium";
  }

  if (input.status === "revogado" || input.status === "recusado") {
    return "medium";
  }

  if (input.categoria === "login") {
    return "low";
  }

  return "info";
}

export function withLgpdSeverity(input: LgpdSeverityInput): LgpdEventInput {
  const severity = resolveLgpdSeverity(input);
  const escopo = {
    ...(input.escopo ?? {}),
    severity,
  };

  return {
    ...input,
    escopo,
  };
}

export async function recordLgpdEventWithSeverity(input: LgpdSeverityInput) {
  return recordLgpdEvent(withLgpdSeverity(input));
}
