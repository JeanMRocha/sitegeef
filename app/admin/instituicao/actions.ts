'use server';

import { revalidateTag, unstable_cache, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { normalizePorteCnpj } from '@/lib/instituicao/porte';
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

async function getMainInstituicaoId() {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from('instituicao')
      .select('id')
      .order('criado_em', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data?.id) {
      return null;
    }

    return data.id as string;
  } catch {
    return null;
  }
}

async function loadInstituicaoCnaes(instituicaoId: string) {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from('instituicao_cnaes')
      .select('tipo, codigo, descricao, ordem, ativo')
      .eq('instituicao_id', instituicaoId)
      .eq('ativo', true)
      .order('tipo', { ascending: true })
      .order('ordem', { ascending: true })
      .order('codigo', { ascending: true });

    if (error) {
      return { principal: null, secundarios: [] as Array<{ codigo: string; descricao?: string | null; ordem?: number | null }> };
    }

    const rows = data ?? [];
    const principal = rows.find((item) => item.tipo === 'principal') ?? null;
    const secundarios = rows
      .filter((item) => item.tipo === 'secundario')
      .map((item) => ({
        codigo: item.codigo,
        descricao: item.descricao ?? null,
        ordem: item.ordem ?? null,
      }));

    return {
      principal: principal
        ? {
            codigo: principal.codigo,
            descricao: principal.descricao ?? null,
          }
        : null,
      secundarios,
    };
  } catch {
    return { principal: null, secundarios: [] as Array<{ codigo: string; descricao?: string | null; ordem?: number | null }> };
  }
}

async function resolveContatoTipoId(
  instituicaoId: string,
  tipoId: string | undefined,
  tipoLabel: string | undefined
) {
  const supabase = createServiceRoleClient();

  if (tipoId) {
    const { data } = await supabase
      .from('instituicao_contato_tipos')
      .select('id')
      .eq('id', tipoId)
      .eq('instituicao_id', instituicaoId)
      .maybeSingle();

    if (data?.id) {
      return data.id as string;
    }
  }

  const normalizedLabel = normalizeContatoTipoLabel(tipoLabel);
  if (!normalizedLabel) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('instituicao_contato_tipos')
      .select('id')
      .eq('instituicao_id', instituicaoId)
      .eq('label', normalizedLabel)
      .maybeSingle();

    if (!error && data?.id) {
      return data.id as string;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('instituicao_contato_tipos')
      .insert([
        {
          instituicao_id: instituicaoId,
          label: normalizedLabel,
          ordem: 999,
          ativo: true,
        },
      ])
      .select('id')
      .maybeSingle();

    if (insertError || !inserted?.id) {
      return null;
    }

    return inserted.id as string;
  } catch {
    return null;
  }
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

    if (!data?.id) {
      return data ?? null;
    }

    const cnaes = await loadInstituicaoCnaes(data.id);

    return {
      ...data,
      cnaes,
    };
  } catch (error) {
    return null;
  }
}

export async function getEnderecos() {
  const supabase = createServiceRoleClient();
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return [];
  }

  try {
    const { data, error } = await supabase.from('instituicao_enderecos').select('*').eq('instituicao_id', instituicaoId);

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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return [];
  }

  try {
    const [contatosResult, tiposResult] = await Promise.all([
      supabase.from('instituicao_contatos').select('*').eq('instituicao_id', instituicaoId),
      supabase.from('instituicao_contato_tipos').select('id, label').eq('instituicao_id', instituicaoId),
    ]);

    if (contatosResult.error) {
      return [];
    }

    const tiposMap = new Map((tiposResult.data || []).map((tipo) => [tipo.id, tipo.label]));

    return (contatosResult.data || []).map((contato) => ({
      ...contato,
      tipo: contato.tipo || (contato.tipo_id ? tiposMap.get(contato.tipo_id) ?? null : null),
    }));
  } catch (error) {
    return [];
  }
}

export async function getContasBancarias() {
  const supabase = createServiceRoleClient();
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return [];
  }

  try {
    const { data, error } = await supabase.from('contas_bancarias').select('*').eq('instituicao_id', instituicaoId);

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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('instituicao_contato_tipos')
      .select('id, label, ordem, ativo')
      .eq('instituicao_id', instituicaoId)
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
    porte: normalizePorteCnpj(formData.porte),
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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false, error: 'Instituição principal não encontrada.' };
  }

  try {
    const { data, error } = await supabase
      .from('instituicao_enderecos')
      .select('id')
      .eq('instituicao_id', instituicaoId)
      .limit(1)
      .maybeSingle();

    if (error?.code && error.code !== 'PGRST116' && hasMeaningfulError(error)) {
      return { success: false, error: error.message };
    }

    if (data?.id) {
      const { error: updateError } = await supabase
        .from('instituicao_enderecos')
        .update(formData)
        .eq('id', data.id)
        .eq('instituicao_id', instituicaoId);

      if (updateError) return { success: false, error: updateError.message };
    } else {
      const { error: insertError } = await supabase.from('instituicao_enderecos').insert([
        {
          ...formData,
          instituicao_id: instituicaoId,
        },
      ]);

      if (insertError) return { success: false, error: insertError.message };
    }
  } catch (error) {
    return { success: false, error: 'Erro ao salvar endereço' };
  }

  return { success: true };
}

