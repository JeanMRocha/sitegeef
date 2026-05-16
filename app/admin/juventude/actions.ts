'use server';

import { createClient } from '@/lib/supabase/server';

export async function getGrupos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_juventude')
    .select('*, coordenador:pessoas(nome)')
    .order('nome');

  if (error) throw error;

  return data || [];
}

export async function getGrupoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_juventude')
    .select('*, coordenador:pessoas(id, nome)')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createGrupo(formData: {
  nome: string;
  coordenador_id: string;
  descricao?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_juventude')
    .insert([{ ...formData, status: 'ativo' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateGrupo(
  id: string,
  formData: {
    nome?: string;
    coordenador_id?: string;
    descricao?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('grupos_juventude')
    .update(formData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleGrupoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('grupos_juventude')
    .update({ status: ativo ? 'inativo' : 'ativo' })
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
