'use server';

import { createClient } from '@/lib/supabase/server';

export async function getReunioes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_virtuais')
    .select(`
      *,
      anfitriao:pessoas (nome)
    `)
    .order('data_hora', { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getReuniaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_virtuais')
    .select(`
      *,
      anfitriao:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createReuniao(formData: {
  titulo: string;
  plataforma?: string;
  link?: string;
  senha?: string;
  anfitriao_id?: string;
  data_hora?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_virtuais')
    .insert([{ ...formData, status: 'planejada' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateReuniao(
  id: string,
  formData: {
    titulo?: string;
    plataforma?: string;
    link?: string;
    senha?: string;
    anfitriao_id?: string;
    data_hora?: string;
    checklist?: any;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reunioes_virtuais')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deleteReuniao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reunioes_virtuais')
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