export async function addContato(formData: {
  tipo?: string;
  tipo_id?: string;
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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false, error: 'Instituição principal não encontrada.' };
  }

  if (formData.responsavel_id) {
    const { data, error } = await supabase.from('pessoas').select('id').eq('id', formData.responsavel_id).maybeSingle();

    if (error || !data) {
      return { success: false, error: 'Pessoa responsável não encontrada.' };
    }
  }

  const tipoId = await resolveContatoTipoId(instituicaoId, formData.tipo_id, formData.tipo);

  const { error } = await supabase.from('instituicao_contatos').insert([
    {
      instituicao_id: instituicaoId,
      tipo_id: tipoId,
      telefone: formData.telefone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      instagram: formData.instagram,
      facebook: formData.facebook,
      youtube: formData.youtube,
      site: formData.site,
      responsavel_id: formData.responsavel_id,
      ativo: true,
    },
  ]);

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
  const instituicaoId = await getMainInstituicaoId();

  if (!label) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Informe o nome do tipo.' }));
  }

  if (!instituicaoId) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Instituição principal não encontrada.' }));
  }

  const { error } = await supabase.from('instituicao_contato_tipos').upsert(
    [
      {
        instituicao_id: instituicaoId,
        label,
        ordem: 999,
        ativo: true,
      },
    ],
    { onConflict: 'instituicao_id,label' }
  );

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
  const instituicaoId = await getMainInstituicaoId();

  if (!id) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Tipo inválido.' }));
  }

  if (!label) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Informe o nome do tipo.' }));
  }

  if (!instituicaoId) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Instituição principal não encontrada.' }));
  }

  const { error } = await supabase
    .from('instituicao_contato_tipos')
    .update({
      label,
      ordem: ordemRaw && !Number.isNaN(Number(ordemRaw)) ? Number(ordemRaw) : 999,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('instituicao_id', instituicaoId);

  if (error) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: `Não foi possível atualizar o tipo: ${error.message}` }));
  }

  revalidateTag('admin-instituicao-contato-tipos');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Tipo atualizado.' }));
}

export async function deleteContatoTipo(formData: FormData) {
  const supabase = createServiceRoleClient();
  const id = formDataText(formData, 'id');
  const instituicaoId = await getMainInstituicaoId();

  if (!id) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Tipo inválido.' }));
  }

  if (!instituicaoId) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Instituição principal não encontrada.' }));
  }

  const { error } = await supabase.from('instituicao_contato_tipos').delete().eq('id', id).eq('instituicao_id', instituicaoId);

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
    tipo_id?: string;
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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false, error: 'Instituição principal não encontrada.' };
  }

  if (formData.responsavel_id) {
    const { data, error } = await supabase.from('pessoas').select('id').eq('id', formData.responsavel_id).maybeSingle();

    if (error || !data) {
      return { success: false, error: 'Pessoa responsável não encontrada.' };
    }
  }

  const tipoId = await resolveContatoTipoId(instituicaoId, formData.tipo_id, formData.tipo);

  const { error } = await supabase
    .from('instituicao_contatos')
    .update({
      telefone: formData.telefone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      instagram: formData.instagram,
      facebook: formData.facebook,
      youtube: formData.youtube,
      site: formData.site,
      responsavel_id: formData.responsavel_id,
      tipo_id: tipoId,
    })
    .eq('id', id)
    .eq('instituicao_id', instituicaoId);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function deleteContato(id: string) {
  const supabase = createServiceRoleClient();
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false };
  }

  const { error } = await supabase.from('instituicao_contatos').delete().eq('id', id).eq('instituicao_id', instituicaoId);

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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false, error: 'Instituição principal não encontrada.' };
  }

  const { error } = await supabase.from('contas_bancarias').insert([
    {
      ...formData,
      instituicao_id: instituicaoId,
      ativo: true,
    },
  ]);

  if (error) return { success: false, error: error.message };

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
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false };
  }

  const { error } = await supabase
    .from('contas_bancarias')
    .update(formData)
    .eq('id', id)
    .eq('instituicao_id', instituicaoId);

  if (error) return { success: false };

  return { success: true };
}

export async function deleteContaBancaria(id: string) {
  const supabase = createServiceRoleClient();
  const instituicaoId = await getMainInstituicaoId();

  if (!instituicaoId) {
    return { success: false };
  }

  const { error } = await supabase.from('contas_bancarias').delete().eq('id', id).eq('instituicao_id', instituicaoId);

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
