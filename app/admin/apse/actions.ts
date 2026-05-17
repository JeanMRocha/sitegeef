'use server';

import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateAdminApseCache } from '@/lib/admin/cache';

// Famílias Assistidas
async function loadFamilias() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('familias_assistidas')
      .select(`
        *,
        responsavel:pessoas (nome)
      `)
      .order('criado_em', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getFamilias = unstable_cache(loadFamilias, ['admin-apse-familias'], {
  revalidate: 60,
  tags: ['admin-apse-familias'],
});

async function loadFamiliaById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('familias_assistidas')
      .select(`
        *,
        responsavel:pessoas (id, nome)
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

export const getFamiliaById = unstable_cache(loadFamiliaById, ['admin-apse-familia'], {
  revalidate: 60,
  tags: ['admin-apse-familias'],
});

export async function createFamilia(formData: {
  responsavel_id: string;
  endereco: string;
  membros: number;
  situacao: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('familias_assistidas')
    .insert([{ ...formData, status: 'ativa' }])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminApseCache();
  return data;
}

export async function updateFamilia(
  id: string,
  formData: {
    responsavel_id?: string;
    endereco?: string;
    membros?: number;
    situacao?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('familias_assistidas')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminApseCache();
  return { success: true };
}

// Campanhas APSE
async function loadCampanhas() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('campanhas_apse')
      .select('*')
      .order('data_inicio', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getCampanhas = unstable_cache(loadCampanhas, ['admin-apse-campanhas'], {
  revalidate: 60,
  tags: ['admin-apse-campanhas'],
});

async function loadCampanhaById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('campanhas_apse')
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

export const getCampanhaById = unstable_cache(loadCampanhaById, ['admin-apse-campanha'], {
  revalidate: 60,
  tags: ['admin-apse-campanhas'],
});

export async function createCampanha(formData: {
  nome: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  meta?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campanhas_apse')
    .insert([{ ...formData, status: 'planejada' }])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminApseCache();
  return data;
}

export async function updateCampanha(
  id: string,
  formData: {
    nome?: string;
    descricao?: string;
    data_inicio?: string;
    data_fim?: string;
    meta?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('campanhas_apse')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminApseCache();
  return { success: true };
}

// Atendimentos APSE
async function loadAtendimentos(familia_id?: string) {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('atendimentos_apse')
      .select(`
        *,
        familia:familias_assistidas (responsavel_id),
        pessoa:pessoas (nome),
        responsavel:pessoas (nome)
      `)
      .order('data', { ascending: false });

    if (familia_id) {
      query = query.eq('familia_id', familia_id);
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

export const getAtendimentos = unstable_cache(loadAtendimentos, ['admin-apse-atendimentos'], {
  revalidate: 60,
  tags: ['admin-apse-atendimentos'],
});

async function loadAtendimentoById(id: string) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('atendimentos_apse')
      .select(`
        *,
        familia:familias_assistidas (id, responsavel_id),
        pessoa:pessoas (id, nome),
        responsavel:pessoas (id, nome)
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

export const getAtendimentoById = unstable_cache(loadAtendimentoById, ['admin-apse-atendimento'], {
  revalidate: 60,
  tags: ['admin-apse-atendimentos'],
});

export async function createAtendimento(formData: {
  familia_id: string;
  pessoa_id: string;
  data: string;
  tipo: string;
  descricao?: string;
  responsavel_id: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('atendimentos_apse')
    .insert([formData])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminApseCache();
  return data;
}

export async function updateAtendimento(
  id: string,
  formData: {
    tipo?: string;
    descricao?: string;
    responsavel_id?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('atendimentos_apse')
    .update(formData)
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminApseCache();
  return { success: true };
}

async function loadPessoasDisponiveis() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('pessoas')
      .select('id, nome')
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

export const getPessoasDisponiveis = unstable_cache(loadPessoasDisponiveis, ['admin-apse-pessoas'], {
  revalidate: 30,
  tags: ['admin-apse-pessoas'],
});
