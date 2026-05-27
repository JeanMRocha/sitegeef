"use client";

import { useState } from "react";
import { IconPower, IconTrash, IconExternalLink, IconEdit } from "@/components/icons";
import Link from "next/link";
import type { MusicaSessao } from "@/lib/musicas";
import { setMusicaSessaoAtivaAction, deleteMusicaSessaoAction } from "@/app/admin/reuniao-publica/musicas/actions";

type SessaoActionsButtonProps = {
  sessao: MusicaSessao;
  onUpdate?: (sessao: MusicaSessao) => void;
  onDelete?: (codigo: string) => void;
};

export function SessaoActionsButton({ sessao: initialSessao, onUpdate, onDelete }: SessaoActionsButtonProps) {
  const [sessao, setSessao] = useState(initialSessao);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const result = await setMusicaSessaoAtivaAction(sessao.codigo_pareamento, !sessao.ativo);
      setSessao(result);
      onUpdate?.(result);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar sessão");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a sessão ${sessao.codigo_pareamento}?`)) {
      return;
    }
    setLoading(true);
    try {
      await deleteMusicaSessaoAction(sessao.codigo_pareamento);
      onDelete?.(sessao.codigo_pareamento);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir sessão");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
      <Link
        href={`/admin/reuniao-publica/musicas/sessoes/novo?codigo=${sessao.codigo_pareamento}`}
        className="admin-btn admin-btn-small"
        title="Editar"
      >
        <IconEdit size={16} />
      </Link>
      <Link
        href={`/musicas/exibir/${sessao.codigo_pareamento}`}
        className="admin-btn admin-btn-small"
        target="_blank"
        rel="noreferrer"
        title="Abrir em nova aba"
      >
        <IconExternalLink size={16} />
      </Link>
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className="admin-btn admin-btn-small"
        style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.25)" }}
        title={sessao.ativo ? "Encerrar sessão" : "Reativar sessão"}
      >
        <IconPower size={16} />
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="admin-btn admin-btn-small"
        style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.25)" }}
        title="Excluir sessão"
      >
        <IconTrash size={16} />
      </button>
    </div>
  );
}
