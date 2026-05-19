export const LGPD_VERSIONS = {
  cookies: "2026-05-18",
  privacy: "2026-05-18",
  terms: "2026-05-18",
  formNotice: "2026-05-18",
} as const;

export const LGPD_COOKIE_NAME = "geef_lgpd_cookies";

export const LGPD_CATEGORIES = [
  "cookies",
  "privacidade",
  "termos_uso",
  "marketing",
  "whatsapp",
  "sensivel",
  "crianca",
  "upload",
  "checkout",
  "login",
  "finalidade_nova",
] as const;

export type LgpdCategoria = (typeof LGPD_CATEGORIES)[number];
export type LgpdStatus = "registrado" | "aceito" | "recusado" | "ciencia" | "revogado" | "informado";
