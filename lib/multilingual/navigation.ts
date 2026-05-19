import { navItems, type NavItem } from "@/lib/site-data";
import type { Locale } from "./constants";

export function getLocalizedNavItems(locale: Locale): NavItem[] {
  return navItems.map((item) => ({
    ...item,
    label: locale === "en" && item.labelEn ? item.labelEn : item.label,
  }));
}

export function getInstitutionalNavItems(locale: Locale): NavItem[] {
  return getLocalizedNavItems(locale).filter((item) => item.group === "institucional");
}
