import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - GEEF",
  description: "Entre ou crie sua conta no site do GEEF",
};

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
    popup?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const isPopup = resolvedSearchParams?.popup === "1";
  const nextUrl = resolvedSearchParams?.next || "/perfil";

  return (
    <main className={`login-page ${isPopup ? "login-page-popup" : ""}`}>
      <div className="login-modal">
        <div className="login-modal-head">
          <div>
            <p className="eyebrow">GEEF</p>
            <h1>Acesso à conta</h1>
            <p className="login-modal-lead">
              Entre para continuar no ecossistema GEEF com a sua área pessoal.
            </p>
          </div>

          <Link href="/" className="login-close-link" aria-label="Fechar login">
            ×
          </Link>
        </div>

        <LoginForm nextUrl={nextUrl} />

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
