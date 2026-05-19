'use server';

import { createClient } from '@/lib/supabase/server';
import { recordSupabaseFailureEvent, recordLgpdEventWithSeverity } from '@/lib/observability';
import { LGPD_VERSIONS } from '@/lib/lgpd/constants';

// Turmas
export async function getTurmas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turmas_evangelizacao')
    .select('*')
    .order('nome');

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getTurmas',
      table: 'turmas_evangelizacao',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export async function getTurmaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turmas_evangelizacao')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getTurmaById',
      table: 'turmas_evangelizacao',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function createTurma(formData: {
  nome: string;
  faixa_etaria: string;
  horario: string;
  sala: string;
  capacidade: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turmas_evangelizacao')
    .insert([formData])
    .select()
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'createTurma',
      table: 'turmas_evangelizacao',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function updateTurma(
  id: string,
  formData: {
    nome?: string;
    faixa_etaria?: string;
    horario?: string;
    sala?: string;
    capacidade?: number;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('turmas_evangelizacao')
    .update(formData)
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'updateTurma',
      table: 'turmas_evangelizacao',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return { success: true };
}

// Crianças
export async function getCriancas(turma_id?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('criancas')
    .select(`
      *,
      pessoa:pessoas (nome),
      responsavel:pessoas!responsavel_id (nome),
      turma:turmas_evangelizacao (nome)
    `)
    .order('pessoa.nome');

  if (turma_id) {
    query = query.eq('turma_id', turma_id);
  }

  const { data, error } = await query;

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getCriancas',
      table: 'criancas',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export async function getCriancaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('criancas')
    .select(`
      *,
      pessoa:pessoas (id, nome),
      responsavel:pessoas!responsavel_id (id, nome),
      turma:turmas_evangelizacao (id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getCriancaById',
      table: 'criancas',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function createCrianca(formData: {
  pessoa_id: string;
  responsavel_id: string;
  turma_id: string;
  restricoes?: string;
  autorizacoes?: string;
  consentimento_responsavel?: boolean;
  consentimento_imagem?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('criancas')
    .insert([formData])
    .select()
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'createCrianca',
      table: 'criancas',
      error,
      fallback: 'null',
      level: 'error',
    });
    return null;
  }

  await Promise.all(
    [
      formData.consentimento_responsavel
        ? {
            categoria: 'crianca',
            acao: 'consentimento_responsavel',
            status: 'aceito',
            versao: LGPD_VERSIONS.privacy,
            origem: 'admin/evangelizacao/criancas',
            canal: 'web',
            pessoaId: formData.pessoa_id,
            severity: 'high' as const,
            escopo: {
              responsavel_id: formData.responsavel_id,
              turma_id: formData.turma_id,
            },
          }
        : null,
      formData.consentimento_imagem
        ? {
            categoria: 'crianca',
            acao: 'autorizacao_imagem',
            status: 'aceito',
            versao: LGPD_VERSIONS.privacy,
            origem: 'admin/evangelizacao/criancas',
            canal: 'web',
            pessoaId: formData.pessoa_id,
            severity: 'high' as const,
            escopo: {
              responsavel_id: formData.responsavel_id,
              autorizacao: 'imagem_voz',
            },
          }
        : null,
    ]
      .filter(Boolean)
      .map((input) => recordLgpdEventWithSeverity(input as any))
  );

  return data;
}

export async function updateCrianca(
  id: string,
  formData: {
    turma_id?: string;
    restricoes?: string;
    autorizacoes?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('criancas')
    .update(formData)
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'updateCrianca',
      table: 'criancas',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return { success: true };
}

export async function deleteCrianca(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('criancas')
    .delete()
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'deleteCrianca',
      table: 'criancas',
      error,
      fallback: 'false',
    });
    return { success: false };
  }

  return { success: true };
}

// Aulas
export async function getAulas(turma_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('aulas_evangelizacao')
    .select('*')
    .eq('turma_id', turma_id)
    .order('data', { ascending: false });

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getAulas',
      table: 'aulas_evangelizacao',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export async function getAulaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('aulas_evangelizacao')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getAulaById',
      table: 'aulas_evangelizacao',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function createAula(formData: {
  turma_id: string;
  data: string;
  tema: string;
  material?: string;
  observacoes?: string;
  presencas?: any;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('aulas_evangelizacao')
    .insert([formData])
    .select()
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'createAula',
      table: 'aulas_evangelizacao',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function updateAula(
  id: string,
  formData: {
    data?: string;
    tema?: string;
    material?: string;
    observacoes?: string;
    presencas?: any;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('aulas_evangelizacao')
    .update(formData)
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'updateAula',
      table: 'aulas_evangelizacao',
      error,
      fallback: 'false',
    });
    return { success: false };
  }

  return { success: true };
}

export async function deleteAula(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('aulas_evangelizacao')
    .delete()
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'deleteAula',
      table: 'aulas_evangelizacao',
      error,
      fallback: 'false',
    });
    return { success: false };
  }

  return { success: true };
}

// Evangelizadores
export async function getEvangelizadores(turma_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turma_evangelizadores')
    .select(`
      *,
      pessoa:pessoas (id, nome)
    `)
    .eq('turma_id', turma_id)
    .order('pessoa.nome');

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getEvangelizadores',
      table: 'turma_evangelizadores',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export async function addEvangelizador(turma_id: string, pessoa_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('turma_evangelizadores')
    .insert([{ turma_id, pessoa_id }])
    .select()
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'addEvangelizador',
      table: 'turma_evangelizadores',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function removeEvangelizador(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('turma_evangelizadores')
    .delete()
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'removeEvangelizador',
      table: 'turma_evangelizadores',
      error,
      fallback: 'null',
    });
    return null;
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
    await recordSupabaseFailureEvent({
      source: 'admin/evangelizacao',
      operation: 'getPessoasDisponiveis',
      table: 'pessoas',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}
