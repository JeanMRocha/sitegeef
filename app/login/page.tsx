import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - GEEF",
  description: "Entre ou crie sua conta no site do GEEF",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <div>
            <p className="eyebrow">GEEF</p>
            <h1>Acesso à conta</h1>
            <p>
              Entre para consultar sua área, acompanhar serviços e manter seus
              dados atualizados com uma experiência mais clara e tranquila.
            </p>

            <ul className="login-note-list">
              <li>
                <span className="login-note-dot" aria-hidden="true" />
                Entradas e cadastros com validação mais simples.
              </li>
              <li>
                <span className="login-note-dot" aria-hidden="true" />
                Perfil e área do usuário com o mesmo padrão visual.
              </li>
              <li>
                <span className="login-note-dot" aria-hidden="true" />
                Acesso seguro para continuar de onde parou.
              </li>
            </ul>
          </div>

          <div className="public-trust-grid" style={{ marginTop: "1.5rem" }}>
            <div className="public-trust-item">
              <strong>01</strong>
              <span>Login e cadastro no mesmo fluxo.</span>
            </div>
            <div className="public-trust-item">
              <strong>02</strong>
              <span>Perfil e área interna padronizados.</span>
            </div>
            <div className="public-trust-item">
              <strong>03</strong>
              <span>Visual alinhado ao site e ERP.</span>
            </div>
            <div className="public-trust-item">
              <strong>04</strong>
              <span>Acesso com foco na leitura rápida.</span>
            </div>
          </div>
        </section>

        <div className="login-panel">
          <div className="login-header">
            <h1>Entre ou crie sua conta</h1>
            <p>Use seu email para continuar no ecossistema GEEF.</p>
          </div>

          <LoginForm />

          <div className="login-footer">
            <p>
              Ao continuar, você concorda com nossa{" "}
              <a href="/privacidade">política de privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
