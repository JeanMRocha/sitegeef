'use server';

import { createClient } from '@/lib/supabase/server';
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';

export async function getUsuarios(page = 1) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from('usuarios_sistema')
    .select(
      `
      id,
      perfil,
      pessoa_id,
      pode_escalas,
      pode_biblioteca,
      pode_livraria,
      pode_financeiro,
      pode_pessoas,
      pode_publicar,
      pode_mediunidade,
      pode_atendimento,
      pode_apse,
      pessoas (nome, email)
    `,
      { count: 'exact' }
    )
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    usuarios: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getUsuarioById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('usuarios_sistema')
    .select(
      `
      *,
      pessoas (*)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function getPessoasSemLogin() {
  const supabase = await createClient();

  const { data: todasPessoas, error: erroTodas } = await supabase.from('pessoas').select('id, nome, email');

  if (erroTodas) throw erroTodas;

  const { data: usuariosExistentes, error: erroUsuarios } = await supabase
    .from('usuarios_sistema')
    .select('pessoa_id');

  if (erroUsuarios) throw erroUsuarios;

  const pessoasComLogin = new Set(usuariosExistentes?.map((u: any) => u.pessoa_id) || []);

  return (todasPessoas || []).filter((p: any) => !pessoasComLogin.has(p.id));
}

export async function grantLogin(
  userId: string,
  pessoaId: string,
  perfil: string,
  permissoes: {
    pode_escalas?: boolean;
    pode_biblioteca?: boolean;
    pode_livraria?: boolean;
    pode_financeiro?: boolean;
    pode_pessoas?: boolean;
    pode_publicar?: boolean;
    pode_mediunidade?: boolean;
    pode_atendimento?: boolean;
    pode_apse?: boolean;
  } = {}
) {
  const supabase = await createClient();

  const { error } = await supabase.from('usuarios_sistema').insert([
    {
      id: userId,
      pessoa_id: pessoaId,
      perfil,
      pode_escalas: permissoes.pode_escalas || false,
      pode_biblioteca: permissoes.pode_biblioteca || false,
      pode_livraria: permissoes.pode_livraria || false,
      pode_financeiro: permissoes.pode_financeiro || false,
      pode_pessoas: permissoes.pode_pessoas || false,
      pode_publicar: permissoes.pode_publicar || false,
      pode_mediunidade: permissoes.pode_mediunidade || false,
      pode_atendimento: permissoes.pode_atendimento || false,
      pode_apse: permissoes.pode_apse || false,
    },
  ]);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}

export async function updateUsuario(
  id: string,
  data: {
    perfil?: string;
    pode_escalas?: boolean;
    pode_biblioteca?: boolean;
    pode_livraria?: boolean;
    pode_financeiro?: boolean;
    pode_pessoas?: boolean;
    pode_publicar?: boolean;
    pode_mediunidade?: boolean;
    pode_atendimento?: boolean;
    pode_apse?: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from('usuarios_sistema').update(data).eq('id', id);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}

export async function revokeLogin(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('usuarios_sistema').delete().eq('id', id);

  if (error) throw error;

  invalidateUserAreaCache();
  return { success: true };
}
