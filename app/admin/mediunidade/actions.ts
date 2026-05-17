'use server';

import { createClient } from '@/lib/supabase/server';

// Grupos Mediúnicos
export async function getGrupos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_mediunicos')
    .select(`
      *,
      coordenador:pessoas (nome)
    `)
    .order('nome');

  if (error) return [];

  return data || [];
}

export async function getGrupoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_mediunicos')
    .select(`
      *,
      coordenador:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function createGrupo(formData: {
  nome: string;
  coordenador_id?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupos_mediunicos')
    .insert([{ ...formData, status: 'ativo' }])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function updateGrupo(
  id: string,
  formData: {
    nome?: string;
    coordenador_id?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('grupos_mediunicos')
    .update(formData)
    .eq('id', id);

  if (error) return [];

  return { success: true };
}

// Membros do Grupo
export async function getGrupoMembros(grupo_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupo_mediunico_membros')
    .select(`
      *,
      pessoa:pessoas (nome)
    `)
    .eq('grupo_id', grupo_id)
    .order('desde', { ascending: false });

  if (error) return [];

  return data || [];
}

export async function adicionarMembro(formData: {
  grupo_id: string;
  pessoa_id: string;
  status?: string;
  desde?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('grupo_mediunico_membros')
    .insert([{ ...formData, status: formData.status || 'ativo' }])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function updateMembroStatus(
  id: string,
  formData: {
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('grupo_mediunico_membros')
    .update(formData)
    .eq('id', id);

  if (error) return null;

  return { success: true };
}

export async function removerMembro(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('grupo_mediunico_membros')
    .delete()
    .eq('id', id);

  if (error) return null;

  return { success: true };
}

// Reuniões Mediúnicas
export async function getReunioes(grupo_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_mediunicas')
    .select('*')
    .eq('grupo_id', grupo_id)
    .order('data', { ascending: false });

  if (error) return [];

  return data || [];
}

export async function getReuniaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_mediunicas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function criarReuniao(formData: {
  grupo_id: string;
  data: string;
  observacoes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reunioes_mediunicas')
    .insert([formData])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function atualizarReuniao(
  id: string,
  formData: {
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reunioes_mediunicas')
    .update(formData)
    .eq('id', id);

  if (error) return null;

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome')
    .eq('status', 'ativo')
    .order('nome');

  if (error) return [];

  return data || [];
}
