'use server';

import { createClient } from '@/lib/supabase/server';

export async function getInstituicao() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('instituicao')
      .select('*')
      .maybeSingle();

    if (error?.code && error.code !== 'PGRST116') {
      console.error('Falha ao carregar instituicao:', error);
      return null;
    }

    return data;
  } catch (error) {
    if (error) {
      console.error('Exceção ao carregar instituicao:', error);
    }
    return null;
  }
}

export async function getEnderecos() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('instituicao_enderecos').select('*');

    if (error) {
      if (Object.keys(error).length > 0) {
        console.error('Falha ao carregar instituicao_enderecos:', error);
      }
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exceção ao carregar instituicao_enderecos:', error);
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
      if (Object.keys(error).length > 0) {
        console.error('Falha ao carregar instituicao_contatos:', error);
      }
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exceção ao carregar instituicao_contatos:', error);
    return [];
  }
}

export async function getContasBancarias() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('contas_bancarias').select('*');

    if (error) {
      if (Object.keys(error).length > 0) {
        console.error('Falha ao carregar contas_bancarias:', error);
      }
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exceção ao carregar contas_bancarias:', error);
    return [];
  }
}

export async function updateInstituicao(formData: {
  nome_oficial: string;
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

  // Try to get existing
  let existing = null;

  try {
    const { data, error } = await supabase
      .from('instituicao')
      .select('id')
      .maybeSingle();

    if (error?.code && error.code !== 'PGRST116') {
      console.error('Falha ao verificar instituicao existente:', error);
    } else {
      existing = data;
    }
  } catch (error) {
    if (error) {
      console.error('Exceção ao verificar instituicao existente:', error);
    }
  }

  if (existing) {
    // Update
    const { error: updateError } = await supabase
      .from('instituicao')
      .update({ ...formData, atualizado_em: new Date().toISOString() })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Falha ao atualizar instituicao:', updateError);
      throw updateError;
    }
  } else {
    // Create
    const { error: insertError } = await supabase.from('instituicao').insert([formData]);

    if (insertError) {
      console.error('Falha ao criar instituicao:', insertError);
      throw insertError;
    }
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

  // Try to get existing
  let existing = null;

  try {
    const { data, error } = await supabase.from('instituicao_enderecos').select('id').limit(1).maybeSingle();
    if (error?.code && error.code !== 'PGRST116') {
      console.error('Falha ao verificar endereco existente:', error);
    } else {
      existing = data;
    }
  } catch (error) {
    if (error) {
      console.error('Exceção ao verificar endereco existente:', error);
    }
  }

  if (existing) {
    const { error } = await supabase.from('instituicao_enderecos').update(formData).eq('id', existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from('instituicao_enderecos').insert([formData]);

    if (error) throw error;
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

  if (error) throw error;

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

  if (error) throw error;

  return { success: true };
}

export async function deleteContato(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('instituicao_contatos').delete().eq('id', id);

  if (error) throw error;

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

  if (error) throw error;

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

  if (error) throw error;

  return { success: true };
}

export async function deleteContaBancaria(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('contas_bancarias').delete().eq('id', id);

  if (error) throw error;

  return { success: true };
}
