"use client";

import { useState } from "react";
import { SessaoActionsButton } from "./sessao-actions-button";
import type { MusicaResumo, MusicaSessao } from "@/lib/musicas";

type SessoesListProps = {
  initialSessoes: MusicaSessao[];
  musicas: MusicaResumo[];
};

export function SessoesList({ initialSessoes, musicas }: SessoesListProps) {
  const [sessoes, setSessoes] = useState(initialSessoes);

  const handleDelete = (codigo: string) => {
    setSessoes((prev) => prev.filter((s) => s.codigo_pareamento !== codigo));
  };

  const handleUpdate = (codigo: string, updatedSessao: MusicaSessao) => {
    setSessoes((prev) =>
      prev.map((s) => (s.codigo_pareamento === codigo ? updatedSessao : s))
    );
  };

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome da tela</th>
          <th>Modo</th>
          <th>Música</th>
          <th>Status</th>
          <th style={{ textAlign: "right" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {sessoes.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
              Nenhuma sessão criada
            </td>
          </tr>
        ) : (
          sessoes.map((sessao) => {
            const musica = musicas.find((item) => item.id === sessao.musica_id);

            return (
              <tr key={sessao.id}>
                <td style={{ fontWeight: 600, fontFamily: "monospace" }}>
                  {sessao.codigo_pareamento}
                </td>
                <td>{sessao.nome_tela || "—"}</td>
                <td>{sessao.modo === "exibicao" ? "Exibição" : "Catálogo"}</td>
                <td>{musica ? musica.titulo : "Nenhuma"}</td>
                <td>
                  <span
                    className="inline-status"
                    style={{
                      backgroundColor: sessao.ativo
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(107, 114, 128, 0.2)",
                      color: sessao.ativo ? "#16a34a" : "#6b7280",
                    }}
                  >
                    {sessao.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <SessaoActionsButton
                    sessao={sessao}
                    onUpdate={(updated) => handleUpdate(sessao.codigo_pareamento, updated)}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
