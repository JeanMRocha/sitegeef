import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type MusicaParteTipo = "estrofe" | "refrao" | "ponte" | "intro" | "cifra";
export type MusicaSessaoModo = "exibicao" | "catalogo";

export type MusicaParte = {
  id?: string;
  ordem: number;
  tipo: MusicaParteTipo;
  titulo: string;
  conteudo: string;
  cifra?: string;
  destaque: boolean;
};

export type Musica = {
  id: string;
  slug: string;
  titulo: string;
  autor: string;
  tom: string | null;
  versao: string | null;
  status: "ativa" | "rascunho" | "inativa";
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
  partes: MusicaParte[];
};

export type MusicaSessao = {
  id: string;
  codigo_pareamento: string;
  nome_tela: string | null;
  musica_id: string | null;
  modo: MusicaSessaoModo;
  ativo: boolean;
  ultimo_acesso_em: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type MusicaResumo = {
  id: string;
  slug: string;
  titulo: string;
  autor: string;
  tom: string | null;
  versao: string | null;
  status: Musica["status"];
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
};

type MusicaParteRow = Omit<MusicaParte, "destaque"> & { destaque?: boolean };

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function slugifyMusica(title: string, suffix?: string) {
  const base = normalizeText(title)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "musica";

  return suffix ? `${base}-${suffix}` : base;
}

export function generatePairingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function normalizePartes(partes: unknown): MusicaParte[] {
  if (!Array.isArray(partes)) {
    return [];
  }

  const normalizadas = partes
    .map((parte, index) => {
      if (!parte || typeof parte !== "object") {
        return null;
      }

      const item = parte as Partial<MusicaParteRow>;
      const conteudo = typeof item.conteudo === "string" ? item.conteudo.trim() : "";
      if (!conteudo) {
        return null;
      }

      const tipo: MusicaParteTipo =
        item.tipo === "refrao" || item.tipo === "ponte" || item.tipo === "intro" || item.tipo === "cifra"
          ? item.tipo
          : "estrofe";

      return {
        id: typeof item.id === "string" ? item.id : undefined,
        ordem: Number.isFinite(item.ordem) ? Number(item.ordem) : index + 1,
        tipo,
        titulo: typeof item.titulo === "string" ? item.titulo.trim() : "",
        conteudo,
        cifra: typeof item.cifra === "string" && item.cifra.trim() ? item.cifra.trim() : undefined,
        destaque: item.destaque === true,
      } satisfies MusicaParte;
    })
    .filter(Boolean) as MusicaParte[];

  return normalizadas
    .sort((a, b) => a.ordem - b.ordem)
    .map((item, index) => ({
      ...item,
      ordem: index + 1,
    })) as MusicaParte[];
}

export function formatParteTipoLabel(tipo: MusicaParteTipo) {
  switch (tipo) {
    case "refrao":
      return "Refrão";
    case "ponte":
      return "Ponte";
    case "intro":
      return "Introdução";
    case "cifra":
      return "Cifra";
    default:
      return "Estrofe";
  }
}

function buildSearchBlob(musica: Pick<Musica, "titulo" | "autor" | "tom" | "versao" | "observacoes" | "partes">) {
  return normalizeText(
    [
      musica.titulo,
      musica.autor,
      musica.tom ?? "",
      musica.versao ?? "",
      musica.observacoes ?? "",
      ...musica.partes.flatMap((parte) => [parte.titulo, parte.conteudo, parte.cifra ?? ""]),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function musicaMatchesSearch(musica: Pick<Musica, "titulo" | "autor" | "tom" | "versao" | "observacoes" | "partes">, search: string) {
  const normalizedSearch = normalizeText(search);
  if (!normalizedSearch) {
    return true;
  }

  return buildSearchBlob(musica).includes(normalizedSearch);
}

async function fetchMusicasBase() {
  const supabase = createServiceRoleClient();

  const [musicasResult, partesResult] = await Promise.all([
    supabase
      .from("musicas")
      .select("id, slug, titulo, autor, tom, versao, status, observacoes, criado_em, atualizado_em")
      .order("titulo", { ascending: true }),
    supabase
      .from("musica_partes")
      .select("id, musica_id, ordem, tipo, titulo, conteudo, cifra, destaque")
      .order("musica_id", { ascending: true })
      .order("ordem", { ascending: true }),
  ]);

  const musicas = musicasResult.data ?? [];
  const partes = partesResult.data ?? [];

  const partesPorMusica = partes.reduce<Record<string, MusicaParte[]>>((acc, parte) => {
    const musicaId = parte.musica_id as string;
    if (!acc[musicaId]) {
      acc[musicaId] = [];
    }

    acc[musicaId].push({
      id: parte.id,
      ordem: parte.ordem,
      tipo: parte.tipo as MusicaParteTipo,
      titulo: parte.titulo ?? "",
      conteudo: parte.conteudo ?? "",
      cifra: parte.cifra ?? undefined,
      destaque: parte.destaque ?? false,
    });

    return acc;
  }, {});

  return musicas.map((musica) => ({
    ...musica,
    partes: partesPorMusica[musica.id] ?? [],
  })) as Musica[];
}

export async function listMusicas(search = "") {
  const musicas = await fetchMusicasBase();
  return musicas.filter((musica) => musicaMatchesSearch(musica, search));
}

export async function listPublicMusicas(search = "") {
  const musicas = await fetchMusicasBase();
  return musicas.filter((musica) => musica.status === "ativa" && musicaMatchesSearch(musica, search));
}

export async function getMusicaBySlug(slug: string) {
  const musicas = await fetchMusicasBase();
  return musicas.find((musica) => musica.slug === slug) ?? null;
}

export async function getMusicaById(id: string) {
  const musicas = await fetchMusicasBase();
  return musicas.find((musica) => musica.id === id) ?? null;
}

export async function getMusicasResumo() {
  const musicas = await fetchMusicasBase();
  return musicas.map(({ partes, ...rest }) => rest);
}

export async function getMusicaSessaoByCodigo(codigo: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("musica_sessoes")
    .select("id, codigo_pareamento, nome_tela, musica_id, modo, ativo, ultimo_acesso_em, criado_em, atualizado_em")
    .eq("codigo_pareamento", codigo)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as MusicaSessao;
}

export async function getMusicaSessaoComMusica(codigo: string) {
  const sessao = await getMusicaSessaoByCodigo(codigo);
  if (!sessao) {
    return null;
  }

  const musica = sessao.musica_id ? await getMusicaById(sessao.musica_id) : null;
  return { sessao, musica };
}

export async function listMusicaSessoes() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("musica_sessoes")
    .select("id, codigo_pareamento, nome_tela, musica_id, modo, ativo, ultimo_acesso_em, criado_em, atualizado_em")
    .order("atualizado_em", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as MusicaSessao[];
}

export type SaveMusicaInput = {
  id?: string;
  titulo: string;
  autor: string;
  tom?: string | null;
  versao?: string | null;
  status?: Musica["status"];
  observacoes?: string | null;
  partes: MusicaParte[];
};

export async function saveMusica(input: SaveMusicaInput) {
  const supabase = createServiceRoleClient();
  const musicaId = input.id ?? crypto.randomUUID();

  const existing = await supabase.from("musicas").select("id, slug").eq("id", musicaId).maybeSingle();
  const slug = existing.data?.slug ?? slugifyMusica(input.titulo, musicaId.slice(0, 8));

  const musicaPayload = {
    id: musicaId,
    slug,
    titulo: input.titulo.trim(),
    autor: input.autor.trim(),
    tom: input.tom?.trim() || null,
    versao: input.versao?.trim() || null,
    status: input.status ?? "ativa",
    observacoes: input.observacoes?.trim() || null,
  };

  if (existing.data) {
    const { error } = await supabase.from("musicas").update(musicaPayload).eq("id", musicaId);
    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("musicas").insert([musicaPayload]);
    if (error) {
      throw error;
    }
  }

  await supabase.from("musica_partes").delete().eq("musica_id", musicaId);

  if (input.partes.length > 0) {
    const partesPayload = input.partes.map((parte) => ({
      musica_id: musicaId,
      ordem: parte.ordem,
      tipo: parte.tipo,
      titulo: parte.titulo || null,
      conteudo: parte.conteudo,
      cifra: parte.cifra || null,
      destaque: parte.destaque,
    }));

    const { error } = await supabase.from("musica_partes").insert(partesPayload);
    if (error) {
      throw error;
    }
  }

  return getMusicaById(musicaId);
}

export async function deleteMusica(id: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("musicas").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export type SaveMusicaSessaoInput = {
  codigo_pareamento: string;
  nome_tela?: string | null;
  musica_id?: string | null;
  modo?: MusicaSessaoModo;
  ativo?: boolean;
  ultimo_acesso_em?: string | null;
};

export async function saveMusicaSessao(input: SaveMusicaSessaoInput) {
  const supabase = createServiceRoleClient();
  const codigo = input.codigo_pareamento.trim().toUpperCase();

  const payload = {
    codigo_pareamento: codigo,
    nome_tela: input.nome_tela?.trim() || null,
    musica_id: input.musica_id || null,
    modo: input.modo ?? "exibicao",
    ativo: input.ativo ?? true,
    ultimo_acesso_em: input.ultimo_acesso_em ?? null,
  };

  const { data, error } = await supabase
    .from("musica_sessoes")
    .upsert([payload], { onConflict: "codigo_pareamento" })
    .select("id, codigo_pareamento, nome_tela, musica_id, modo, ativo, ultimo_acesso_em, criado_em, atualizado_em")
    .single();

  if (error) {
    throw error;
  }

  return data as MusicaSessao;
}

export async function createMusicaSessao(input: Partial<SaveMusicaSessaoInput> = {}) {
  const codigo = (input.codigo_pareamento?.trim() || generatePairingCode()).toUpperCase();
  return saveMusicaSessao({
    codigo_pareamento: codigo,
    nome_tela: input.nome_tela ?? null,
    musica_id: input.musica_id ?? null,
    modo: input.modo ?? "exibicao",
    ativo: input.ativo ?? true,
    ultimo_acesso_em: input.ultimo_acesso_em ?? null,
  });
}

export async function patchMusicaSessao(
  codigo_pareamento: string,
  patch: Partial<Pick<MusicaSessao, "nome_tela" | "musica_id" | "modo" | "ativo" | "ultimo_acesso_em">>,
) {
  const supabase = createServiceRoleClient();
  const codigo = codigo_pareamento.trim().toUpperCase();

  const payload: Record<string, unknown> = {};

  if (patch.nome_tela !== undefined) {
    payload.nome_tela = patch.nome_tela?.trim() || null;
  }
  if (patch.musica_id !== undefined) {
    payload.musica_id = patch.musica_id || null;
  }
  if (patch.modo !== undefined) {
    payload.modo = patch.modo;
  }
  if (patch.ativo !== undefined) {
    payload.ativo = patch.ativo;
  }
  if (patch.ultimo_acesso_em !== undefined) {
    payload.ultimo_acesso_em = patch.ultimo_acesso_em;
  }

  const { data, error } = await supabase
    .from("musica_sessoes")
    .update(payload)
    .eq("codigo_pareamento", codigo)
    .select("id, codigo_pareamento, nome_tela, musica_id, modo, ativo, ultimo_acesso_em, criado_em, atualizado_em")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as MusicaSessao | null;
}

export async function touchMusicaSessao(codigo_pareamento: string) {
  return patchMusicaSessao(codigo_pareamento, { ultimo_acesso_em: new Date().toISOString() });
}

export async function deleteMusicaSessao(codigo_pareamento: string) {
  const supabase = createServiceRoleClient();
  const codigo = codigo_pareamento.trim().toUpperCase();

  const { error } = await supabase.from("musica_sessoes").delete().eq("codigo_pareamento", codigo);

  if (error) {
    throw error;
  }
}
