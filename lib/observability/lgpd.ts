import "server-only";

import type { LgpdEventInput, LgpdSeverity } from "@/lib/lgpd/persistence";
import { recordLgpdEvent } from "@/lib/lgpd/persistence";

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

  if (
    input.categoria === "crianca" ||
    input.categoria === "sensivel" ||
    input.categoria === "upload" ||
    input.categoria === "checkout" ||
    input.categoria === "finalidade_nova"
  ) {
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
