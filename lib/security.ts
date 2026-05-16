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

function isLocalhostHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function tryParseOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

function getConfiguredOrigin() {
  return tryParseOrigin(process.env.NEXT_PUBLIC_SITE_URL);
}

function getForwardedOrigin(headers: Headers) {
  const forwardedProto = headers.get("x-forwarded-proto");
  const forwardedHost = headers.get("x-forwarded-host");
  const host = headers.get("host");
  const originHeader = headers.get("origin");

  if (forwardedProto && forwardedHost) {
    const candidate = `${forwardedProto}://${forwardedHost}`;
    const parsed = tryParseOrigin(candidate);

    if (parsed && !isLocalhostHost(new URL(parsed).hostname)) {
      return parsed;
    }
  }

  if (originHeader) {
    const parsed = tryParseOrigin(originHeader);

    if (parsed && !isLocalhostHost(new URL(parsed).hostname)) {
      return parsed;
    }
  }

  if (host) {
    const scheme = forwardedProto || "https";
    const parsed = tryParseOrigin(`${scheme}://${host}`);

    if (parsed && !isLocalhostHost(new URL(parsed).hostname)) {
      return parsed;
    }
  }

  return null;
}

export function getAppOrigin(headers?: Headers) {
  const forwardedOrigin = headers ? getForwardedOrigin(headers) : null;

  if (forwardedOrigin) {
    return forwardedOrigin;
  }

  const configuredOrigin = getConfiguredOrigin();

  if (configuredOrigin && !isLocalhostHost(new URL(configuredOrigin).hostname)) {
    return configuredOrigin;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3500";
  }

  throw new Error(
    "Unable to resolve the public site origin. Set NEXT_PUBLIC_SITE_URL or provide forwarded request headers."
  );
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
