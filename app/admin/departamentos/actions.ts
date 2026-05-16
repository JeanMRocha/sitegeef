'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDepartamentos(page = 1) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('departamentos')
    .select(
      `
      *,
      departamento_membros (pessoa_id)
    `,
      { count: 'exact' }
    )
    .eq('ativo', true)
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    departamentos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getDepartamentoById(id: string) {
  const supabase = await createClient();

  const { data: departamento, error: deptError } = await supabase
    .from('departamentos')
    .select(
      `
      *,
      departamento_membros (id, pessoa_id, cargo, desde, pessoas (nome, email))
    `
    )
    .eq('id', id)
    .single();

  if (deptError) throw deptError;

  return departamento;
}

export async function createDepartamento(formData: {
  nome: string;
  descricao?: string;
  coordenador_id?: string;
  vice_id?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('departamentos')
    .insert([
      {
        nome: formData.nome,
        descricao: formData.descricao || null,
        coordenador_id: formData.coordenador_id || null,
        vice_id: formData.vice_id || null,
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateDepartamento(
  id: string,
  formData: {
    nome?: string;
    descricao?: string;
    coordenador_id?: string;
    vice_id?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('departamentos')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleDepartamentoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('departamentos')
    .update({ ativo })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function addMembro(
  departamentoId: string,
  pessoaId: string,
  cargo?: string,
  desde?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from('departamento_membros').insert([
    {
      departamento_id: departamentoId,
      pessoa_id: pessoaId,
      cargo: cargo || null,
      desde: desde || new Date().toISOString().split('T')[0],
    },
  ]);

  if (error) throw error;

  return { success: true };
}

export async function removeMembro(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('departamento_membros').delete().eq('id', id);

  if (error) throw error;

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
