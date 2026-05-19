'use server';

import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateAdminDocumentosCache } from '@/lib/admin/cache';
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';
import { sendEmailNotification } from '@/lib/notificacoes/email-service';
import { recordOpsEvent } from '@/lib/ops-events';
import { recordActionFailureEvent, recordSupabaseFailureEvent } from '@/lib/observability';

async function recordDocumentosAuditEvent(
  source: string,
  message: string,
  payload: Record<string, unknown> = {}
) {
  try {
    await recordOpsEvent({
      source,
      eventType: 'log',
      level: 'info',
      message,
      payload,
    });
  } catch {
    // A auditoria não pode bloquear o fluxo principal.
  }
}

async function notifyTitularRequestStakeholders(
  solicitacao: {
    id: string;
    request_type: string;
    titular_nome?: string | null;
    titular_email?: string | null;
    status?: string | null;
    responsavel_id?: string | null;
    resposta?: string | null;
  },
  action: 'created' | 'updated'
) {
  try {
    const supabase = createServiceRoleClient();
    const fallbackEmail = process.env.LGPD_ENCARREGADO_EMAIL || process.env.LGPD_COMPLIANCE_EMAIL || null;
    const titulo =
      action === 'created'
        ? 'Novo pedido LGPD'
        : 'Pedido LGPD atualizado';
    const mensagemBase =
      action === 'created'
        ? `Novo pedido do titular registrado: ${solicitacao.request_type}.`
        : `Pedido do titular atualizado para ${solicitacao.status || 'sem status'}.`;
    const mensagem = [
      mensagemBase,
      solicitacao.titular_nome ? `Titular: ${solicitacao.titular_nome}` : null,
      solicitacao.titular_email ? `Email: ${solicitacao.titular_email}` : null,
      solicitacao.resposta ? `Resposta: ${solicitacao.resposta}` : null,
      `Abrir: /admin/documentos/pedidos/${solicitacao.id}`,
    ]
      .filter(Boolean)
      .join('\n');

    let targetPessoaId = solicitacao.responsavel_id || null;
    let targetNome = 'Encarregado LGPD';
    let targetEmail = fallbackEmail;
    let notificacaoId: string | null = null;

    if (targetPessoaId) {
      const { data: responsavel } = await supabase
        .from('pessoas')
        .select('id, nome, email')
        .eq('id', targetPessoaId)
        .maybeSingle();

      if (responsavel?.nome) {
        targetNome = responsavel.nome;
      }

      if (responsavel?.email) {
        targetEmail = responsavel.email;
      }
    }

    if (targetPessoaId || targetEmail) {
      const { data: notificacao, error: notificacaoError } = await supabase
        .from('notificacoes')
        .insert({
          pessoa_id: targetPessoaId || null,
          tipo: action === 'created' ? 'alerta' : 'sistema',
          titulo,
          mensagem,
          canal: 'email',
          modulo_origem: 'lgpd',
          status: 'pendente',
          criado_em: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (notificacaoError) {
        await recordSupabaseFailureEvent({
          source: 'admin/documentos/lgpd',
          operation: 'insert notificacoes',
          table: 'notificacoes',
          error: notificacaoError,
          fallback: 'null',
          level: 'warn',
          payload: { solicitacao_id: solicitacao.id, action },
        });
      }

      notificacaoId = notificacao?.id || null;
    }

    if (targetEmail) {
      const emailResult = await sendEmailNotification({
        pessoaId: targetPessoaId || 'lgpd-encarregado',
        email: targetEmail,
        nome: targetNome,
        titulo,
        mensagem,
        tipo: action === 'created' ? 'alerta' : 'sistema',
        modulo_origem: 'lgpd',
        link_acao: `/admin/documentos/pedidos/${solicitacao.id}`,
      });

      if (emailResult.success && notificacaoId) {
        await supabase
          .from('notificacoes')
          .update({
            status: 'enviado',
            enviado_em: new Date().toISOString(),
          })
          .eq('id', notificacaoId);
      } else if (!emailResult.success) {
        await recordActionFailureEvent({
          source: 'admin/documentos/lgpd',
          action: 'sendEmailNotification',
          message: 'Falha ao enviar notificação LGPD por email.',
          payload: {
            solicitacao_id: solicitacao.id,
            email: targetEmail,
            action,
            error: emailResult.error ?? null,
          },
          level: 'warn',
        });
      }
    }
  } catch (error) {
    await recordActionFailureEvent({
      source: 'admin/documentos/lgpd',
      action: 'notifyTitularRequestStakeholders',
      message: 'Falha ao processar notificação LGPD.',
      error,
      payload: { solicitacao_id: solicitacao.id, action },
      level: 'warn',
    });
  }
}

async function loadModelosDocumentos() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('documentos_modelo')
    .select('*')
    .eq('ativo', true)
    .order('tipo');

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'loadModelosDocumentos',
      table: 'documentos_modelo',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export const getModelosDocumentos = unstable_cache(loadModelosDocumentos, ['admin-documentos-modelos'], {
  revalidate: 60,
  tags: ['admin-documentos'],
});

export async function getModeloById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('documentos_modelo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'getModeloById',
      table: 'documentos_modelo',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function createModelo(formData: {
  tipo: string;
  titulo: string;
  versao?: string;
  conteudo?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('documentos_modelo')
    .insert([
      {
        tipo: formData.tipo,
        titulo: formData.titulo,
        versao: formData.versao || null,
        conteudo: formData.conteudo || null,
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) return null;

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/modelos', 'Modelo de documento criado', {
    modelo_id: data.id,
    tipo: data.tipo,
  });
  return data;
}

export async function updateModelo(
  id: string,
  formData: {
    tipo?: string;
    titulo?: string;
    versao?: string;
    conteudo?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('documentos_modelo')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/modelos', 'Modelo de documento atualizado', {
    modelo_id: id,
  });
  return { success: true };
}

export async function toggleModeloStatus(id: string, ativo: boolean) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('documentos_modelo')
    .update({ ativo })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/modelos', 'Status de modelo alterado', {
    modelo_id: id,
    ativo,
  });
  return { success: true };
}

