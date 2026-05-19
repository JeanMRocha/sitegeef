import { cookies } from "next/headers";
import { MULTILINGUAL_COOKIE_NAME, normalizeLocale, type Locale } from "./constants";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(MULTILINGUAL_COOKIE_NAME)?.value);
}
