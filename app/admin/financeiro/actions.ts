'use server';

import { createClient } from '@/lib/supabase/server';

export async function getPlanoContas(status?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('plano_contas')
    .select('*')
    .order('tipo, codigo');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getContaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('plano_contas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createConta(formData: {
  codigo: string;
  nome: string;
  tipo: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('plano_contas')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateConta(
  id: string,
  formData: {
    codigo?: string;
    nome?: string;
    tipo?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('plano_contas')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleContaStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('plano_contas')
    .update({ status: ativo ? 'inativo' : 'ativo' })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Centros de Custo
export async function getCentrosCusto(ativo?: boolean) {
  const supabase = await createClient();

  let query = supabase
    .from('centros_custo')
    .select('*')
    .order('nome');

  if (ativo !== undefined) {
    query = query.eq('ativo', ativo);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getCentroCustoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centros_custo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createCentroCusto(formData: {
  nome: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centros_custo')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCentroCusto(
  id: string,
  formData: {
    nome?: string;
    ativo?: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('centros_custo')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleCentroCustoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('centros_custo')
    .update({ ativo: !ativo })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Movimentos Financeiros
export async function getMovimentosFinanceiros(mes?: number, ano?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('movimentos_financeiros')
    .select(`
      *,
      plano_contas (codigo, nome, tipo),
      centros_custo (nome),
      pessoas (nome)
    `)
    .order('data', { ascending: false });

  if (mes && ano) {
    const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];
    query = query
      .gte('data', dataInicio)
      .lte('data', dataFim);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getMovimentoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('movimentos_financeiros')
    .select(`
      *,
      plano_contas (id, codigo, nome, tipo),
      centros_custo (id, nome),
      pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createMovimento(formData: {
  tipo: string;
  conta_id: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  centro_custo_id?: string;
  pessoa_id?: string;
  comprovante_url?: string;
}) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('movimentos_financeiros')
    .insert([
      {
        ...formData,
        lancado_por: user?.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateMovimento(
  id: string,
  formData: {
    tipo?: string;
    conta_id?: string;
    categoria?: string;
    descricao?: string;
    valor?: number;
    data?: string;
    centro_custo_id?: string;
    pessoa_id?: string;
    comprovante_url?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('movimentos_financeiros')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteMovimento(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('movimentos_financeiros')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// DRE - Demonstração de Resultado
export async function getRelatorioFinanceiro(mes: number, ano: number) {
  const supabase = await createClient();

  const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('movimentos_financeiros')
    .select(`
      *,
      plano_contas (tipo),
      centros_custo (nome)
    `)
    .gte('data', dataInicio)
    .lte('data', dataFim)
    .order('data');

  if (error) throw error;

  return data || [];
}

export async function getSaldoMes(mes: number, ano: number) {
  const supabase = await createClient();

  const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('movimentos_financeiros')
    .select('tipo, valor')
    .gte('data', dataInicio)
    .lte('data', dataFim);

  if (error) throw error;

  const movimentos = data || [];
  const entradas = movimentos
    .filter((m: any) => m.tipo === 'entrada')
    .reduce((sum: number, m: any) => sum + m.valor, 0);
  const saidas = movimentos
    .filter((m: any) => m.tipo === 'saida')
    .reduce((sum: number, m: any) => sum + m.valor, 0);

  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
  };
}