type TitularSolicitacaoStatus = 'aberta' | 'em_andamento' | 'respondida' | 'encerrada';

function normalizeSolicitacaoStatus(status?: string): TitularSolicitacaoStatus | 'all' {
  if (
    status === 'aberta' ||
    status === 'em_andamento' ||
    status === 'respondida' ||
    status === 'encerrada'
  ) {
    return status;
  }

  return 'all';
}

async function loadTitularSolicitacoes(page = 1, status?: string) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;
  const normalizedStatus = normalizeSolicitacaoStatus(status);

  let query = supabase
    .from('lgpd_solicitacoes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (normalizedStatus !== 'all') {
    query = query.eq('status', normalizedStatus);
  }

  const { data, count, error } = await query;

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'loadTitularSolicitacoes',
      table: 'lgpd_solicitacoes',
      error,
      fallback: 'empty_list',
    });
    return {
      solicitacoes: [],
      total: 0,
      page,
      pageSize,
    };
  }

  return {
    solicitacoes: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getTitularSolicitacoes(page = 1, status?: string) {
  return loadTitularSolicitacoes(page, status);
}

export async function getTitularSolicitacaoById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('lgpd_solicitacoes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'getTitularSolicitacaoById',
      table: 'lgpd_solicitacoes',
      error,
      fallback: 'null',
    });
    return null;
  }

  return data;
}

export async function createTitularSolicitacao(formData: {
  user_id: string;
  pessoa_id?: string | null;
  titular_nome?: string | null;
  titular_email?: string | null;
  request_type: string;
  details?: string | null;
  origem?: string | null;
  status?: string;
  resposta?: string | null;
  resolvido_em?: string | null;
  prazo_resposta?: string | null;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('lgpd_solicitacoes')
    .insert([
      {
        user_id: formData.user_id,
        pessoa_id: formData.pessoa_id || null,
        titular_nome: formData.titular_nome || null,
        titular_email: formData.titular_email || null,
        request_type: formData.request_type,
        details: formData.details || null,
        origem: formData.origem || 'minha-area',
        status: formData.status || 'aberta',
        resposta: formData.resposta || null,
        resolvido_em: formData.resolvido_em || null,
        prazo_resposta: formData.prazo_resposta || null,
      },
    ])
    .select()
    .single();

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'createTitularSolicitacao',
      table: 'lgpd_solicitacoes',
      error,
      fallback: 'null',
      level: 'error',
    });
    return null;
  }

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await notifyTitularRequestStakeholders(data, 'created');
  await recordDocumentosAuditEvent('user-area/lgpd', 'Pedido do titular registrado', {
    solicitacao_id: data.id,
    pessoa_id: formData.pessoa_id || null,
    request_type: formData.request_type,
  });

  return data;
}

