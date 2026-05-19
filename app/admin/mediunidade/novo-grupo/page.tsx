import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createGrupo, getPessoasDisponiveis } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Grupo Mediúnico - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const grupo = await createGrupo({
      nome: formData.get('nome') as string,
      coordenador_id: (formData.get('coordenador_id') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/mediunidade/${grupo.id}`, { variant: 'success', message: 'Grupo mediúnico criado.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/mediunidade', { variant: 'error', message: 'Não foi possível criar o grupo.' }));
    return;
  }
}

export default async function NovoGrupoPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Grupo Mediúnico</h1>
          <p className="admin-page-subtitle">🔒 Módulo Restrito — Criar novo grupo</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <LgpdFormNotice text="Usamos os dados para registrar o grupo e limitar o acesso aos membros autorizados." />
          <div className="admin-form-group">
            <label>Nome do Grupo *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Grupo de Estudo Mediúnico, Reunião Semanal..."
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Coordenador</label>
            <select
              name="coordenador_id"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                backgroundColor: '#fff',
              }}
            >
              <option value="">Selecione um coordenador</option>
              {pessoas.map((pessoa: any) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #a855f7',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              🔒 Este grupo será criado como ativo. Apenas membros autorizados terão acesso aos dados.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Grupo
            </button>
            <Link href="/admin/mediunidade" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
