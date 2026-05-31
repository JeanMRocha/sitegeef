'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateRange } from '@/lib/admin/query-helpers';

export async function getDepartamentos(page = 1) {
  const supabase = await createClient();
  const pageSize = 20;
  const { start, end } = calculateRange(page, pageSize);

  try {
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
      .range(start, end);

    if (error) {
      return {
        departamentos: [],
        total: 0,
        page,
        pageSize,
      };
    }

    return {
      departamentos: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  } catch {
    return {
      departamentos: [],
      total: 0,
      page,
      pageSize,
    };
  }
}

export async function getDepartamentoById(id: string) {
  const supabase = await createClient();

  try {
    const { data: departamento, error: deptError } = await supabase
      .from('departamentos')
      .select(
        `
        *,
        departamento_membros (id, pessoa_id, cargo, desde, pessoas (nome, email))
      `
      )
      .eq('id', id)
      .maybeSingle();

    if (deptError || !departamento) {
      return null;
    }

    return departamento;
  } catch {
    return null;
  }
}

export async function createDepartamento(formData: {
  nome: string;
  descricao?: string;
  coordenador_id?: string;
  vice_id?: string;
}) {
  const supabase = await createClient();

  try {
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

    if (error) return null;

    return data;
  } catch {
    return null;
  }
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

  try {
    const { error } = await supabase
      .from('departamentos')
      .update({
        ...formData,
      })
      .eq('id', id);

    if (error) return null;
  } catch {
    return { success: false };
  }

  return { success: true };
}

export async function toggleDepartamentoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('departamentos')
      .update({ ativo })
      .eq('id', id);

    if (error) return null;
  } catch {
    return { success: false };
  }

  return { success: true };
}

export async function addMembro(
  departamentoId: string,
  pessoaId: string,
  cargo?: string,
  desde?: string
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('departamento_membros').insert([
      {
        departamento_id: departamentoId,
        pessoa_id: pessoaId,
        cargo: cargo || null,
        desde: desde || new Date().toISOString().split('T')[0],
      },
    ]);

    if (error) return { success: false };
  } catch {
    return { success: false };
  }

  return { success: true };
}

export async function removeMembro(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('departamento_membros').delete().eq('id', id);

    if (error) return { success: false };
  } catch {
    return { success: false };
  }

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pessoas')
      .select('id, nome, email')
      .eq('status', 'ativo')
      .order('nome');

    if (error) return [];

    return data || [];
  } catch {
    return [];
  }
}
