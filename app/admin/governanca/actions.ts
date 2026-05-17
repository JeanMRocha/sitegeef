'use server';

import { createClient } from '@/lib/supabase/server';

// Diretorias
export async function getDiretorias() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('diretorias')
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

export async function getDiretoriaById(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('diretorias')
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

export async function createDiretoria(formData: {
  nome: string;
  data_inicio?: string;
  data_fim?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('diretorias')
    .insert([{ ...formData, status: 'ativa' }])
    .select()
    .single();

  if (error) return [];

  return data;
}

export async function updateDiretoria(
  id: string,
  formData: {
    nome?: string;
    data_inicio?: string;
    data_fim?: string;
    status?: string;
    ata_eleicao_url?: string;
    ata_posse_url?: string;
    observacoes?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('diretorias')
    .update(formData)
    .eq('id', id);

  if (error) return null;

  return { success: true };
}

// Cargos
export async function getCargos() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('cargos')
      .select('*')
      .order('nome');

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export async function getCargoById(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('cargos')
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

export async function createCargo(formData: {
  nome: string;
  descricao?: string;
  nivel?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cargos')
    .insert([formData])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function updateCargo(
  id: string,
  formData: {
    nome?: string;
    descricao?: string;
    nivel?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cargos')
    .update(formData)
    .eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

// Cargo Ocupações (people in positions)
export async function getCargoOcupacoes(diretoria_id?: string) {
  const supabase = await createClient();

  try {
    let query = supabase
      .from('cargo_ocupacoes')
      .select(`
        *,
        pessoa:pessoas (nome),
        cargo:cargos (nome),
        diretoria:diretorias (nome)
      `)
      .order('data_inicio', { ascending: false });

    if (diretoria_id) {
      query = query.eq('diretoria_id', diretoria_id);
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

export async function createCargoOcupacao(formData: {
  pessoa_id: string;
  cargo_id: string;
  diretoria_id: string;
  data_inicio?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cargo_ocupacoes')
    .insert([{ ...formData, status: 'ativo' }])
    .select()
    .single();

  if (error) return [];

  return data;
}

export async function updateCargoOcupacao(
  id: string,
  formData: {
    data_fim?: string;
    motivo_saida?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cargo_ocupacoes')
    .update(formData)
    .eq('id', id);

  if (error) return null;

  return { success: true };
}

// Assembleias
export async function getAssembleias() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('assembleias')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export async function getAssembleiaById(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('assembleias')
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

export async function createAssembleia(formData: {
  tipo: string;
  data: string;
  pauta?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('assembleias')
    .insert([{ ...formData, status: 'rascunho' }])
    .select()
    .single();

  if (error) return null;

  return data;
}

export async function updateAssembleia(
  id: string,
  formData: {
    pauta?: string;
    decisoes?: string;
    ata_url?: string;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('assembleias')
    .update(formData)
    .eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  try {
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
