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

async function safeCount(
  supabase: ReturnType<typeof createServiceRoleClient>,
  table: string,
  filters: Array<[string, string, unknown]> = [],
) {
  let query = supabase.from(table).select("id", { count: "exact" });

  for (const [column, operator, value] of filters) {
    query = query.filter(column, operator, value);
  }

  const result = await query;

  if (result.error) {
    return 0;
  }

  return result.count || 0;
}

async function safeMaybeSingle(
  query: PromiseLike<{
    data: { id: string; status: string } | null;
    error: { code?: string; message?: string } | null;
  }>,
) {
  const result = await query;

  if (result.error) {
    return null;
  }

  return result.data ?? null;
}

async function loadAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const supabase = createServiceRoleClient();
  const agora = new Date();
  const mesAtual = agora.getMonth() + 1;
  const anoAtual = agora.getFullYear();

  const [totalPessoas, totalFuncoes, totalTemas, totalEscalasPublicadas, escalaMesAtual] = await Promise.all([
    safeCount(supabase, "pessoas", [["ativo", "eq", true]]),
    safeCount(supabase, "funcoes", [["ativo", "eq", true]]),
    safeCount(supabase, "temas_doutrinarios", [["ativo", "eq", true]]),
    safeCount(supabase, "escalas_mensais", [["status", "eq", "publicada"]]),
    safeMaybeSingle(
      supabase
        .from("escalas_mensais")
        .select("id, status")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .maybeSingle(),
    ),
  ]);

  return {
    totalPessoas,
    totalFuncoes,
    totalTemas,
    totalEscalasPublicadas,
    escalaMesAtual,
    mesAtual,
    anoAtual,
  };
}

export const getCachedAdminDashboardSummary = unstable_cache(
  loadAdminDashboardSummary,
  ["admin-dashboard"],
  {
    revalidate: 60,
    tags: ["admin-dashboard"],
  }
);
