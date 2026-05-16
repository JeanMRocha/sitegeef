import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type PublicEscalaRecord = {
  id: string | number;
  ano: number;
  mes: number;
  status?: string;
  reunioes?: Array<{
    id: string | number;
    data: string;
    escala_funcoes?: Array<{
      id?: string | number;
      funcao_id?: string | number | null;
      pessoa_id?: string | number | null;
      substituto_id?: string | number | null;
      funcoes?: { nome?: string | null } | null;
      pessoas?: { nome?: string | null } | null;
      substitutos?: { nome?: string | null } | null;
    }>;
    escala_passe?: Array<{
      id?: string | number;
      pessoa_id?: string | number | null;
      posicao?: number | null;
      pessoas?: { nome?: string | null } | null;
    }>;
    escala_evangelizacao?: Array<{
      id?: string | number;
      pessoa_id?: string | number | null;
      tema_id?: string | number | null;
      tema_livre?: string | null;
      turma?: string | null;
      pessoas?: { nome?: string | null } | null;
      temas_doutrinarios?: { titulo?: string | null } | null;
    }>;
    escala_palestras?: Array<{
      id?: string | number;
      expositor_id?: string | number | null;
      tema_id?: string | number | null;
      tema_livre?: string | null;
      cidade_origem?: string | null;
      tipo_palestra?: string | null;
      expositores?: { nome?: string | null } | null;
      temas_doutrinarios?: { titulo?: string | null } | null;
    }>;
  }>;
};

type PublicEscalasResult = {
  escalas: PublicEscalaRecord[];
  currentYear: number;
  currentMonth: number;
};

async function loadPublicEscalas(): Promise<PublicEscalasResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const supabase = createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data, error } = await supabase
    .from("escalas_mensais")
    .select(
      `
      id, ano, mes, status,
      reunioes (
        id, data,
        escala_funcoes (
          id, funcao_id, pessoa_id, substituto_id,
          funcoes (nome),
          pessoas (nome),
          substitutos:pessoas!substituto_id (nome)
        ),
        escala_passe (
          id, pessoa_id, posicao,
          pessoas (nome)
        ),
        escala_evangelizacao (
          id, pessoa_id, tema_id, tema_livre, turma,
          pessoas (nome),
          temas_doutrinarios (titulo)
        ),
        escala_palestras (
          id, expositor_id, tema_id, tema_livre, cidade_origem, tipo_palestra,
          expositores:pessoas (nome),
          temas_doutrinarios (titulo)
        )
      )
    `
    )
    .eq("status", "publicada")
    .gte("ano", currentYear)
    .order("ano", { ascending: true })
    .order("mes", { ascending: true });

  const escalas = error
    ? []
    : (data ?? []).filter(
    (escala) => escala.ano > currentYear || (escala.ano === currentYear && escala.mes >= currentMonth)
  ) as PublicEscalaRecord[];

  return { escalas, currentYear, currentMonth };
}

export const getPublicEscalas = unstable_cache(loadPublicEscalas, ["public-escalas"], {
  revalidate: 300,
  tags: ["public-escalas"],
});
