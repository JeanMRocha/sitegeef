"use client";

import { useRouter } from "next/navigation";
import { getMultilingualCopy, MULTILINGUAL_COOKIE_NAME, type Locale } from "@/lib/multilingual/client";

type LanguageSwitcherProps = {
  locale: Locale;
  onLocaleChange?: () => void;
};

export function LanguageSwitcher({ locale, onLocaleChange }: Readonly<LanguageSwitcherProps>) {
  const router = useRouter();
  const copy = getMultilingualCopy(locale);
  const nextLocale = locale === "pt" ? "en" : "pt";

  const setLocale = () => {
    document.cookie = `${MULTILINGUAL_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    try {
      localStorage.setItem(MULTILINGUAL_COOKIE_NAME, nextLocale);
    } catch {
      // Cookie already persists the selected locale.
    }

    onLocaleChange?.();
    router.refresh();
  };

  return (
    <button
      type="button"
      className="site-language-switcher site-icon-toggle"
      aria-label={`${copy.header.language}: ${locale === "pt" ? copy.header.english : copy.header.portuguese}`}
      title={`${copy.header.language}: ${locale === "pt" ? copy.header.english : copy.header.portuguese}`}
      onClick={setLocale}
    >
      <span aria-hidden="true">🌐</span>
    </button>
  );
}
