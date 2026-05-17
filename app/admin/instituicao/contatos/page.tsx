import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const dynamic = 'force-dynamic';

export default function ContatosInstituicaoPage() {
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'info', message: 'Use a aba de contatos para editar.' }));
}
