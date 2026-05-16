import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type UserAreaData = {
  perfil: any | null;
  usuario: any | null;
  pessoa: any | null;
  emprestimos: any[];
  reservas: any[];
  movimentosLivraria: any[];
  escalas: any[];
  voluntariados: any[];
  consentimentos: any[];
};

async function loadUserArea(userId: string): Promise<UserAreaData> {
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

  const [perfilResult, usuarioResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("usuarios_sistema").select("*").eq("id", userId).single(),
  ]);

  const perfil = perfilResult.data ?? null;
  const usuario = usuarioResult.data ?? null;
  const pessoaId = usuario?.pessoa_id ?? null;

  if (!pessoaId) {
    return {
      perfil,
      usuario,
      pessoa: null,
      emprestimos: [],
      reservas: [],
      movimentosLivraria: [],
      escalas: [],
      voluntariados: [],
      consentimentos: [],
    };
  }

  const [pessoaResult, emprestimosResult, reservasResult, movimentosResult, escalasResult, voluntariosResult, consentimentosResult] =
    await Promise.all([
      supabase.from("pessoas").select("*").eq("id", pessoaId).single(),
      usuario?.pode_biblioteca
        ? supabase
            .from("emprestimos")
            .select(`
              id, data_retirada, prazo_devolucao, status,
              exemplares (codigo, obra:obras (titulo, autor))
            `)
            .eq("pessoa_id", pessoaId)
            .eq("status", "em_aberto")
            .order("prazo_devolucao", { ascending: true })
        : Promise.resolve({ data: [] as any[] }),
      usuario?.pode_biblioteca
        ? supabase
            .from("reservas")
            .select(`
              id, posicao_fila, criado_em,
              obras (titulo, autor)
            `)
            .eq("pessoa_id", pessoaId)
            .eq("status", "aguardando")
            .order("posicao_fila", { ascending: true })
        : Promise.resolve({ data: [] as any[] }),
      usuario?.pode_livraria
        ? supabase
            .from("movimentos_livraria")
            .select(`
              id, tipo, quantidade, valor_total, criado_em,
              produtos_livraria (titulo, autor)
            `)
            .eq("pessoa_id", pessoaId)
            .order("criado_em", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as any[] }),
      usuario?.pode_escalas
        ? supabase
            .from("escala_funcoes")
            .select(`
              id, observacao,
              reunioes (data, escala:escalas_mensais (mes, ano)),
              funcoes (nome)
            `)
            .eq("pessoa_id", pessoaId)
            .order("reunioes(data)", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as any[] }),
      supabase
        .from("servicos_voluntarios")
        .select("*")
        .eq("pessoa_id", pessoaId)
        .eq("status", "ativo"),
      supabase
        .from("consentimentos_lgpd")
        .select("*")
        .eq("pessoa_id", pessoaId)
        .eq("status", "ativo"),
    ]);

  return {
    perfil,
    usuario,
    pessoa: pessoaResult.data ?? null,
    emprestimos: emprestimosResult.data ?? [],
    reservas: reservasResult.data ?? [],
    movimentosLivraria: movimentosResult.data ?? [],
    escalas: escalasResult.data ?? [],
    voluntariados: voluntariosResult.data ?? [],
    consentimentos: consentimentosResult.data ?? [],
  };
}

export const getCachedUserArea = unstable_cache(loadUserArea, ["user-area"], {
  revalidate: 120,
  tags: ["user-area"],
});

export type { UserAreaData };
