'use server';

import { createClient } from '@/lib/supabase/server';

export interface CreateNotificationInput {
  pessoa_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'sistema' | 'alerta' | 'sucesso' | 'info';
  canal?: 'interno' | 'email' | 'whatsapp';
  modulo_origem?: string;
}

/**
 * Create a notification in the database
 * Status will be 'pendente' by default and processed asynchronously
 */
export async function criarNotificacao(input: CreateNotificationInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notificacoes')
    .insert({
      pessoa_id: input.pessoa_id,
      titulo: input.titulo,
      mensagem: input.mensagem,
      tipo: input.tipo,
      canal: input.canal || 'interno',
      modulo_origem: input.modulo_origem,
      status: 'pendente',
      criado_em: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
}

/**
 * Create bulk notifications for multiple people
 */
export async function criarNotificacoesBatch(
  pessoaIds: string[],
  titulo: string,
  mensagem: string,
  tipo: 'sistema' | 'alerta' | 'sucesso' | 'info',
  canal?: 'interno' | 'email' | 'whatsapp',
  modulo_origem?: string
) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const notificacoes = pessoaIds.map(pessoa_id => ({
    pessoa_id,
    titulo,
    mensagem,
    tipo,
    canal: canal || 'interno',
    modulo_origem,
    status: 'pendente',
    criado_em: now,
  }));

  const { data, error } = await supabase
    .from('notificacoes')
    .insert(notificacoes)
    .select();

  if (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }

  return data;
}

/**
 * Notify about module changes
 * Usage: criarNotificacaoModulo('pessoa-id', 'escalas', 'Nova escala de maio foi publicada', 'sucesso')
 */
export async function criarNotificacaoModulo(
  pessoa_id: string,
  modulo: 'escalas' | 'biblioteca' | 'livraria' | 'financeiro' | 'estudos' | 'atendimento' | 'comunicacao' | 'apse',
  mensagem: string,
  tipo: 'sistema' | 'alerta' | 'sucesso' | 'info' = 'info'
) {
  return criarNotificacao({
    pessoa_id,
    titulo: `Atualização: ${modulo}`,
    mensagem,
    tipo,
    canal: 'interno',
    modulo_origem: modulo,
  });
}

/**
 * Notify about errors
 */
export async function criarNotificacaoErro(
  pessoa_id: string,
  titulo: string,
  detalhes: string,
  modulo?: string
) {
  return criarNotificacao({
    pessoa_id,
    titulo: `⚠️ ${titulo}`,
    mensagem: detalhes,
    tipo: 'alerta',
    canal: 'interno',
    modulo_origem: modulo,
  });
}
