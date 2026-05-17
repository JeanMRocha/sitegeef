'use server';

import { createClient } from '@/lib/supabase/server';

export async function getMetas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('metas_planejamento')
    .select(`
      *,
      responsavel:pessoas (nome)
    `)
    .order('prazo', { ascending: true });

  if (error) return [];

  return data || [];
}

export async function getMetaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('metas_planejamento')
    .select(`
      *,
      responsavel:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function createMeta(formData: {
  diretriz?: string;
  objetivo: string;
  meta?: string;
  acao?: string;
  responsavel_id?: string;
  prazo?: string;
  indicador?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('metas_planejamento')
    .insert([{ ...formData, status: 'planejada', andamento: 0 }])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function updateMeta(
  id: string,
  formData: {
    diretriz?: string;
    objetivo?: string;
    meta?: string;
    acao?: string;
    responsavel_id?: string;
    prazo?: string;
    indicador?: string;
    andamento?: number;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('metas_planejamento')
    .update(formData)
    .eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function deleteMeta(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('metas_planejamento')
    .delete()
    .eq('id', id);

  if (error) return { success: false };

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
