"use server";

import { redirect } from "next/navigation";
import {
  createMusicaSessao,
  deleteMusica,
  deleteMusicaSessao,
  normalizePartes,
  patchMusicaSessao,
  listMusicaSessoes,
  saveMusica,
  saveMusicaSessao,
} from "@/lib/musicas";
import { invalidateMusicasCache } from "@/lib/admin/cache";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key).trim();
  return value || null;
}

export async function saveMusicaAction(formData: FormData) {
  const id = readOptionalString(formData, "id") ?? undefined;
  const titulo = readString(formData, "titulo").trim();
  const autor = readString(formData, "autor").trim();
  const tom = readOptionalString(formData, "tom");
  const versao = readOptionalString(formData, "versao");
  const status = readString(formData, "status").trim() as "ativa" | "rascunho" | "inativa";
  const observacoes = readOptionalString(formData, "observacoes");
  const partesRaw = readString(formData, "partes_json");

  if (!titulo || !autor) {
    redirect("/admin/reuniao-publica/musicas/nova?erro=preencha-titulo-autor");
  }

  let partes = normalizePartes([]);
  try {
    partes = normalizePartes(JSON.parse(partesRaw || "[]"));
  } catch {
    partes = [];
  }

  const musica = await saveMusica({
    id,
    titulo,
    autor,
    tom,
    versao,
    status: status === "rascunho" || status === "inativa" ? status : "ativa",
    observacoes,
    partes,
  });

  invalidateMusicasCache();
  const musicaId = musica?.id ?? id ?? "";
  redirect(`/admin/reuniao-publica/musicas/${musicaId}${musicaId ? "?salvo=1" : "/nova"}`);
}

export async function deleteMusicaAction(formData: FormData) {
  const id = readOptionalString(formData, "id");
  if (!id) {
    redirect("/admin/reuniao-publica/musicas?erro=musica-sem-id");
  }

  await deleteMusica(id);
  invalidateMusicasCache();
  redirect("/admin/reuniao-publica/musicas?excluida=1");
}

export async function saveMusicaSessaoAction(formData: FormData) {
  const codigo = readString(formData, "codigo_pareamento").trim();
  const nomeTela = readOptionalString(formData, "nome_tela");
  const musicaId = readOptionalString(formData, "musica_id");
  const modo = readString(formData, "modo").trim() as "exibicao" | "catalogo";
  const ativo = readString(formData, "ativo") === "on" || readString(formData, "ativo") === "true";

  if (!codigo) {
    redirect("/admin/reuniao-publica/musicas/sessoes?erro=codigo-pareamento");
  }

  await saveMusicaSessao({
    codigo_pareamento: codigo,
    nome_tela: nomeTela,
    musica_id: musicaId || null,
    modo: modo === "catalogo" ? "catalogo" : "exibicao",
    ativo,
    ultimo_acesso_em: new Date().toISOString(),
  });

  invalidateMusicasCache();
  redirect(`/admin/reuniao-publica/musicas/sessoes?codigo=${encodeURIComponent(codigo.toUpperCase())}&salvo=1`);
}

export async function createMusicaSessaoAction() {
  const sessao = await createMusicaSessao();
  invalidateMusicasCache();
  redirect(`/admin/reuniao-publica/musicas/sessoes?codigo=${encodeURIComponent(sessao.codigo_pareamento)}&nova=1`);
}

export async function setMusicaSessaoAtivaAction(formData: FormData) {
  const codigo = readString(formData, "codigo_pareamento").trim();
  const ativo = readString(formData, "ativo") === "true";

  if (!codigo) {
    redirect("/admin/reuniao-publica/musicas/sessoes?erro=codigo-pareamento");
  }

  const sessao = await patchMusicaSessao(codigo, {
    ativo,
    ultimo_acesso_em: new Date().toISOString(),
  });

  if (!sessao) {
    redirect(`/admin/reuniao-publica/musicas/sessoes?codigo=${encodeURIComponent(codigo.toUpperCase())}&erro=sessao-nao-encontrada`);
  }

  invalidateMusicasCache();

  const status = ativo ? "reativada" : "encerrada";
  redirect(`/admin/reuniao-publica/musicas/sessoes?codigo=${encodeURIComponent(codigo.toUpperCase())}&${status}=1`);
}

export async function encerrarTodasMusicaSessoesAction() {
  const sessoes = await listMusicaSessoes();
  const ativas = sessoes.filter((sessao) => sessao.ativo);

  if (ativas.length === 0) {
    redirect("/admin/reuniao-publica/musicas/sessoes?encerradas=0");
  }

  await Promise.all(
    ativas.map((sessao) =>
      patchMusicaSessao(sessao.codigo_pareamento, {
        ativo: false,
        ultimo_acesso_em: new Date().toISOString(),
      }),
    ),
  );

  invalidateMusicasCache();
  redirect(`/admin/reuniao-publica/musicas/sessoes?encerradas=${ativas.length}`);
}

export async function deleteMusicaSessaoAction(formData: FormData) {
  const codigo = readString(formData, "codigo_pareamento").trim();

  if (!codigo) {
    redirect("/admin/reuniao-publica/musicas/sessoes?erro=codigo-pareamento");
  }

  const sessoes = await listMusicaSessoes();
  const sessao = sessoes.find((s) => s.codigo_pareamento === codigo);

  if (!sessao) {
    redirect(`/admin/reuniao-publica/musicas/sessoes?erro=sessao-nao-encontrada`);
  }

  if (sessao.ativo) {
    redirect(`/admin/reuniao-publica/musicas/sessoes?erro=sessao-ativa`);
  }

  await deleteMusicaSessao(codigo);
  invalidateMusicasCache();
  redirect(`/admin/reuniao-publica/musicas/sessoes?excluida=1`);
}
