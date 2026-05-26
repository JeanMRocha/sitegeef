"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type ErrorCaptureProps = {
  error: Error & { digest?: string };
  reset: () => void;
  scope: string;
  root?: boolean;
};

function ErrorBody({ error, reset, scope }: Omit<ErrorCaptureProps, "root">) {
  const reportedRef = useRef<string | null>(null);

  useEffect(() => {
    const fingerprint = `${scope}:${error.digest ?? error.message}`;

    if (reportedRef.current === fingerprint) {
      return;
    }

    reportedRef.current = fingerprint;

    void fetch("/api/ops-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: scope,
        eventType: "log",
        level: "error",
        message: error.message || "Erro não identificado",
        happenedAt: new Date().toISOString(),
        payload: {
          digest: error.digest ?? null,
          stack: error.stack ?? null,
          name: error.name ?? null,
          href: typeof window !== "undefined" ? window.location.href : null,
          pathname: typeof window !== "undefined" ? window.location.pathname : null,
        },
      }),
      keepalive: true,
    }).catch(() => {
      // Avoid cascading failures if observability is unavailable.
    });
  }, [error, scope]);

  return (
    <div className="error-shell">
      <div className="error-card">
        <p className="error-kicker">Módulo de erros</p>
        <h1>Ocorreu um erro na aplicação</h1>
        <p className="error-summary">
          O incidente foi capturado automaticamente e está pronto para análise na central de observabilidade.
        </p>

        <div className="error-meta">
          <span className="error-badge">{scope}</span>
          {error.digest ? <span className="error-badge">digest {error.digest}</span> : null}
        </div>

        <div className="error-actions">
          <button type="button" className="button button-primary" onClick={reset}>
            Tentar novamente
          </button>
          <Link href="/" className="button button-secondary">
            Ir para a home
          </Link>
          <Link href="/admin/sistema" className="button button-secondary">
            Abrir central
          </Link>
        </div>

        <details className="error-details">
          <summary>Detalhes técnicos</summary>
          <pre>{error.stack || error.message}</pre>
        </details>
      </div>
    </div>
  );
}

export function ErrorCaptureCard(props: ErrorCaptureProps) {
  return <ErrorBody {...props} />;
}
