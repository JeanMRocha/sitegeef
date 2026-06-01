import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTermo, getPessoasDisponiveis, getModelosDocumentos } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Termo Assinado - Admin GEEF',
};

type PessoaOption = {
  id: string;
  nome: string;
};

type ModeloOption = {
  id: string;
  tipo?: string | null;
  titulo?: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const termo = await createTermo({
      pessoa_id: formData.get('pessoa_id') as string,
      modelo_id: formData.get('modelo_id') as string,
      data_assinatura: (formData.get('data_assinatura') as string) || undefined,
      validade: (formData.get('validade') as string) || undefined,
      arquivo_url: (formData.get('arquivo_url') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${termo.id}`, { variant: 'success', message: 'Termo criado.' }));
  } catch (error) {
    console.error('Erro ao criar termo:', error);
    redirect(buildFlashNoticeUrl('/admin/documentos/termos', { variant: 'error', message: 'Não foi possível criar o termo.' }));
    return;
  }
}

export default async function NovoTermoPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaOption[];
  const modelos = (await getModelosDocumentos()) as ModeloOption[];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Termo Assinado</h1>
          <p className="admin-page-subtitle">Registre apenas o necessário para comprovação e vigência.</p>
        </div>
      </div>

      <div className="admin-card panel-accent-card">
        <p className="panel-note">
          Confira o modelo antes de salvar e evite anexar arquivo externo se o conteúdo já estiver no cadastro.
        </p>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <LgpdFormNotice
          title="Termo assinado"
          text="Registre apenas a prova necessária e mantenha a vigência e a finalidade visíveis."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
              required
              className="profile-form-input form-control-full"
            >
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Modelo *</label>
            <select
              name="modelo_id"
              required
              className="profile-form-input form-control-full"
            >
              <option value="">— Selecione —</option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.tipo} - {m.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-auto-300 mb-1-5">
            <div className="admin-form-group">
              <label>Data de Assinatura</label>
              <input
                type="date"
                name="data_assinatura"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="admin-form-group">
              <label>Validade</label>
              <input
                type="date"
                name="validade"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>URL do arquivo (opcional)</label>
            <input
              type="url"
              name="arquivo_url"
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label>Responsável legal (se aplicável)</label>
            <select
              name="responsavel_id"
              className="profile-form-input form-control-full"
            >
              <option value="">— Nenhum —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Termo
            </button>
            <Link href="/admin/documentos/termos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
