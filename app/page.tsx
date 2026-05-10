export default function Home() {
  return (
    <main className="maintenance">
      <section className="card" aria-label="Site em manutenção">
        <p className="eyebrow">GEEF</p>
        <h1>Em manutenção</h1>
        <p className="lead">
          A nova versão entra em produção automaticamente a cada push na branch
          <code>main</code>.
        </p>
        <div className="status">
          <span className="dot" aria-hidden="true" />
          Atualização via GitHub Actions
        </div>
      </section>
    </main>
  );
}
