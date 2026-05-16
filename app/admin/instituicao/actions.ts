'use server';

import { createClient } from '@/lib/supabase/server';

export async function getInstituicao() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('instituicao')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function getEnderecos() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('instituicao_enderecos').select('*');

  if (error) throw error;

  return data || [];
}

export async function getContatos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('instituicao_contatos')
    .select(
      `
      *,
      pessoas (nome, email)
    `
    );

  if (error) throw error;

  return data || [];
}

export async function getContasBancarias() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('contas_bancarias').select('*');

  if (error) throw error;

  return data || [];
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
  let { data: existing, error: readError } = await supabase
    .from('instituicao')
    .select('id')
    .single();

  if (existing) {
    // Update
    const { error: updateError } = await supabase
      .from('instituicao')
      .update({ ...formData, atualizado_em: new Date().toISOString() })
      .eq('id', existing.id);

    if (updateError) throw updateError;
  } else {
    // Create
    const { error: insertError } = await supabase.from('instituicao').insert([formData]);

    if (insertError) throw insertError;
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
  let { data: existing } = await supabase.from('instituicao_enderecos').select('id').limit(1).single();

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
