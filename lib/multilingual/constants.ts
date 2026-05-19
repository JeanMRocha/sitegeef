export const MULTILINGUAL_COOKIE_NAME = "geef_locale";

export const SUPPORTED_LOCALES = ["pt", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(value?: string | null): Locale {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "en" || normalized?.startsWith("en-")) {
    return "en";
  }

  if (normalized === "pt" || normalized?.startsWith("pt-")) {
    return "pt";
  }

  return "pt";
}

export function getHtmlLang(locale: Locale) {
  return locale === "en" ? "en" : "pt-BR";
}
