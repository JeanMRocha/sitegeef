import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ContatosInstituicaoPage() {
  redirect('/admin/instituicao/editar?tab=contatos');
}
