'use server';

import { createClient } from '@/lib/supabase/server';

export async function getNotificacoes(pessoa_id?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('notificacoes')
    .select('*')
    .order('criado_em', { ascending: false });

  if (pessoa_id) {
    query = query.eq('pessoa_id', pessoa_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getNotificacaoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notificacoes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function marcarComoLida(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notificacoes')
    .update({ status: 'lida' })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function marcarTodasComoLidas(pessoa_id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notificacoes')
    .update({ status: 'lida' })
    .eq('pessoa_id', pessoa_id)
    .eq('status', 'pendente');

  if (error) throw error;

  return { success: true };
}

export async function deletarNotificacao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notificacoes')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}
