'use server';

import { createClient } from '@/lib/supabase/server';
import { invalidateAdminDashboardCache } from '@/lib/admin/cache';

export async function getFuncoes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('funcoes')
    .select('*')
    .eq('ativo', true)
    .order('nome');

  if (error) throw error;

  return data || [];
}

export async function getFuncaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('funcoes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  invalidateAdminDashboardCache();
  return data;
}

export async function createFuncao(formData: {
  nome: string;
  descricao?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('funcoes')
    .insert([
      {
        nome: formData.nome,
        descricao: formData.descricao || null,
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateFuncao(
  id: string,
  formData: {
    nome?: string;
    descricao?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('funcoes')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) throw error;

  invalidateAdminDashboardCache();
  return { success: true };
}

export async function toggleFuncaoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('funcoes')
    .update({ ativo })
    .eq('id', id);

  if (error) throw error;

  invalidateAdminDashboardCache();
  return { success: true };
}

export async function getTemasDourinarios() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('temas_doutrinarios')
    .select('*')
    .eq('ativo', true)
    .order('titulo');

  if (error) throw error;

  return data || [];
}

export async function getTemaDoutrinarioById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('temas_doutrinarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  invalidateAdminDashboardCache();
  return data;
}

export async function createTemaDoutrinario(formData: {
  titulo: string;
  categoria: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('temas_doutrinarios')
    .insert([
      {
        titulo: formData.titulo,
        categoria: formData.categoria,
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateTemaDoutrinario(
  id: string,
  formData: {
    titulo?: string;
    categoria?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('temas_doutrinarios')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) throw error;

  invalidateAdminDashboardCache();
  return { success: true };
}

export async function toggleTemaDoutrinarioStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('temas_doutrinarios')
    .update({ ativo })
    .eq('id', id);

  if (error) throw error;

  invalidateAdminDashboardCache();
  return { success: true };
}
