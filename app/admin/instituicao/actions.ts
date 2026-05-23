'use server';

import { revalidateTag, unstable_cache, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { uploadStorageAsset } from '@/lib/supabase/storage';

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
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

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

async function loadContatoTipos() {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from('instituicao_contato_tipos')
      .select('id, label, ordem, ativo')
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .order('label', { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getContatoTipos = unstable_cache(loadContatoTipos, ['admin-instituicao-contato-tipos'], {
  revalidate: 30,
  tags: ['admin-instituicao-contato-tipos'],
});

async function loadPessoasDisponiveis() {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from('pessoas')
      .select('id, nome, email')
      .eq('status', 'ativo')
      .order('nome', { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export const getPessoasDisponiveis = unstable_cache(loadPessoasDisponiveis, ['admin-instituicao-pessoas'], {
  revalidate: 30,
  tags: ['admin-instituicao-pessoas'],
});

export async function updateInstituicao(formData: {
  nome_oficial?: string;
  nome_curto?: string;
  cnpj?: string;
  natureza_juridica?: string;
  porte?: string;
  data_fundacao?: string;
  cnae_principal?: string;
  cnae_descricao?: string;
  logo_url?: string;
  logo_com_fundo_url?: string;
  descricao?: string;
  historia?: string;
  missao?: string;
  visao?: string;
  valores?: string;
  identidade_visual_descricao?: string;
  identidade_visual_letras_descricao?: string;
  identidade_visual_visual_descricao?: string;
  identidade_visual_composicao?: string;
  identidade_visual_uso?: string;
  identidade_visual_exemplos?: string;
  estatuto_url?: string;
}) {
  const supabase = createServiceRoleClient();
  const patch = stripUndefined({
    ...formData,
    cnpj: normalizeCnpj(formData.cnpj),
    data_fundacao: normalizeDate(formData.data_fundacao),
  });

  if (!patch.nome_oficial) {
    return { success: false, error: 'Nome oficial é obrigatório.' };
  }

  try {
    // Tentar GET do registro único
    const { data: existing, error: selectError } = await supabase
      .from('instituicao')
      .select('id')
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      return { success: false, error: selectError.message };
    }

    const payload = {
      ...patch,
      atualizado_em: new Date().toISOString(),
    };

    // Se existe, UPDATE; senão INSERT
    if (existing?.id) {
      const { error: updateError } = await supabase
        .from('instituicao')
        .update(payload)
        .eq('id', existing.id);

      if (updateError) return { success: false, error: updateError.message };
    } else {
      const { error: insertError } = await supabase
        .from('instituicao')
        .insert([payload]);

      if (insertError) return { success: false, error: insertError.message };
    }
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar instituição' };
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
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

  if (formData.responsavel_id) {
    const { data, error } = await supabase.from('pessoas').select('id').eq('id', formData.responsavel_id).maybeSingle();

    if (error || !data) {
      return { success: false, error: 'Pessoa responsável não encontrada.' };
    }
  }

  const { error } = await supabase.from('instituicao_contatos').insert([{ ...formData, ativo: true }]);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

function normalizeContatoTipoLabel(value?: string) {
  return value?.trim().replace(/\s+/g, ' ');
}

function formDataText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

export async function addContatoTipo(formData: FormData) {
  const supabase = createServiceRoleClient();
  const label = normalizeContatoTipoLabel(formDataText(formData, 'label'));

  if (!label) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Informe o nome do tipo.' }));
  }

  const { error } = await supabase
    .from('instituicao_contato_tipos')
    .insert([{ label, ordem: 999, ativo: true }]);

  if (error) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: `Não foi possível salvar o tipo: ${error.message}` }));
  }

  revalidateTag('admin-instituicao-contato-tipos');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Tipo salvo.' }));
}

export async function updateContatoTipo(formData: FormData) {
  const supabase = createServiceRoleClient();
  const id = formDataText(formData, 'id');
  const label = normalizeContatoTipoLabel(formDataText(formData, 'label'));
  const ordemRaw = formDataText(formData, 'ordem');

  if (!id) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Tipo inválido.' }));
  }

  if (!label) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Informe o nome do tipo.' }));
  }

  const { error } = await supabase
    .from('instituicao_contato_tipos')
    .update({
      label,
      ordem: ordemRaw && !Number.isNaN(Number(ordemRaw)) ? Number(ordemRaw) : 999,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: `Não foi possível atualizar o tipo: ${error.message}` }));
  }

  revalidateTag('admin-instituicao-contato-tipos');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Tipo atualizado.' }));
}

export async function deleteContatoTipo(formData: FormData) {
  const supabase = createServiceRoleClient();
  const id = formDataText(formData, 'id');

  if (!id) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Tipo inválido.' }));
  }

  const { error } = await supabase.from('instituicao_contato_tipos').delete().eq('id', id);

  if (error) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: `Não foi possível remover o tipo: ${error.message}` }));
  }

  revalidateTag('admin-instituicao-contato-tipos');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Tipo removido.' }));
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
  const supabase = createServiceRoleClient();

  if (formData.responsavel_id) {
    const { data, error } = await supabase.from('pessoas').select('id').eq('id', formData.responsavel_id).maybeSingle();

    if (error || !data) {
      return { success: false, error: 'Pessoa responsável não encontrada.' };
    }
  }

  const { error } = await supabase.from('instituicao_contatos').update(formData).eq('id', id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function deleteContato(id: string) {
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

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
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from('contas_bancarias').update(formData).eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function deleteContaBancaria(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from('contas_bancarias').delete().eq('id', id);

  if (error) return { success: false };

  return { success: true };
}

export async function uploadLogoAction(formData: FormData) {
  return uploadBrandAssetAction(formData);
}

export async function uploadBrandAssetAction(formData: FormData) {
  const file = formData.get('file') as File;
  const slot = typeof formData.get('slot') === 'string' ? String(formData.get('slot')) : 'logo_url';
  const fieldName = typeof formData.get('field_name') === 'string' ? String(formData.get('field_name')) : slot;
  const storagePath =
    slot === 'logo_com_fundo_url'
      ? 'brand/logo-oficial.jpg'
      : 'brand/logo-oficial-transparent.png';

  if (!file) {
    return { success: false, error: 'Nenhum arquivo foi selecionado.' };
  }

  const result = await uploadStorageAsset(file, storagePath);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const supabase = createServiceRoleClient();
  let instituicaoId: string | null = null;

  try {
    const { data } = await supabase
      .from('instituicao')
      .select('id')
      .order('criado_em', { ascending: true })
      .limit(1)
      .maybeSingle();

    instituicaoId = data?.id ?? null;
  } catch {
    // Continuar mesmo se houver erro
  }

  if (instituicaoId) {
    const { error } = await supabase
      .from('instituicao')
      .update({ [fieldName]: result.url, atualizado_em: new Date().toISOString() })
      .eq('id', instituicaoId);

    if (error) {
      return { success: false, error: `Upload realizado, mas erro ao salvar: ${error.message}` };
    }
  }

  revalidateTag('instituicao');
  revalidateTag('logo');
  revalidatePath('/admin/instituicao');
  revalidatePath('/admin/instituicao/editar');
  return { success: true, url: result.url };
}
