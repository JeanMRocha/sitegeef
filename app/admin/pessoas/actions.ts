'use server';

import { createClient } from '@/lib/supabase/server';
import { type tipo_vinculo, type status_pessoa } from '@/lib/supabase/types';
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';

export async function getPessoas(
  page = 1,
  search = '',
  vinculoFilter?: tipo_vinculo,
  statusFilter?: status_pessoa
) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('pessoas')
    .select(
      `
      id,
      nome,
      email,
      telefone,
      status,
      criado_em,
      pessoa_vinculos (vinculo)
    `,
      { count: 'exact' }
    );

  if (search) {
    query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
  }

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, count, error } = await query.range(offset, offset + pageSize - 1);

  if (error) throw error;

  // Filter by vínculo if specified
  let filtered = data || [];
  if (vinculoFilter) {
    filtered = filtered.filter((pessoa: any) =>
      pessoa.pessoa_vinculos?.some((v: any) => v.vinculo === vinculoFilter)
    );
  }

  return {
    pessoas: filtered,
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getPessoaById(id: string) {
  const supabase = await createClient();

  const { data: pessoa, error: pessoaError } = await supabase
    .from('pessoas')
    .select('*')
    .eq('id', id)
    .single();

  if (pessoaError) throw pessoaError;

  const { data: vinculos, error: vinculosError } = await supabase
    .from('pessoa_vinculos')
    .select('*')
    .eq('pessoa_id', id);

  if (vinculosError) throw vinculosError;

  return { pessoa, vinculos };
}

export async function createPessoa(formData: {
  nome: string;
  nome_social?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  data_nascimento?: string;
  cpf?: string;
  rg?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  contato_emergencia?: string;
  status?: status_pessoa;
  autoriza_notificacao?: boolean;
  autoriza_imagem_voz?: boolean;
  vinculos?: tipo_vinculo[];
}) {
  const supabase = await createClient();

  const { data: pessoa, error: pessoaError } = await supabase
    .from('pessoas')
    .insert([
      {
        nome: formData.nome,
        nome_social: formData.nome_social,
        email: formData.email,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        data_nascimento: formData.data_nascimento,
        cpf: formData.cpf,
        rg: formData.rg,
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        observacoes: formData.observacoes,
        contato_emergencia: formData.contato_emergencia,
        status: formData.status || 'ativo',
        autoriza_notificacao: formData.autoriza_notificacao !== false,
        autoriza_imagem_voz: formData.autoriza_imagem_voz || false,
      },
    ])
    .select()
    .single();

  if (pessoaError) throw pessoaError;

  // Add vínculos if provided
  if (formData.vinculos && formData.vinculos.length > 0) {
    const vinculosData = formData.vinculos.map((vinculo) => ({
      pessoa_id: pessoa.id,
      vinculo,
      desde: new Date().toISOString().split('T')[0],
    }));

    const { error: vinculosError } = await supabase
      .from('pessoa_vinculos')
      .insert(vinculosData);

    if (vinculosError) throw vinculosError;
  }

  invalidateUserAreaCache();
  return pessoa;
}

export async function updatePessoa(id: string, formData: Partial<typeof getPessoaById.prototype>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('pessoas')
    .update({
      ...formData,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}

export async function addVinculo(pessoaId: string, vinculo: tipo_vinculo) {
  const supabase = await createClient();

  const { error } = await supabase.from('pessoa_vinculos').insert([
    {
      pessoa_id: pessoaId,
      vinculo,
      desde: new Date().toISOString().split('T')[0],
    },
  ]);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}

export async function removeVinculo(pessoaId: string, vinculo: tipo_vinculo) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('pessoa_vinculos')
    .delete()
    .eq('pessoa_id', pessoaId)
    .eq('vinculo', vinculo);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}

export async function togglePessoaStatus(id: string, novoStatus: status_pessoa) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('pessoas')
    .update({
      status: novoStatus,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}
