'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';
import { calculateOffset } from '@/lib/admin/query-helpers';

const TEST_EMAIL_PATTERNS = [/^codex-profile-/i, /^codex-test-/i];

function isTestAuthUser(user: any) {
  const email = String(user?.email || '').toLowerCase();

  if (!email) return false;

  if (TEST_EMAIL_PATTERNS.some((pattern) => pattern.test(email))) {
    return true;
  }

  if (user?.user_metadata?.is_test === true || user?.user_metadata?.test_account === true) {
    return true;
  }

  return false;
}

async function listAllAuthUsers(supabase: ReturnType<typeof createServiceRoleClient>) {
  const pageSize = 100;
  let page = 1;
  let allUsers: any[] = [];
  let lastPage = 1;

  while (page <= lastPage) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: pageSize,
    });

    if (error) return [];

    const pageUsers = data?.users || [];
    allUsers = allUsers.concat(pageUsers);
    lastPage = data?.lastPage || page;

    if (!data?.nextPage) break;
    page = data.nextPage;
  }

  return allUsers.filter((user) => !isTestAuthUser(user));
}

export async function getUsuarios(page = 1) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;

  try {
    const authRows = await listAllAuthUsers(supabase);
    const authIds = authRows.map((user) => user.id);

    let adminRows: any[] = [];

    if (authIds.length > 0) {
      const { data, error } = await supabase
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
        `
        )
        .in('id', authIds);

      adminRows = data || [];
    }

    const adminMap = new Map(adminRows.map((row: any) => [row.id, row]));
    const startIndex = calculateOffset(page, pageSize);
    const endIndex = startIndex + pageSize;
    const pageUsers = authRows.slice(startIndex, endIndex);

    const usuarios = pageUsers.map((user: any) => {
      const adminRow = adminMap.get(user.id);
      const pessoa = adminRow?.pessoas ?? null;

      return {
        id: user.id,
        email: user.email || pessoa?.email || null,
        nome:
          pessoa?.nome ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          'Sem nome',
        perfil: adminRow?.perfil || 'publico',
        pessoa_id: adminRow?.pessoa_id || null,
        pode_escalas: Boolean(adminRow?.pode_escalas),
        pode_biblioteca: Boolean(adminRow?.pode_biblioteca),
        pode_livraria: Boolean(adminRow?.pode_livraria),
        pode_financeiro: Boolean(adminRow?.pode_financeiro),
        pode_pessoas: Boolean(adminRow?.pode_pessoas),
        pode_publicar: Boolean(adminRow?.pode_publicar),
        pode_mediunidade: Boolean(adminRow?.pode_mediunidade),
        pode_atendimento: Boolean(adminRow?.pode_atendimento),
        pode_apse: Boolean(adminRow?.pode_apse),
        created_at: user.created_at,
        confirmed_at: user.confirmed_at,
        has_admin_record: Boolean(adminRow),
        pessoas: pessoa,
      };
    });

    return {
      usuarios,
      total: authRows.length,
      page,
      pageSize,
      erro: null,
    };
  } catch {
    return {
      usuarios: [],
      total: 0,
      page,
      pageSize,
      erro: 'Não foi possível carregar a lista de usuários.',
    };
  }
}

export async function getUsuarioById(id: string) {
  const supabase = createServiceRoleClient();

  try {
    const [{ data: authUser, error: authError }, { data: adminRecord, error: adminError }] = await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase
        .from('usuarios_sistema')
        .select(
          `
          *,
          pessoas (*)
        `
        )
        .eq('id', id)
        .maybeSingle(),
    ]);

    if (authError) throw authError;
    if (!authUser?.user && !adminRecord) {
      return null;
    }

    const user = authUser?.user;

    if (user && isTestAuthUser(user)) {
      return null;
    }

    return {
      id: user?.id || adminRecord?.id || id,
      email: user?.email || adminRecord?.pessoas?.email || null,
      nome:
        adminRecord?.pessoas?.nome ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        'Sem nome',
      perfil: adminRecord?.perfil || 'publico',
      pessoa_id: adminRecord?.pessoa_id || null,
      pode_escalas: Boolean(adminRecord?.pode_escalas),
      pode_biblioteca: Boolean(adminRecord?.pode_biblioteca),
      pode_livraria: Boolean(adminRecord?.pode_livraria),
      pode_financeiro: Boolean(adminRecord?.pode_financeiro),
      pode_pessoas: Boolean(adminRecord?.pode_pessoas),
      pode_publicar: Boolean(adminRecord?.pode_publicar),
      pode_mediunidade: Boolean(adminRecord?.pode_mediunidade),
      pode_atendimento: Boolean(adminRecord?.pode_atendimento),
      pode_apse: Boolean(adminRecord?.pode_apse),
      pessoas: adminRecord?.pessoas || null,
      auth_user: user || null,
    };
  } catch {
    return null;
  }
}

export async function getPessoasSemLogin() {
  const supabase = createServiceRoleClient();

  try {
    const { data: todasPessoas, error: erroTodas } = await supabase.from('pessoas').select('id, nome, email');

    if (erroTodas) throw erroTodas;

    const { data: usuariosExistentes, error: erroUsuarios } = await supabase
      .from('usuarios_sistema')
      .select('pessoa_id');

    if (erroUsuarios) throw erroUsuarios;

    const pessoasComLogin = new Set(usuariosExistentes?.map((u: any) => u.pessoa_id) || []);

    return {
      pessoas: (todasPessoas || []).filter((p: any) => !pessoasComLogin.has(p.id)),
      erro: null,
    };
  } catch {
    return {
      pessoas: [],
      erro: 'Não foi possível carregar as pessoas disponíveis.',
    };
  }
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
  const supabase = createServiceRoleClient();

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

  if (error) return null;

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
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from('usuarios_sistema').update(data).eq('id', id);

  if (error) return null;

  invalidateUserAreaCache();
  return { success: true };
}

export async function revokeLogin(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from('usuarios_sistema').delete().eq('id', id);

  if (error) return { success: false };

  invalidateUserAreaCache();
  return { success: true };
}
