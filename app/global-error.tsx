"use client";

import { ErrorCaptureCard } from "@/components/error-capture";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCaptureCard error={error} reset={reset} scope="app/global-error" />
  );
}
