import { unstable_cache } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type AdminDashboardSummary = {
  totalPessoas: number;
  totalFuncoes: number;
  totalTemas: number;
  totalEscalasPublicadas: number;
  escalaMesAtual: { id: string; status: string } | null;
  mesAtual: number;
  anoAtual: number;
};

async function loadAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const supabase = createServiceRoleClient();
  const agora = new Date();
  const mesAtual = agora.getMonth() + 1;
  const anoAtual = agora.getFullYear();

  try {
    const [pessoasResult, funcoesResult, temasResult, escalasResult, escalaMesAtualResult] = await Promise.all([
      supabase.from("pessoas").select("id", { count: "exact" }).eq("ativo", true),
      supabase.from("funcoes").select("id", { count: "exact" }).eq("ativo", true),
      supabase.from("temas_doutrinarios").select("id", { count: "exact" }).eq("ativo", true),
      supabase.from("escalas_mensais").select("id", { count: "exact" }).eq("status", "publicada"),
      supabase
        .from("escalas_mensais")
        .select("id, status")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .maybeSingle(),
    ]);

    if (pessoasResult.error) throw pessoasResult.error;
    if (funcoesResult.error) throw funcoesResult.error;
    if (temasResult.error) throw temasResult.error;
    if (escalasResult.error) throw escalasResult.error;
    if (escalaMesAtualResult.error) throw escalaMesAtualResult.error;

    return {
      totalPessoas: pessoasResult.count || 0,
      totalFuncoes: funcoesResult.count || 0,
      totalTemas: temasResult.count || 0,
      totalEscalasPublicadas: escalasResult.count || 0,
      escalaMesAtual: escalaMesAtualResult.data ?? null,
      mesAtual,
      anoAtual,
    };
  } catch (error) {
    console.error("Falha ao carregar resumo do admin:", error);

    return {
      totalPessoas: 0,
      totalFuncoes: 0,
      totalTemas: 0,
      totalEscalasPublicadas: 0,
      escalaMesAtual: null,
      mesAtual,
      anoAtual,
    };
  }
}

export const getCachedAdminDashboardSummary = unstable_cache(
  loadAdminDashboardSummary,
  ["admin-dashboard"],
  {
    revalidate: 60,
    tags: ["admin-dashboard"],
  }
);
