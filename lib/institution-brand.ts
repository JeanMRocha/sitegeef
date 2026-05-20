import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type InstitutionBrand = {
  logoSemFundoUrl: string;
  logoComFundoUrl: string;
  descricao: string;
  composicao: string;
  uso: string;
  exemplos: string;
};

const FALLBACK_BRAND: InstitutionBrand = {
  logoSemFundoUrl: "/brand/logo-oficial-transparent.png",
  logoComFundoUrl: "/brand/logo-oficial.jpg",
  descricao:
    "A marca do GEEF foi desenhada para comunicar acolhimento, sobriedade e clareza. O símbolo deve permanecer legível, com respiro adequado e sem distorções.",
  composicao:
    "A composição privilegia leitura rápida, equilíbrio entre símbolo e tipografia e uso consistente em fundos claros ou escuros, sem aplicar efeitos que alterem a marca.",
  uso:
    "Use a logo sem fundo em fundos chapados, cabeçalhos e materiais digitais. Use a versão com fundo quando a área precisar de contraste imediato ou apoio visual mais marcante.",
  exemplos:
    "Exemplos de aplicação: topo do site, capa de documentos, card institucional, assinaturas de comunicação e materiais de divulgação da casa.",
};

export async function getInstitutionBrand(): Promise<InstitutionBrand> {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from("instituicao")
      .select(
        "logo_url, logo_com_fundo_url, identidade_visual_descricao, identidade_visual_composicao, identidade_visual_uso, identidade_visual_exemplos"
      )
      .order("criado_em", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_BRAND;
    }

    return {
      logoSemFundoUrl: data.logo_url || FALLBACK_BRAND.logoSemFundoUrl,
      logoComFundoUrl: data.logo_com_fundo_url || FALLBACK_BRAND.logoComFundoUrl,
      descricao: data.identidade_visual_descricao || FALLBACK_BRAND.descricao,
      composicao: data.identidade_visual_composicao || FALLBACK_BRAND.composicao,
      uso: data.identidade_visual_uso || FALLBACK_BRAND.uso,
      exemplos: data.identidade_visual_exemplos || FALLBACK_BRAND.exemplos,
    };
  } catch {
    return FALLBACK_BRAND;
  }
}
