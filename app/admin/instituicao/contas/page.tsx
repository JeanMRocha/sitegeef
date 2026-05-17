import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const dynamic = 'force-dynamic';

export default function ContasInstituicaoPage() {
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contas', { variant: 'info', message: 'Use a aba de contas para editar.' }));
}
