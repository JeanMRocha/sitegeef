import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type InstitutionBrand = {
  logoSemFundoUrl: string;
  logoComFundoUrl: string;
  descricao: string;
  letrasDescricao: string;
  visualDescricao: string;
  composicao: string;
  uso: string;
  exemplos: string;
};

const FALLBACK_BRAND: InstitutionBrand = {
  logoSemFundoUrl: "/brand/logo-oficial-transparent.png",
  logoComFundoUrl: "/brand/logo-oficial.jpg",
  descricao:
    "A marca do GEEF foi desenhada para comunicar acolhimento, sobriedade e clareza. O símbolo deve permanecer legível, com respiro adequado e sem distorções.",
  letrasDescricao:
    "As letras usam uma composição acolhedora, legível e equilibrada, com desenho pensado para leitura rápida em diferentes tamanhos.",
  visualDescricao:
    "A leitura visual privilegia contraste, respiro e presença institucional sem exageros, preservando a identidade da casa em cada aplicação.",
  composicao:
    "A composição privilegia leitura rápida, equilíbrio entre símbolo e tipografia e uso consistente em fundos claros ou escuros, sem aplicar efeitos que alterem a marca.",
  uso:
    "Use a logo com fundo transparente em fundos chapados, cabeçalhos e materiais digitais. Use a versão com fundo quando a área precisar de contraste imediato ou apoio visual mais marcante.",
  exemplos:
    "Exemplos de aplicação: topo do site, capa de documentos, card institucional, assinaturas de comunicação e materiais de divulgação da casa.",
};

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return (await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ])) as T;
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

export async function getInstitutionBrand(): Promise<InstitutionBrand> {
  const supabase = createServiceRoleClient();

  try {
    const query = supabase
      .from("instituicao")
      .select("*")
      .order("criado_em", { ascending: true })
      .limit(1)
      .maybeSingle();

    const result = await withTimeout(query as PromiseLike<any>, 1800, { data: null, error: null });
    const { data, error } = result as { data: any; error: unknown };

    if (error || !data) {
      return FALLBACK_BRAND;
    }

    return {
      logoSemFundoUrl: data.logo_url || FALLBACK_BRAND.logoSemFundoUrl,
      logoComFundoUrl: data.logo_com_fundo_url || FALLBACK_BRAND.logoComFundoUrl,
      descricao: data.identidade_visual_descricao || FALLBACK_BRAND.descricao,
      letrasDescricao: data.identidade_visual_letras_descricao || FALLBACK_BRAND.letrasDescricao,
      visualDescricao: data.identidade_visual_visual_descricao || FALLBACK_BRAND.visualDescricao,
      composicao: data.identidade_visual_composicao || FALLBACK_BRAND.composicao,
      uso: data.identidade_visual_uso || FALLBACK_BRAND.uso,
      exemplos: data.identidade_visual_exemplos || FALLBACK_BRAND.exemplos,
    };
  } catch {
    return FALLBACK_BRAND;
  }
}
