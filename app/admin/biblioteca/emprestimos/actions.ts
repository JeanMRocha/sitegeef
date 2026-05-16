'use server';

import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateAdminBibliotecaCache } from '@/lib/admin/cache';
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';

async function loadEmprestimos(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('emprestimos')
    .select(
      `
      *,
      pessoas (nome, email),
      exemplares (codigo, obra:obras (titulo))
    `,
      { count: 'exact' }
    )
    .eq('status', 'em_aberto')
    .order('prazo_devolucao', { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    emprestimos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getEmprestimos = unstable_cache(loadEmprestimos, ['admin-biblioteca-emprestimos-ativos'], {
  revalidate: 60,
  tags: ['admin-biblioteca'],
});

export async function getEmprestimoById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('emprestimos')
    .select(
      `
      *,
      pessoas (id, nome, email),
      exemplares (id, codigo, obra:obras (id, titulo))
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createEmprestimo(formData: {
  exemplar_id: string;
  pessoa_id: string;
  data_retirada?: string;
  prazo_devolucao: string;
}) {
  const supabase = createServiceRoleClient();

  // Create emprestimo
  const { data: emprestimo, error: emprestimoError } = await supabase
    .from('emprestimos')
    .insert([
      {
        exemplar_id: formData.exemplar_id,
        pessoa_id: formData.pessoa_id,
        data_retirada: formData.data_retirada || new Date().toISOString().split('T')[0],
        prazo_devolucao: formData.prazo_devolucao,
        status: 'em_aberto',
      },
    ])
    .select()
    .single();

  if (emprestimoError) throw emprestimoError;

  // Update exemplar status to emprestado
  const { error: exemplarError } = await supabase
    .from('exemplares')
    .update({ situacao: 'emprestado' })
    .eq('id', formData.exemplar_id);

  if (exemplarError) throw exemplarError;

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return emprestimo;
}

export async function updateEmprestimo(
  id: string,
  formData: {
    prazo_devolucao?: string;
    observacao?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('emprestimos')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) throw error;

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return { success: true };
}

export async function devolverEmprestimo(id: string) {
  const supabase = createServiceRoleClient();

  // Get emprestimo details
  const { data: emprestimo, error: emprestimoError } = await supabase
    .from('emprestimos')
    .select('exemplar_id')
    .eq('id', id)
    .single();

  if (emprestimoError) throw emprestimoError;

  // Update emprestimo status
  const { error: updateError } = await supabase
    .from('emprestimos')
    .update({
      status: 'devolvido',
      data_devolucao: new Date().toISOString().split('T')[0],
    })
    .eq('id', id);

  if (updateError) throw updateError;

  // Check if there are reservas for this exemplar
  const { data: exemplar, error: exemplarError } = await supabase
    .from('exemplares')
    .select(
      `
      obra_id,
      reservas:reservas(id, pessoa_id)
    `
    )
    .eq('id', emprestimo.exemplar_id)
    .single();

  if (exemplarError) throw exemplarError;

  if (exemplar.reservas && exemplar.reservas.length > 0) {
    // Set exemplar as reserved
    await supabase
      .from('exemplares')
      .update({ situacao: 'reservado' })
      .eq('id', emprestimo.exemplar_id);
  } else {
    // Set exemplar back to available
    await supabase
      .from('exemplares')
      .update({ situacao: 'disponivel' })
      .eq('id', emprestimo.exemplar_id);
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
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

export async function getExemplaresdisponveisParaEmprestimo() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('exemplares')
    .select(
      `
      id, codigo,
      obra:obras (id, titulo, autor)
    `
    )
    .eq('situacao', 'disponivel')
    .order('codigo');

  if (error) throw error;

  return data || [];
}

async function loadHistoricoEmprestimos(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('emprestimos')
    .select(
      `
      *,
      pessoas (nome),
      exemplares (codigo, obra:obras (titulo))
    `,
      { count: 'exact' }
    )
    .eq('status', 'devolvido')
    .order('data_devolucao', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    historico: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getHistoricoEmprestimos = unstable_cache(
  loadHistoricoEmprestimos,
  ['admin-biblioteca-emprestimos-historico'],
  {
    revalidate: 60,
    tags: ['admin-biblioteca'],
  }
);
