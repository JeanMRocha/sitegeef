'use server';

import { createClient } from '@/lib/supabase/server';

export async function getRelatorioFinanceiro(mes?: number, ano?: number) {
  const supabase = await createClient();

  const now = new Date();
  const mesAtual = mes || now.getMonth() + 1;
  const anoAtual = ano || now.getFullYear();

  let query = supabase
    .from('movimentos_financeiros')
    .select(`
      *,
      conta:plano_contas (nome, tipo),
      centro_custo:centros_custo (nome)
    `);

  const { data, error } = await query;

  if (error) throw error;

  const movimentos = data || [];

  const receitas = movimentos
    .filter((m: any) => m.tipo === 'entrada' && new Date(m.data).getMonth() + 1 === mesAtual && new Date(m.data).getFullYear() === anoAtual)
    .reduce((sum: number, m: any) => sum + (m.valor || 0), 0);

  const despesas = movimentos
    .filter((m: any) => m.tipo === 'saida' && new Date(m.data).getMonth() + 1 === mesAtual && new Date(m.data).getFullYear() === anoAtual)
    .reduce((sum: number, m: any) => sum + (m.valor || 0), 0);

  const resultado = receitas - despesas;

  return {
    mes: mesAtual,
    ano: anoAtual,
    receitas,
    despesas,
    resultado,
    movimentos: movimentos.filter((m: any) => new Date(m.data).getMonth() + 1 === mesAtual && new Date(m.data).getFullYear() === anoAtual),
  };
}

export async function getEstatisticasGerais() {
  const supabase = await createClient();

  const { data: pessoas, error: erroPessoas } = await supabase.from('pessoas').select('id').eq('status', 'ativo');
  const { data: cursos, error: erroCursos } = await supabase.from('cursos_estudo').select('id').eq('ativo', true);
  const { data: turmas, error: erroTurmas } = await supabase.from('turmas_estudo').select('id');
  const { data: familias, error: erroFamilias } = await supabase.from('familias_assistidas').select('id').eq('status', 'ativa');

  return {
    pessoasAtivas: erroPessoas ? 0 : (pessoas?.length || 0),
    cursosAtivos: erroCursos ? 0 : (cursos?.length || 0),
    turmasTotal: erroTurmas ? 0 : (turmas?.length || 0),
    familiasAssistidas: erroFamilias ? 0 : (familias?.length || 0),
  };
}

export async function getMesesDisponiveis() {
  return Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    nome: new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'long' }),
  }));
}

export async function getAnosDisponiveis() {
  const anoAtual = new Date().getFullYear();
  return [anoAtual - 1, anoAtual, anoAtual + 1];
}
