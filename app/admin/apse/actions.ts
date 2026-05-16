'use server';

import { createClient } from '@/lib/supabase/server';

// Famílias Assistidas
export async function getFamilias() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('familias_assistidas')
    .select(`
      *,
      responsavel:pessoas (nome)
    `)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getFamiliaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('familias_assistidas')
    .select(`
      *,
      responsavel:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createFamilia(formData: {
  responsavel_id: string;
  endereco: string;
  membros: number;
  situacao: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('familias_assistidas')
    .insert([{ ...formData, status: 'ativa' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateFamilia(
  id: string,
  formData: {
    responsavel_id?: string;
    endereco?: string;
    membros?: number;
    situacao?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('familias_assistidas')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Campanhas APSE
export async function getCampanhas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campanhas_apse')
    .select('*')
    .order('data_inicio', { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getCampanhaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campanhas_apse')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createCampanha(formData: {
  nome: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  meta?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campanhas_apse')
    .insert([{ ...formData, status: 'planejada' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCampanha(
  id: string,
  formData: {
    nome?: string;
    descricao?: string;
    data_inicio?: string;
    data_fim?: string;
    meta?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('campanhas_apse')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

// Atendimentos APSE
export async function getAtendimentos(familia_id?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('atendimentos_apse')
    .select(`
      *,
      familia:familias_assistidas (responsavel_id),
      pessoa:pessoas (nome),
      responsavel:pessoas (nome)
    `)
    .order('data', { ascending: false });

  if (familia_id) {
    query = query.eq('familia_id', familia_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getAtendimentoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimentos_apse')
    .select(`
      *,
      familia:familias_assistidas (id, responsavel_id),
      pessoa:pessoas (id, nome),
      responsavel:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createAtendimento(formData: {
  familia_id: string;
  pessoa_id: string;
  data: string;
  tipo: string;
  descricao?: string;
  responsavel_id: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimentos_apse')
    .insert([formData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateAtendimento(
  id: string,
  formData: {
    tipo?: string;
    descricao?: string;
    responsavel_id?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimentos_apse')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome')
    .eq('status', 'ativo')
    .order('nome');

  if (error) throw error;

  return data || [];
}
