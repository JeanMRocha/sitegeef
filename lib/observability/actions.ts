import "server-only";

import type { OpsEventLevel } from "@/lib/ops-events";
import { recordOpsEvent } from "@/lib/ops-events";

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
