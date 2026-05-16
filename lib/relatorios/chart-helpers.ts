/**
 * Chart Data Helpers
 * Utilities for aggregating and preparing data for visualization
 */

import { createClient } from '@/lib/supabase/server';

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

export interface DREChartData {
  mes: number;
  ano: number;
  receitas: ChartDataPoint[];
  despesas: ChartDataPoint[];
  resultado: number;
}

/**
 * Get financial data by center of cost for DRE chart
 */
export async function getFinancialDataByCenter(mes?: number, ano?: number) {
  const supabase = await createClient();

  const now = new Date();
  const mesAtual = mes || now.getMonth() + 1;
  const anoAtual = ano || now.getFullYear();

  const { data: movimentos } = await supabase
    .from('movimentos_financeiros')
    .select(`
      *,
      centro_custo:centros_custo (nome),
      conta:plano_contas (tipo)
    `);

  if (!movimentos) return null;

  // Filter by month/year
  const filtered = movimentos.filter((m: any) => {
    const mDate = new Date(m.data);
    return (
      mDate.getMonth() + 1 === mesAtual &&
      mDate.getFullYear() === anoAtual
    );
  });

  // Aggregate by center of cost
  const receitas: Record<string, number> = {};
  const despesas: Record<string, number> = {};

  filtered.forEach((m: any) => {
    const center = m.centro_custo?.nome || 'Sem Centro';
    const valor = m.valor || 0;

    if (m.tipo === 'entrada') {
      receitas[center] = (receitas[center] || 0) + valor;
    } else if (m.tipo === 'saida') {
      despesas[center] = (despesas[center] || 0) + valor;
    }
  });

  // Convert to chart format
  const totalReceita = Object.values(receitas).reduce((a, b) => a + b, 0);
  const totalDespesa = Object.values(despesas).reduce((a, b) => a + b, 0);

  const receitasChart: ChartDataPoint[] = Object.entries(receitas)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalReceita > 0 ? (value / totalReceita) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const despesasChart: ChartDataPoint[] = Object.entries(despesas)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalDespesa > 0 ? (value / totalDespesa) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    mes: mesAtual,
    ano: anoAtual,
    receitas: receitasChart,
    despesas: despesasChart,
    totalReceita,
    totalDespesa,
    resultado: totalReceita - totalDespesa,
  };
}

/**
 * Get attendance trends for studies
 */
export async function getAttendanceTrends(turmaId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('frequencias_estudo')
    .select(`
      data,
      presente,
      turma_id,
      turma:turmas_estudo (id, curso:cursos_estudo (nome))
    `);

  if (turmaId) {
    query = query.eq('turma_id', turmaId);
  }

  const { data: frequencias } = await query;

  if (!frequencias) return [];

  // Group by date and calculate attendance %
  const byDate: Record<string, { presente: number; total: number }> = {};

  frequencias.forEach((f: any) => {
    const date = f.data;
    if (!byDate[date]) {
      byDate[date] = { presente: 0, total: 0 };
    }
    byDate[date].total++;
    if (f.presente) {
      byDate[date].presente++;
    }
  });

  return Object.entries(byDate)
    .map(([date, data]) => ({
      date,
      presente: data.presente,
      ausente: data.total - data.presente,
      percentual: (data.presente / data.total) * 100,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get module statistics
 */
export async function getModuleStats() {
  const supabase = await createClient();

  const [
    { count: pessoasCount },
    { count: cursosCount },
    { count: turmasCount },
    { count: familiasCount },
    { count: publicacoesCount },
    { count: emprestimoCount },
  ] = await Promise.all([
    supabase.from('pessoas').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('cursos_estudo').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('turmas_estudo').select('id', { count: 'exact', head: true }),
    supabase.from('familias_assistidas').select('id', { count: 'exact', head: true }).eq('status', 'ativa'),
    supabase.from('publicacoes').select('id', { count: 'exact', head: true }).eq('status', 'publicado'),
    supabase.from('emprestimos').select('id', { count: 'exact', head: true }).eq('status', 'em_aberto'),
  ]);

  return {
    pessoas: pessoasCount || 0,
    cursos: cursosCount || 0,
    turmas: turmasCount || 0,
    familias: familiasCount || 0,
    publicacoes: publicacoesCount || 0,
    emprestimos: emprestimoCount || 0,
  };
}

/**
 * Get growth metrics for period comparison
 */
export async function getGrowthMetrics(mes?: number, ano?: number) {
  const supabase = await createClient();

  const now = new Date();
  const currentMes = mes || now.getMonth() + 1;
  const currentAno = ano || now.getFullYear();

  // Previous month
  let prevMes = currentMes - 1;
  let prevAno = currentAno;
  if (prevMes === 0) {
    prevMes = 12;
    prevAno--;
  }

  const currentData = await getFinancialDataByCenter(currentMes, currentAno);
  const previousData = await getFinancialDataByCenter(prevMes, prevAno);

  if (!currentData || !previousData) return null;

  const receitaGrowth =
    ((currentData.totalReceita - previousData.totalReceita) /
      (previousData.totalReceita || 1)) *
    100;
  const despesaGrowth =
    ((currentData.totalDespesa - previousData.totalDespesa) /
      (previousData.totalDespesa || 1)) *
    100;

  return {
    currentMes,
    currentAno,
    prevMes,
    prevAno,
    receitaGrowth: Math.round(receitaGrowth * 10) / 10,
    despesaGrowth: Math.round(despesaGrowth * 10) / 10,
    resultadoGrowth:
      Math.round(
        ((currentData.resultado - previousData.resultado) /
          (Math.abs(previousData.resultado) || 1)) *
          100 *
          10
      ) / 10,
  };
}
