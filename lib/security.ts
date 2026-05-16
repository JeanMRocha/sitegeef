import { type NextRequest } from "next/server";

export function normalizeInternalPath(
  value: string | null | undefined,
  fallback = "/perfil"
) {
  if (!value) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);

    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      decoded.includes("://")
    ) {
      return fallback;
    }

    return decoded;
  } catch {
    return fallback;
  }
}

export function getAppOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fall through to localhost below.
    }
  }

  return "http://localhost:3500";
}

export function getRequestOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");

  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}
