'use server';

import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateAdminAtendimentoCache } from '@/lib/admin/cache';
import { applyDateRangeFilter } from '@/lib/admin/query-helpers';

// Recepção
async function loadRecepcoes(mes?: number, ano?: number) {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('atendimento_recepcao')
      .select('*')
      .order('data', { ascending: false });

    if (mes && ano) {
      const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
      const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];
      query = applyDateRangeFilter(query, 'data', dataInicio, dataFim);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getRecepcoes = unstable_cache(loadRecepcoes, ['admin-atendimento-recepcao'], {
  revalidate: 60,
  tags: ['admin-atendimento-recepcao'],
});

async function loadRecepcaoById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('atendimento_recepcao')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export const getRecepcaoById = unstable_cache(loadRecepcaoById, ['admin-atendimento-recepcao-item'], {
  revalidate: 60,
  tags: ['admin-atendimento-recepcao'],
});

export async function createRecepcao(formData: {
  data: string;
  pessoas_atendidas: number;
  motivo_geral: string;
  encaminhamento?: string;
  observacoes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_recepcao')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminAtendimentoCache();
  return data;
}

export async function updateRecepcao(
  id: string,
  formData: {
    data?: string;
    pessoas_atendidas?: number;
    motivo_geral?: string;
    encaminhamento?: string;
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_recepcao')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

export async function deleteRecepcao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_recepcao')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

// Atendimento Fraterno
async function loadAtendimentosFraterno(mes?: number, ano?: number) {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('atendimento_fraterno')
      .select(`
        *,
        pessoas (nome),
        atendente:pessoas!atendente_id (nome)
      `)
      .order('data', { ascending: false });

    if (mes && ano) {
      const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
      const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];
      query = applyDateRangeFilter(query, 'data', dataInicio, dataFim);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getAtendimentosFraterno = unstable_cache(loadAtendimentosFraterno, ['admin-atendimento-fraterno'], {
  revalidate: 60,
  tags: ['admin-atendimento-fraterno'],
});

async function loadAtendimentoFraternoById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('atendimento_fraterno')
      .select(`
        *,
        pessoas (id, nome),
        atendente:pessoas!atendente_id (id, nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export const getAtendimentoFraternoById = unstable_cache(loadAtendimentoFraternoById, ['admin-atendimento-fraterno-item'], {
  revalidate: 60,
  tags: ['admin-atendimento-fraterno'],
});

export async function createAtendimentoFraterno(formData: {
  pessoa_id: string;
  atendente_id: string;
  data: string;
  tipo: string;
  encaminhamento?: string;
  observacoes?: string;
  sigilo?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimento_fraterno')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminAtendimentoCache();
  return data;
}

export async function updateAtendimentoFraterno(
  id: string,
  formData: {
    pessoa_id?: string;
    atendente_id?: string;
    data?: string;
    tipo?: string;
    encaminhamento?: string;
    observacoes?: string;
    sigilo?: boolean;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_fraterno')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

export async function deleteAtendimentoFraterno(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimento_fraterno')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

// Evangelhos no Lar
async function loadEvangelhasNoLar() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('evangelhos_no_lar')
      .select(`
        *,
        pessoas (nome)
      `)
      .order('data', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getEvangelhasNoLar = unstable_cache(loadEvangelhasNoLar, ['admin-atendimento-evangelhos-lar'], {
  revalidate: 60,
  tags: ['admin-atendimento-evangelhos-lar'],
});

async function loadEvangelhoNoLarById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('evangelhos_no_lar')
      .select(`
        *,
        pessoas (id, nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export const getEvangelhoNoLarById = unstable_cache(loadEvangelhoNoLarById, ['admin-atendimento-evangelho-lar-item'], {
  revalidate: 60,
  tags: ['admin-atendimento-evangelhos-lar'],
});

export async function createEvangelhoNoLar(formData: {
  pessoa_id: string;
  endereco: string;
  equipe: string;
  data: string;
  situacao: string;
  observacoes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evangelhos_no_lar')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminAtendimentoCache();
  return data;
}

export async function updateEvangelhoNoLar(
  id: string,
  formData: {
    pessoa_id?: string;
    endereco?: string;
    equipe?: string;
    data?: string;
    situacao?: string;
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('evangelhos_no_lar')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

export async function deleteEvangelhoNoLar(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('evangelhos_no_lar')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

// Irradiação
async function loadIrradiacoes(ativas?: boolean) {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('irradiacoes')
      .select(`
        *,
        pessoas (nome)
      `)
      .order('criado_em', { ascending: false });

    if (ativas !== undefined) {
      query = query.eq('status', ativas ? 'ativa' : 'encerrada');
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getIrradiacoes = unstable_cache(loadIrradiacoes, ['admin-atendimento-irradiacao'], {
  revalidate: 60,
  tags: ['admin-atendimento-irradiacao'],
});

async function loadIrradiacaoById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('irradiacoes')
      .select(`
        *,
        pessoas (id, nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export const getIrradiacaoById = unstable_cache(loadIrradiacaoById, ['admin-atendimento-irradiacao-item'], {
  revalidate: 60,
  tags: ['admin-atendimento-irradiacao'],
});

export async function createIrradiacao(formData: {
  solicitante_id: string;
  nome_irradiacao: string;
  motivo: string;
  periodo: string;
  confidencial?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('irradiacoes')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminAtendimentoCache();
  return data;
}

export async function updateIrradiacao(
  id: string,
  formData: {
    nome_irradiacao?: string;
    motivo?: string;
    periodo?: string;
    status?: string;
    confidencial?: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('irradiacoes')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

export async function toggleIrradiacaoStatus(id: string, ativa: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('irradiacoes')
    .update({ status: ativa ? 'encerrada' : 'ativa' })
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminAtendimentoCache();
  return { success: true };
}

async function loadPessoasDisponiveis() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('pessoas')
      .select('id, nome, email')
      .eq('status', 'ativo')
      .order('nome');

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getPessoasDisponiveis = unstable_cache(loadPessoasDisponiveis, ['admin-atendimento-pessoas'], {
  revalidate: 30,
  tags: ['admin-atendimento-pessoas'],
});
