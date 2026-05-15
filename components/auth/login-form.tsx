"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/app/login/actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/perfil";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        if (result?.error) {
          setError(result.error);
        }
      } else {
        if (!nomeCompleto.trim()) {
          setError("Nome completo é obrigatório");
          return;
        }
        const result = await signUpWithEmail(email, password, nomeCompleto);
        if (result?.error) {
          setError(result.error);
        } else {
          setError(null);
          setEmail("");
          setPassword("");
          setNomeCompleto("");
          alert("Cadastro realizado! Verifique seu email para confirmar.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError("Erro ao processar requisição");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Erro ao conectar com Google");
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-tabs">
        <button
          className={`login-tab ${isLogin ? "active" : ""}`}
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
        >
          Entrar
        </button>
        <button
          className={`login-tab ${!isLogin ? "active" : ""}`}
          onClick={() => {
            setIsLogin(false);
            setError(null);
          }}
        >
          Cadastro
        </button>
      </div>

      <form onSubmit={handleEmailAuth} className="login-form">
        {error && (
          <div className="login-error">
            <p>{error}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="nomeCompleto">Nome completo</label>
            <input
              id="nomeCompleto"
              type="text"
              placeholder="Seu nome completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      <div className="login-divider">
        <span>ou</span>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="button button-secondary"
        disabled={loading}
      >
        {loading ? "Conectando..." : "Entrar com Google"}
      </button>
    </div>
  );
}
