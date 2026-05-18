import { loadUserArea } from '@/lib/areas/user-area';

export async function buildTitularExport(userId: string) {
  const area = await loadUserArea(userId);

  return {
    generated_at: new Date().toISOString(),
    scope: 'titular-data-export',
    user_id: userId,
    data: {
      perfil: area.perfil,
      usuario: area.usuario,
      pessoa: area.pessoa,
      siteRole: area.siteRole,
      hasAdminAccess: area.hasAdminAccess,
      emprestimos: area.emprestimos,
      reservas: area.reservas,
      movimentosLivraria: area.movimentosLivraria,
      escalas: area.escalas,
      voluntariados: area.voluntariados,
      consentimentos: area.consentimentos,
      pedidosTitular: area.pedidosTitular,
    },
  };
}
