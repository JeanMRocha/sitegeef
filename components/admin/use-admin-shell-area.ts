"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export type AdminShellArea =
  | "painel"
  | "perfil"
  | "pessoas"
  | "governanca"
  | "documentos"
  | "operacao"
  | "sistema";

export type AdminShellAreaItem = {
  key: AdminShellArea;
  label: string;
  note: string;
};

export const ADMIN_SHELL_AREAS: AdminShellAreaItem[] = [
  { key: "painel", label: "Painel", note: "Resumo" },
  { key: "perfil", label: "Perfil", note: "Conta e acesso" },
  { key: "pessoas", label: "Pessoas", note: "Cadastro e vínculo" },
  { key: "governanca", label: "Governança", note: "Gestão e direção" },
  { key: "documentos", label: "Documentos", note: "LGPD e registros" },
  { key: "operacao", label: "Operação", note: "Rotinas do dia a dia" },
  { key: "sistema", label: "Sistema", note: "Saúde e suporte" },
];

const STORAGE_KEY = "admin-shell-area";
const AREA_CHANGED_EVENT = "admin-shell-area-change";

export function getAdminShellAreaFromPath(pathname?: string | null): AdminShellArea {
  if (!pathname) {
    return "painel";
  }

  if (pathname.startsWith("/admin/governanca")) return "governanca";
  if (pathname.startsWith("/admin/documentos") || pathname.startsWith("/admin/lgpd")) return "documentos";
  if (pathname.startsWith("/admin/pessoas") || pathname.startsWith("/admin/usuarios") || pathname.startsWith("/admin/instituicao")) {
    return "pessoas";
  }
  if (
    pathname.startsWith("/admin/atendimento") ||
    pathname.startsWith("/admin/biblioteca") ||
    pathname.startsWith("/admin/livraria") ||
    pathname.startsWith("/admin/apse") ||
    pathname.startsWith("/admin/comunicacao") ||
    pathname.startsWith("/admin/escalas") ||
    pathname.startsWith("/admin/evangelizacao") ||
    pathname.startsWith("/admin/juventude") ||
    pathname.startsWith("/admin/estudos") ||
    pathname.startsWith("/admin/financeiro") ||
    pathname.startsWith("/admin/patrimonio") ||
    pathname.startsWith("/admin/reunioes-virtuais") ||
    pathname.startsWith("/admin/planejamento") ||
    pathname.startsWith("/admin/notificacoes") ||
    pathname.startsWith("/admin/relatorios")
  ) {
    return "operacao";
  }
  if (
    pathname.startsWith("/admin/observability") ||
    pathname.startsWith("/admin/migrations") ||
    pathname.startsWith("/admin/idiomas") ||
    pathname.startsWith("/admin/fix-usuarios")
  ) {
    return "sistema";
  }

  if (pathname.startsWith("/perfil") || pathname.startsWith("/minha-area")) {
    return "perfil";
  }

  return "painel";
}

export function useAdminShellArea() {
  const pathname = usePathname();
  const derivedArea = useMemo(() => getAdminShellAreaFromPath(pathname), [pathname]);
  const [area, setArea] = useState<AdminShellArea>(derivedArea);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AdminShellArea | null;
    setArea(saved ?? derivedArea);
  }, [derivedArea]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const next = (event.newValue as AdminShellArea | null) ?? derivedArea;
      setArea(next);
    };

    const onAreaChange = (event: Event) => {
      const customEvent = event as CustomEvent<AdminShellArea>;
      if (!customEvent.detail) {
        return;
      }

      setArea(customEvent.detail);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(AREA_CHANGED_EVENT, onAreaChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AREA_CHANGED_EVENT, onAreaChange as EventListener);
    };
  }, [derivedArea]);

  const setSelectedArea = (nextArea: AdminShellArea) => {
    window.localStorage.setItem(STORAGE_KEY, nextArea);
    setArea(nextArea);
    window.dispatchEvent(new CustomEvent(AREA_CHANGED_EVENT, { detail: nextArea }));
  };

  return { area, setSelectedArea, areas: ADMIN_SHELL_AREAS, derivedArea };
}
