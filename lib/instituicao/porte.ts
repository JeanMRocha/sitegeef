export const PORTE_CNPJ_OPTIONS = [
  { value: "00", label: "00 - Não informado" },
  { value: "01", label: "01 - Microempresa" },
  { value: "03", label: "03 - Empresa de Pequeno Porte" },
  { value: "05", label: "05 - Demais" },
] as const;

const PORTE_LABELS: Record<string, string> = Object.fromEntries(
  PORTE_CNPJ_OPTIONS.map((option) => [option.value, option.label])
);

export function normalizePorteCnpj(value?: string) {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  const upper = normalized.toUpperCase();

  if (PORTE_LABELS[upper]) {
    return upper;
  }

  if (upper === "MEI") {
    return "00";
  }

  if (upper === "ME" || upper.includes("MICRO")) {
    return "01";
  }

  if (upper === "EPP" || upper.includes("PEQUEN") || upper.includes("PEQUENO")) {
    return "03";
  }

  if (upper === "DEMAIS" || upper.includes("MÉDIA") || upper.includes("MEDIA") || upper.includes("GRANDE")) {
    return "05";
  }

  if (upper === "00" || upper === "01" || upper === "03" || upper === "05") {
    return upper;
  }

  return undefined;
}

export function formatPorteCnpj(value?: string | null) {
  if (!value) {
    return "—";
  }

  return PORTE_LABELS[value] ?? value;
}
