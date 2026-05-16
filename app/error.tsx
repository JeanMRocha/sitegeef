"use client";

import { ErrorCaptureCard } from "@/components/error-capture";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorCaptureCard error={error} reset={reset} scope="app/error" />;
}
