import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createModelo } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Modelo de Documento - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const modelo = await createModelo({
      tipo: formData.get('tipo') as string,
      titulo: formData.get('titulo') as string,
      versao: (formData.get('versao') as string) || undefined,
      conteudo: (formData.get('conteudo') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/${modelo.id}`, { variant: 'success', message: 'Modelo criado.' }));
  } catch (error) {
    console.error('Erro ao criar modelo:', error);
    redirect(buildFlashNoticeUrl('/admin/documentos', { variant: 'error', message: 'Não foi possível criar o modelo.' }));
    return;
  }
}

export default function NovoModeloPage() {
  const tipos = [
    'termo_imagem_adulto',
    'termo_imagem_menor',
    'voluntariado',
    'privacidade',
    'consentimento_geral',
    'outro',
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Modelo de Documento</h1>
          <p className="admin-page-subtitle">Crie um novo modelo para termos e consentimentos</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <LgpdFormNotice
          title="Modelo de documento"
          text="Use este cadastro apenas para documentos realmente necessários e com finalidade clara."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Tipo de Documento *</label>
            <select name="tipo" required style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
            }}>
              <option value="">— Selecione —</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.replace(/_/g, ' ').charAt(0).toUpperCase() + tipo.replace(/_/g, ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Termo de Consentimento de Imagem para Adultos"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Versão</label>
            <input
              type="text"
              name="versao"
              placeholder="Ex: 1.0, v2.1, 2024-05"
            />
          </div>

          <div className="admin-form-group">
            <label>Conteúdo do Documento</label>
            <textarea
              name="conteudo"
              rows={12}
              placeholder="Cole o conteúdo completo do documento aqui..."
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Modelo
            </button>
            <Link href="/admin/documentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
