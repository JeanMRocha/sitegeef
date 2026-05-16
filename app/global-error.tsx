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
    <html lang="pt-BR">
      <body>
        <ErrorCaptureCard error={error} reset={reset} scope="app/global-error" />
      </body>
    </html>
  );
}
