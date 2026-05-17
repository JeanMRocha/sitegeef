'use server';

import { createClient } from '@/lib/supabase/server';

// Cursos
export async function getCursos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cursos_estudo')
    .select('*')
    .order('nome');

  if (error) {
    return [];
  }

  return data || [];
}

export async function getCursoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cursos_estudo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createCurso(formData: { nome: string; descricao?: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cursos_estudo')
    .insert([{ ...formData, ativo: true }])
    .select()
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateCurso(id: string, formData: { nome?: string; descricao?: string; ativo?: boolean }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cursos_estudo')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  return { success: true };
}

// Turmas
export async function getTurmas(curso_id?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('turmas_estudo')
    .select(`
      *,
      curso:cursos_estudo (nome),
      facilitador:pessoas (nome)
    `)
    .order('data_inicio', { ascending: false });

  if (curso_id) {
    query = query.eq('curso_id', curso_id);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data || [];
}

export async function getTurmaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turmas_estudo')
    .select(`
      *,
      curso:cursos_estudo (id, nome),
      facilitador:pessoas (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createTurma(formData: {
  curso_id: string;
  facilitador_id: string;
  horario: string;
  data_inicio: string;
  data_fim: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turmas_estudo')
    .insert([{ ...formData, status: 'em_andamento' }])
    .select()
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateTurma(
  id: string,
  formData: {
    facilitador_id?: string;
    horario?: string;
    data_inicio?: string;
    data_fim?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('turmas_estudo')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  return { success: true };
}

// Frequências
export async function getFrequencias(turma_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('frequencias_estudo')
    .select(`
      *,
      pessoa:pessoas (nome)
    `)
    .eq('turma_id', turma_id)
    .order('data');

  if (error) {
    return [];
  }

  return data || [];
}

export async function registrarFrequencia(formData: {
  turma_id: string;
  pessoa_id: string;
  data: string;
  presente: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('frequencias_estudo')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return { success: false };
  }

  return data;
}

export async function updateFrequencia(id: string, presente: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('frequencias_estudo')
    .update({ presente })
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome')
    .eq('status', 'ativo')
    .order('nome');

  if (error) {
    return [];
  }

  return data || [];
}
