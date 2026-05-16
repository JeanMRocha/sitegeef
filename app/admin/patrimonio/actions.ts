'use server';

import { createClient } from '@/lib/supabase/server';

export async function getBens() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bens_patrimoniais')
    .select(`
      *,
      responsavel:pessoas (nome)
    `)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getBemById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bens_patrimoniais')
    .select(`
      *,
      responsavel:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createBem(formData: {
  nome: string;
  categoria?: string;
  localizacao?: string;
  conservacao?: string;
  responsavel_id?: string;
  data_aquisicao?: string;
  valor?: number;
  termo_doacao_url?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bens_patrimoniais')
    .insert([{ ...formData, status: 'ativo' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateBem(
  id: string,
  formData: {
    nome?: string;
    categoria?: string;
    localizacao?: string;
    conservacao?: string;
    responsavel_id?: string;
    data_aquisicao?: string;
    valor?: number;
    termo_doacao_url?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('bens_patrimoniais')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteBem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('bens_patrimoniais')
    .delete()
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
