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

  const setLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

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
    <div className="site-language-switcher" aria-label={copy.header.language}>
      <button
        type="button"
        className={`site-language-switcher-button ${locale === "pt" ? "active" : ""}`}
        aria-pressed={locale === "pt"}
        onClick={() => setLocale("pt")}
        title={copy.header.portuguese}
      >
        PT
      </button>
      <button
        type="button"
        className={`site-language-switcher-button ${locale === "en" ? "active" : ""}`}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        title={copy.header.english}
      >
        EN
      </button>
    </div>
  );
}
