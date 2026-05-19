"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LGPD_COOKIE_NAME } from "@/lib/lgpd/constants";

type CookiePrefs = {
  version: string;
  essential: true;
  marketing: boolean;
  analytics: boolean;
  tracking: boolean;
  decision: "accept_all" | "reject_non_essential" | "custom";
};

const DEFAULT_PREFS: CookiePrefs = {
  version: "2026-05-18",
  essential: true,
  marketing: false,
  analytics: false,
  tracking: false,
  decision: "reject_non_essential",
};

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const parts = document.cookie.split(";").map((item) => item.trim());
  const match = parts.find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function writeCookie(value: CookiePrefs) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${LGPD_COOKIE_NAME}=${encoded}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem(LGPD_COOKIE_NAME, encoded);
  } catch {
    // A escolha já ficou salva no cookie.
  }
}

async function persistPrefs(payload: Record<string, unknown>) {
  await fetch("/api/lgpd/registros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function LgpdCookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stored = readCookie(LGPD_COOKIE_NAME);

    if (!stored) {
      try {
        stored = localStorage.getItem(LGPD_COOKIE_NAME);
      } catch {
        stored = null;
      }
    }

    if (!stored) {
      setIsVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(stored)) as CookiePrefs;
      setMarketing(Boolean(parsed.marketing));
      setAnalytics(Boolean(parsed.analytics));
      setTracking(Boolean(parsed.tracking));
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveChoice = async (decision: CookiePrefs["decision"], prefs: Omit<CookiePrefs, "version" | "essential" | "decision">) => {
    const payload: CookiePrefs = {
      version: DEFAULT_PREFS.version,
      essential: true,
      decision,
      ...prefs,
    };

    setBusy(true);
    try {
      writeCookie(payload);
      setIsVisible(false);
      await persistPrefs({
        categoria: "cookies",
        acao: decision,
        status: decision === "accept_all" ? "aceito" : decision === "reject_non_essential" ? "recusado" : "ciencia",
        versao: payload.version,
        escopo: {
          essential: true,
          marketing: payload.marketing,
          analytics: payload.analytics,
          tracking: payload.tracking,
        },
        origem: "banner-cookies",
        canal: "web",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="lgpd-cookie-banner" role="dialog" aria-label="Preferências de cookies">
      <div className="lgpd-cookie-banner-copy">
        <p className="eyebrow">Cookies</p>
        <h2>Usamos apenas o necessário para o site funcionar bem.</h2>
        <p>
          Cookies essenciais ficam ativos. Os demais dependem da sua escolha.
          Você pode mudar isso depois na Política de Cookies.
        </p>
      </div>

      <div className="lgpd-cookie-banner-actions">
        <button
          type="button"
          className="button button-primary lgpd-cookie-primary"
          disabled={busy}
          onClick={() =>
            void saveChoice("accept_all", {
              marketing: true,
              analytics: true,
              tracking: true,
            })
          }
        >
          Aceitar todos
        </button>
        <button
          type="button"
          className="button button-secondary lgpd-cookie-secondary"
          disabled={busy}
          onClick={() =>
            void saveChoice("reject_non_essential", {
              marketing: false,
              analytics: false,
              tracking: false,
            })
          }
        >
          Rejeitar não essenciais
        </button>
        <button
          type="button"
          className="button button-secondary lgpd-cookie-secondary"
          disabled={busy}
          onClick={() => setShowManager((value) => !value)}
        >
          Gerenciar preferências
        </button>
        <Link href="/cookies" className="lgpd-cookie-link">
          Política de Cookies
        </Link>
      </div>

      {showManager && (
        <div className="lgpd-cookie-manager">
          <label className="lgpd-switch">
            <input type="checkbox" checked disabled />
            <span>
              <strong>Essenciais</strong>
              <small>Necessários para login, segurança e navegação básica.</small>
            </span>
          </label>
          <label className="lgpd-switch">
            <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            <span>
              <strong>Marketing</strong>
              <small>Comunicações, ofertas e remarketing.</small>
            </span>
          </label>
          <label className="lgpd-switch">
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            <span>
              <strong>Analytics</strong>
              <small>Medição não essencial de uso e navegação.</small>
            </span>
          </label>
          <label className="lgpd-switch">
            <input type="checkbox" checked={tracking} onChange={(event) => setTracking(event.target.checked)} />
            <span>
              <strong>Rastreamento</strong>
              <small>Mensuração de campanha e comportamento.</small>
            </span>
          </label>
          <button
            type="button"
            className="button button-primary lgpd-cookie-save"
            disabled={busy}
            onClick={() =>
              void saveChoice("custom", {
                marketing,
                analytics,
                tracking,
              })
            }
          >
            Salvar preferências
          </button>
        </div>
      )}
    </div>
  );
}