export async function updateTitularSolicitacao(
  id: string,
  formData: {
    status?: string;
    responsavel_id?: string | null;
    resposta?: string | null;
    prazo_resposta?: string | null;
  }
) {
  const supabase = createServiceRoleClient();
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (formData.status) {
    patch.status = formData.status;
    if (formData.status === 'respondida' || formData.status === 'encerrada') {
      patch.resolvido_em = new Date().toISOString();
    } else {
      patch.resolvido_em = null;
    }
  }

  if (formData.responsavel_id !== undefined) {
    patch.responsavel_id = formData.responsavel_id || null;
  }

  if (formData.resposta !== undefined) {
    patch.resposta = formData.resposta || null;
  }

  if (formData.prazo_resposta !== undefined) {
    patch.prazo_resposta = formData.prazo_resposta || null;
  }

  const { error } = await supabase
    .from('lgpd_solicitacoes')
    .update(patch)
    .eq('id', id);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'updateTitularSolicitacao',
      table: 'lgpd_solicitacoes',
      error,
      fallback: 'false',
      level: 'error',
    });
    return { success: false };
  }

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  const { data: solicitacao } = await supabase
    .from('lgpd_solicitacoes')
    .select('id, request_type, titular_nome, titular_email, status, responsavel_id, resposta')
    .eq('id', id)
    .maybeSingle();

  if (solicitacao) {
    await notifyTitularRequestStakeholders(solicitacao, 'updated');
  }

  await recordDocumentosAuditEvent('admin/documentos/pedidos', 'Pedido do titular atualizado', {
    solicitacao_id: id,
    status: formData.status || null,
    responsavel_id: formData.responsavel_id || null,
  });

  return { success: true };
}

async function loadTermosAssinados(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('termos_assinados')
    .select(
      `
      *,
      pessoas (nome, email),
      documentos_modelo (tipo, titulo)
    `,
      { count: 'exact' }
    )
    .order('data_assinatura', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'loadTermosAssinados',
      table: 'termos_assinados',
      error,
      fallback: 'empty_list',
    });
    return {
      termos: [],
      total: 0,
      page,
      pageSize,
    };
  }

  return {
    termos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getTermosAssinados = unstable_cache(loadTermosAssinados, ['admin-documentos-termos'], {
  revalidate: 60,
  tags: ['admin-documentos'],
});

export async function getTermoById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('termos_assinados')
    .select(
      `
      *,
      pessoas (id, nome, email),
      documentos_modelo (tipo, titulo, versao, conteudo)
    `
    )
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function createTermo(formData: {
  pessoa_id: string;
  modelo_id: string;
  data_assinatura?: string;
  validade?: string;
  arquivo_url?: string;
  responsavel_id?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('termos_assinados')
    .insert([
      {
        pessoa_id: formData.pessoa_id,
        responsavel_id: formData.responsavel_id || null,
        modelo_id: formData.modelo_id,
        data_assinatura: formData.data_assinatura || new Date().toISOString().split('T')[0],
        validade: formData.validade || null,
        arquivo_url: formData.arquivo_url || null,
        status: 'ativo',
      },
    ])
    .select()
    .single();

  if (error) return null;

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/termos', 'Termo assinado criado', {
    termo_id: data.id,
    pessoa_id: formData.pessoa_id,
    modelo_id: formData.modelo_id,
    responsavel_id: formData.responsavel_id || null,
  });
  return data;
}

export async function updateTermo(
  id: string,
  formData: {
    data_assinatura?: string;
    validade?: string;
    arquivo_url?: string;
    status?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('termos_assinados')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/termos', 'Termo assinado atualizado', {
    termo_id: id,
  });
  return { success: true };
}

export async function revogaTermo(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('termos_assinados')
    .update({ status: 'revogado' })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/termos', 'Termo revogado', {
    termo_id: id,
  });
  return { success: true };
}

