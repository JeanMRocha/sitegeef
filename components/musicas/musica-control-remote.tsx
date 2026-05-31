"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Musica, MusicaSessao } from "@/lib/musicas";
import { setMusicaAtualAction } from "@/app/musicas/controle/[codigo]/actions";

type MusicaControlRemoteProps = {
  codigo: string;
  initialSessao: MusicaSessao;
  musicas: Musica[];
};

export function MusicaControlRemote({ codigo, initialSessao, musicas }: MusicaControlRemoteProps) {
  const [sessao, setSessao] = useState(initialSessao);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const filteredMusicas = musicas.filter(
    (m) =>
      m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDisplayPopup = useCallback(() => {
    if (typeof window === "undefined") return;

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    popupRef.current = window.open(
      "/musicas/exibir?popup=1",
      "geef-musica-exibicao",
      "popup=yes,width=1280,height=720"
    );
  }, []);

  const handleSelectMusica = useCallback(
    async (musicaId: string) => {
      if (musicaId === sessao.musica_id) {
        return;
      }

      setLoading(true);
      try {
        const newSessao = await setMusicaAtualAction(codigo, musicaId);
        setSessao(newSessao);
      } catch (error) {
        console.error("Erro ao selecionar música:", error);
      } finally {
        setLoading(false);
      }
    },
    [codigo, sessao.musica_id]
  );

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    async function refresh() {
      try {
        const response = await fetch(`/api/musicas/sessoes/${encodeURIComponent(codigo)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { sessao: MusicaSessao };
        if (!cancelled) {
          setSessao(data.sessao);
          if (!data.sessao.ativo) {
            window.clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar sessão:", error);
      }
    }

    intervalId = window.setInterval(refresh, 3000);

    return () => {
      cancelled = true;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [codigo]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-light, #ffffff)",
        paddingBottom: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "var(--primary, #8a005a)",
          color: "white",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Controle de Sessão</h1>
          <button
            type="button"
            onClick={openDisplayPopup}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Abrir exibição
          </button>
        </div>
        <input
          type="search"
          placeholder="Buscar música..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            border: "none",
            borderRadius: "0.5rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          padding: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredMusicas.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "3rem 1rem",
              textAlign: "center",
              color: "var(--text-muted, #666)",
            }}
          >
            <p style={{ fontSize: "1.1rem", margin: 0 }}>Nenhuma música encontrada</p>
          </div>
        ) : (
          filteredMusicas.map((musica) => {
            const isActive = musica.id === sessao.musica_id;

            return (
              <button
                key={musica.id}
                onClick={() => handleSelectMusica(musica.id)}
                disabled={loading}
                style={{
                  padding: "1.5rem",
                  backgroundColor: isActive ? "var(--primary, #8a005a)" : "white",
                  color: isActive ? "white" : "var(--text-dark, #333)",
                  border: isActive ? "3px solid var(--primary, #8a005a)" : "2px solid var(--border-medium, #ddd)",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  opacity: loading && !isActive ? 0.5 : 1,
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  boxShadow: isActive ? "0 4px 12px rgba(138, 0, 90, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
                  {musica.titulo}
                </h2>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", opacity: isActive ? 0.9 : 0.7 }}>
                  {musica.autor}
                </p>
                {musica.tom && (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", opacity: isActive ? 0.8 : 0.6 }}>
                    Tom: {musica.tom}
                  </p>
                )}
                {isActive && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      opacity: 0.9,
                    }}
                  >
                    ✓ Exibindo agora
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          h1 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
