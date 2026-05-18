'use server';

import { createClient } from '@/lib/supabase/server';

function hasMeaningfulError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const record = error as Record<string, unknown>;
  return Boolean(record.code || record.message || record.details || record.hint);
}

function normalizeCnpj(value?: string) {
  const digits = value?.replace(/\D/g, '').slice(0, 14);
  return digits || undefined;
}

function normalizeDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, 10);
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
}

export async function getInstituicao() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('instituicao')
      .select('*')
      .order('criado_em', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error?.code && error.code !== 'PGRST116' && hasMeaningfulError(error)) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export async function getEnderecos() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('instituicao_enderecos').select('*');

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

export async function getContatos() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('instituicao_contatos')
      .select(
        `
        *,
        pessoas (nome, email)
      `
      );

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

export async function getContasBancarias() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('contas_bancarias').select('*');

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

export async function updateInstituicao(formData: {
  nome_oficial?: string;
  nome_curto?: string;
  cnpj?: string;
  natureza_juridica?: string;
  data_fundacao?: string;
  logo_url?: string;
  descricao?: string;
  historia?: string;
  missao?: string;
  visao?: string;
  valores?: string;
  estatuto_url?: string;
}) {
  const supabase = await createClient();
  const patch = stripUndefined({
    ...formData,
    cnpj: normalizeCnpj(formData.cnpj),
    data_fundacao: normalizeDate(formData.data_fundacao),
  });

  let existingId: string | null = null;
  let existingRow:
    | {
        nome_oficial?: string | null;
        nome_curto?: string | null;
        cnpj?: string | null;
        natureza_juridica?: string | null;
        data_fundacao?: string | null;
        logo_url?: string | null;
        descricao?: string | null;
        historia?: string | null;
        missao?: string | null;
        visao?: string | null;
        valores?: string | null;
        estatuto_url?: string | null;
      }
    | null = null;

  try {
    const { data, error } = await supabase
      .from('instituicao')
      .select('id, nome_oficial, nome_curto, cnpj, natureza_juridica, data_fundacao, logo_url, descricao, historia, missao, visao, valores, estatuto_url')
      .order('criado_em', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!(error?.code && error.code !== 'PGRST116' && hasMeaningfulError(error))) {
      existingId = data?.id ?? null;
      existingRow = data ?? null;
    }
  } catch (error) {
    void error;
  }

  if (existingId) {
    const payload = {
      nome_oficial: patch.nome_oficial ?? existingRow?.nome_oficial,
      nome_curto: patch.nome_curto ?? existingRow?.nome_curto ?? null,
      cnpj: patch.cnpj ?? existingRow?.cnpj ?? null,
      natureza_juridica: patch.natureza_juridica ?? existingRow?.natureza_juridica ?? null,
      data_fundacao: patch.data_fundacao ?? existingRow?.data_fundacao ?? null,
      logo_url: patch.logo_url ?? existingRow?.logo_url ?? null,
      descricao: patch.descricao ?? existingRow?.descricao ?? null,
      historia: patch.historia ?? existingRow?.historia ?? null,
      missao: patch.missao ?? existingRow?.missao ?? null,
      visao: patch.visao ?? existingRow?.visao ?? null,
      valores: patch.valores ?? existingRow?.valores ?? null,
      estatuto_url: patch.estatuto_url ?? existingRow?.estatuto_url ?? null,
      atualizado_em: new Date().toISOString(),
    };

    if (!payload.nome_oficial) {
      return { success: false, error: 'Nome oficial é obrigatório.' };
    }

    const { error: updateError } = await supabase
      .from('instituicao')
      .update(payload)
      .eq('id', existingId);

    if (updateError) return { success: false, error: updateError.message };
  } else {
    if (!patch.nome_oficial) {
      return { success: false, error: 'Nome oficial é obrigatório.' };
    }

    const { error: insertError } = await supabase.from('instituicao').insert([patch]);

    if (insertError) return { success: false, error: insertError.message };
  }

  return { success: true };
}

export async function updateEndereco(formData: {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  maps_link?: string;
  latitude?: number;
  longitude?: number;
}) {
  const supabase = await createClient();

  let existingId: string | null = null;

  try {
    const { data, error } = await supabase.from('instituicao_enderecos').select('id').limit(1).maybeSingle();
    if (!(error?.code && error.code !== 'PGRST116' && hasMeaningfulError(error))) {
      existingId = data?.id ?? null;
    }
  } catch (error) {
    void error;
  }

  if (existingId) {
    const { error } = await supabase.from('instituicao_enderecos').update(formData).eq('id', existingId);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('instituicao_enderecos').insert([formData]);

    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}

export async function addContato(formData: {
  tipo: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  site?: string;
  responsavel_id?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('instituicao_contatos').insert([{ ...formData, ativo: true }]);

  if (error) return { success: false };

  return { success: true };
}

export async function updateContato(
  id: string,
  formData: {
    tipo?: string;
    telefone?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    site?: string;
    responsavel_id?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from('instituicao_contatos').update(formData).eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function deleteContato(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('instituicao_contatos').delete().eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function addContaBancaria(formData: {
  nome: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: string;
  titular?: string;
  cpf_cnpj_titular?: string;
  chave_pix?: string;
  tipo_chave_pix?: string;
  finalidade?: string;
  visibilidade?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('contas_bancarias').insert([{ ...formData, ativo: true }]);

  if (error) return { success: false };

  return { success: true };
}

export async function updateContaBancaria(
  id: string,
  formData: {
    nome?: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    tipo_conta?: string;
    titular?: string;
    cpf_cnpj_titular?: string;
    chave_pix?: string;
    tipo_chave_pix?: string;
    finalidade?: string;
    visibilidade?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from('contas_bancarias').update(formData).eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function deleteContaBancaria(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('contas_bancarias').delete().eq('id', id);

  if (error) return { success: false };

  return { success: true };
}