async function loadConsentimentosLGPD(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('consentimentos_lgpd')
    .select(
      `
      *,
      pessoas (nome, email)
    `,
      { count: 'exact' }
    )
    .order('data_consentimento', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'loadConsentimentosLGPD',
      table: 'consentimentos_lgpd',
      error,
      fallback: 'empty_list',
    });
    return {
      consentimentos: [],
      total: 0,
      page,
      pageSize,
    };
  }

  return {
    consentimentos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getConsentimentosLGPD = unstable_cache(loadConsentimentosLGPD, ['admin-documentos-consentimentos'], {
  revalidate: 60,
  tags: ['admin-documentos'],
});

export async function getConsentimentoById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('consentimentos_lgpd')
    .select(
      `
      *,
      pessoas (id, nome, email)
    `
    )
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function createConsentimento(formData: {
  pessoa_id: string;
  finalidade: string;
  base_legal?: string;
  canal_autorizado?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('consentimentos_lgpd')
    .insert([
      {
        pessoa_id: formData.pessoa_id,
        finalidade: formData.finalidade,
        base_legal: formData.base_legal || null,
        canal_autorizado: formData.canal_autorizado || null,
        status: 'ativo',
      },
    ])
    .select()
    .single();

  if (error) return null;

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/consentimentos', 'Consentimento criado', {
    consentimento_id: data.id,
    pessoa_id: formData.pessoa_id,
    base_legal: formData.base_legal || null,
  });
  return data;
}

export async function revogaConsentimento(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('consentimentos_lgpd')
    .update({ status: 'revogado', data_revogacao: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/consentimentos', 'Consentimento revogado', {
    consentimento_id: id,
  });
  return { success: true };
}

async function loadServicosVoluntarios(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('servicos_voluntarios')
    .select(
      `
      *,
      pessoas (nome, email),
      departamentos (nome)
    `,
      { count: 'exact' }
    )
    .eq('status', 'ativo')
    .order('data_inicio', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'loadServicosVoluntarios',
      table: 'servicos_voluntarios',
      error,
      fallback: 'empty_list',
    });
    return {
      servicos: [],
      total: 0,
      page,
      pageSize,
    };
  }

  return {
    servicos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getServicosVoluntarios = unstable_cache(loadServicosVoluntarios, ['admin-documentos-servicos'], {
  revalidate: 60,
  tags: ['admin-documentos'],
});

export async function getServicoById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('servicos_voluntarios')
    .select(
      `
      *,
      pessoas (id, nome, email),
      departamentos (id, nome)
    `
    )
    .eq('id', id)
    .single();

  if (error) return null;

  return data;
}

export async function createServico(formData: {
  pessoa_id: string;
  departamento_id: string;
  servico: string;
  horarios?: string;
  termo_url?: string;
  data_inicio?: string;
  data_fim?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('servicos_voluntarios')
    .insert([
      {
        pessoa_id: formData.pessoa_id,
        departamento_id: formData.departamento_id,
        servico: formData.servico,
        horarios: formData.horarios || null,
        termo_url: formData.termo_url || null,
        data_inicio: formData.data_inicio || new Date().toISOString().split('T')[0],
        data_fim: formData.data_fim || null,
        status: 'ativo',
      },
    ])
    .select()
    .single();

  if (error) return null;

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/voluntariado', 'Serviço voluntário criado', {
    servico_id: data.id,
    pessoa_id: formData.pessoa_id,
    departamento_id: formData.departamento_id,
  });
  return data;
}

export async function updateServico(
  id: string,
  formData: {
    servico?: string;
    horarios?: string;
    termo_url?: string;
    data_inicio?: string;
    data_fim?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('servicos_voluntarios')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/voluntariado', 'Serviço voluntário atualizado', {
    servico_id: id,
  });
  return { success: true };
}

export async function encerraServico(id: string, data_fim: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('servicos_voluntarios')
    .update({ status: 'finalizado', data_fim })
    .eq('id', id);

  if (error) return { success: false };

  invalidateAdminDocumentosCache();
  invalidateUserAreaCache();
  await recordDocumentosAuditEvent('admin/documentos/voluntariado', 'Serviço voluntário encerrado', {
    servico_id: id,
    data_fim,
  });
  return { success: true };
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome, email')
    .eq('status', 'ativo')
    .order('nome');

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'getPessoasDisponiveis',
      table: 'pessoas',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}

export async function getDepartamentosDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('departamentos')
    .select('id, nome')
    .eq('ativo', true)
    .order('nome');

  if (error) {
    await recordSupabaseFailureEvent({
      source: 'admin/documentos',
      operation: 'getDepartamentosDisponiveis',
      table: 'departamentos',
      error,
      fallback: 'empty_list',
    });
    return [];
  }

  return data || [];
}
