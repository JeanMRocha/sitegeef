import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - GEEF",
  description: "Entre ou crie sua conta no site do GEEF",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Acesso à conta</h1>
          <p>Entre com sua conta ou crie uma nova</p>
        </div>

        <LoginForm />

        <div className="login-footer">
          <p>
            Ao continuar, você concorda com nossa{" "}
            <a href="/privacidade">política de privacidade</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
