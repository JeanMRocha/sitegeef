"use client";

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
        <main className="error-shell">
          <div className="error-card">
            <p className="error-kicker">Módulo global de erros</p>
            <h1>Ocorreu um erro na aplicação</h1>
            <p className="error-summary">
              A aplicação encontrou um erro inesperado. Tente recarregar a página.
            </p>

            <div className="error-actions">
              <button type="button" className="button button-primary" onClick={reset}>
                Tentar novamente
              </button>
              <a href="/" className="button button-secondary">
                Ir para a home
              </a>
            </div>

            <details className="error-details">
              <summary>Detalhes técnicos</summary>
              <pre>{error.stack || error.message}</pre>
            </details>
          </div>
        </main>
      </body>
    </html>
  );
}
