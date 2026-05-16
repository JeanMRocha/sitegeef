'use server';

import { createClient } from '@/lib/supabase/server';

// Recepção
export async function getRecepcoes(mes?: number, ano?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('atendimento_recepcao')
    .select('*')
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

export async function getRecepcaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_recepcao')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createRecepcao(formData: {
  data: string;
  pessoas_atendidas: number;
  motivo_geral: string;
  encaminhamento?: string;
  observacoes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_recepcao')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateRecepcao(
  id: string,
  formData: {
    data?: string;
    pessoas_atendidas?: number;
    motivo_geral?: string;
    encaminhamento?: string;
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_recepcao')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteRecepcao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_recepcao')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Atendimento Fraterno
export async function getAtendimentosFraterno(mes?: number, ano?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('atendimento_fraterno')
    .select(`
      *,
      pessoas (nome),
      atendente:pessoas!atendente_id (nome)
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

export async function getAtendimentoFraternoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_fraterno')
    .select(`
      *,
      pessoas (id, nome),
      atendente:pessoas!atendente_id (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createAtendimentoFraterno(formData: {
  pessoa_id: string;
  atendente_id: string;
  data: string;
  tipo: string;
  encaminhamento?: string;
  observacoes?: string;
  sigilo?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_fraterno')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateAtendimentoFraterno(
  id: string,
  formData: {
    pessoa_id?: string;
    atendente_id?: string;
    data?: string;
    tipo?: string;
    encaminhamento?: string;
    observacoes?: string;
    sigilo?: boolean;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_fraterno')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteAtendimentoFraterno(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_fraterno')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Evangelhos no Lar
export async function getEvangelhasNoLar() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evangelhos_no_lar')
    .select(`
      *,
      pessoas (nome)
    `)
    .order('data', { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getEvangelhoNoLarById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evangelhos_no_lar')
    .select(`
      *,
      pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createEvangelhoNoLar(formData: {
  pessoa_id: string;
  endereco: string;
  equipe: string;
  data: string;
  situacao: string;
  observacoes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evangelhos_no_lar')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateEvangelhoNoLar(
  id: string,
  formData: {
    pessoa_id?: string;
    endereco?: string;
    equipe?: string;
    data?: string;
    situacao?: string;
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('evangelhos_no_lar')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteEvangelhoNoLar(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('evangelhos_no_lar')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Irradiação
export async function getIrradiacoes(ativas?: boolean) {
  const supabase = await createClient();

  let query = supabase
    .from('irradiacoes')
    .select(`
      *,
      pessoas (nome)
    `)
    .order('criado_em', { ascending: false });

  if (ativas !== undefined) {
    query = query.eq('status', ativas ? 'ativa' : 'encerrada');
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getIrradiacaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('irradiacoes')
    .select(`
      *,
      pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createIrradiacao(formData: {
  solicitante_id: string;
  nome_irradiacao: string;
  motivo: string;
  periodo: string;
  confidencial?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('irradiacoes')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateIrradiacao(
  id: string,
  formData: {
    nome_irradiacao?: string;
    motivo?: string;
    periodo?: string;
    status?: string;
    confidencial?: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('irradiacoes')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleIrradiacaoStatus(id: string, ativa: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('irradiacoes')
    .update({ status: ativa ? 'encerrada' : 'ativa' })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome, email')
    .eq('status', 'ativo')
    .order('nome');

  if (error) throw error;

  return data || [];
}
