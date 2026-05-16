'use server';

import { createClient } from '@/lib/supabase/server';

export async function getPublicacoes(status?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('publicacoes')
    .select(`
      *,
      autor:pessoas (nome)
    `)
    .order('criado_em', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getPublicacaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('publicacoes')
    .select(`
      *,
      autor:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createPublicacao(formData: {
  titulo: string;
  tipo?: string;
  conteudo?: string;
  autor_id: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('publicacoes')
    .insert([{ ...formData, status: 'rascunho' }])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updatePublicacao(
  id: string,
  formData: {
    titulo?: string;
    tipo?: string;
    conteudo?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const updateData: any = { ...formData };

  if (formData.status === 'publicado') {
    updateData.publicado_em = new Date().toISOString();
  }

  const { error } = await supabase
    .from('publicacoes')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function deletePublicacao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('publicacoes')
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
