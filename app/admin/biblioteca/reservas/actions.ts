'use server';

import { createClient } from '@/lib/supabase/server';

export async function getReservas(page = 1) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('reservas')
    .select(
      `
      *,
      pessoas (nome, email),
      obras (titulo, autor)
    `,
      { count: 'exact' }
    )
    .eq('status', 'aguardando')
    .order('posicao_fila', { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    reservas: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getReservaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reservas')
    .select(
      `
      *,
      pessoas (id, nome, email),
      obras (id, titulo, autor),
      exemplares:exemplares(id, codigo, situacao)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createReserva(formData: {
  pessoa_id: string;
  obra_id: string;
}) {
  const supabase = await createClient();

  // Get next position in queue
  const { data: lastReserva } = await supabase
    .from('reservas')
    .select('posicao_fila')
    .eq('obra_id', formData.obra_id)
    .eq('status', 'aguardando')
    .order('posicao_fila', { ascending: false })
    .limit(1)
    .single();

  const proximaPosicao = (lastReserva?.posicao_fila || 0) + 1;

  const { data, error } = await supabase
    .from('reservas')
    .insert([
      {
        pessoa_id: formData.pessoa_id,
        obra_id: formData.obra_id,
        posicao_fila: proximaPosicao,
        status: 'aguardando',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function cancelarReserva(id: string) {
  const supabase = await createClient();

  // Get the reservation details
  const { data: reserva, error: getError } = await supabase
    .from('reservas')
    .select('obra_id, posicao_fila')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // Update reservation status
  const { error: updateError } = await supabase
    .from('reservas')
    .update({ status: 'cancelado' })
    .eq('id', id);

  if (updateError) throw updateError;

  // Reorder remaining reservations for this obra
  const { data: reservasRestantes } = await supabase
    .from('reservas')
    .select('id, posicao_fila')
    .eq('obra_id', reserva.obra_id)
    .eq('status', 'aguardando')
    .order('posicao_fila', { ascending: true });

  if (reservasRestantes) {
    for (let i = 0; i < reservasRestantes.length; i++) {
      await supabase
        .from('reservas')
        .update({ posicao_fila: i + 1 })
        .eq('id', reservasRestantes[i].id);
    }
  }

  return { success: true };
}

export async function confirmarReserva(id: string, exemplar_id: string) {
  const supabase = await createClient();

  // Update reservation status
  const { error: updateError } = await supabase
    .from('reservas')
    .update({ status: 'confirmado' })
    .eq('id', id);

  if (updateError) throw updateError;

  // Update exemplar status to reservado
  const { error: exemplarError } = await supabase
    .from('exemplares')
    .update({ situacao: 'reservado' })
    .eq('id', exemplar_id);

  if (exemplarError) throw exemplarError;

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

export async function getObrasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('obras')
    .select('id, titulo, autor')
    .eq('ativo', true)
    .order('titulo');

  if (error) throw error;

  return data || [];
}

export async function getExemplaresdisponiveisParaReserva(obra_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('exemplares')
    .select('id, codigo, situacao')
    .eq('obra_id', obra_id)
    .in('situacao', ['disponivel', 'reservado']);

  if (error) throw error;

  return data || [];
}
