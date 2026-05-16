import { createClient } from '@/lib/supabase/server';

export type PermissionFlag =
  | 'pode_escalas'
  | 'pode_biblioteca'
  | 'pode_livraria'
  | 'pode_financeiro'
  | 'pode_pessoas'
  | 'pode_publicar'
  | 'pode_mediunidade'
  | 'pode_atendimento'
  | 'pode_apse';

export async function getUserPermissions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: usuarioSistema } = await supabase
    .from('usuarios_sistema')
    .select('id, pessoa_id, perfil, pode_escalas, pode_biblioteca, pode_livraria, pode_financeiro, pode_pessoas, pode_publicar, pode_mediunidade, pode_atendimento, pode_apse')
    .eq('id', user.id)
    .maybeSingle();

  return usuarioSistema;
}

export async function requirePermission(permission: PermissionFlag, redirectPath = '/admin') {
  const permissions = await getUserPermissions();

  if (!permissions || !permissions[permission]) {
    throw new Error(`Access denied: ${permission} required`);
  }

  return permissions;
}

export async function checkPermission(permission: PermissionFlag): Promise<boolean> {
  const permissions = await getUserPermissions();
  return permissions ? permissions[permission] === true : false;
}
