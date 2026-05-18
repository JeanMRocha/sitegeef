import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServico, getPessoasDisponiveis, getDepartamentosDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Serviço Voluntário - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const servico = await createServico({
      pessoa_id: formData.get('pessoa_id') as string,
      departamento_id: formData.get('departamento_id') as string,
      servico: formData.get('servico') as string,
      horarios: (formData.get('horarios') as string) || undefined,
      termo_url: (formData.get('termo_url') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/voluntariado/${servico.id}`, { variant: 'success', message: 'Serviço voluntário criado.' }));
  } catch (error) {
    console.error('Erro ao criar serviço voluntário:', error);
    redirect(buildFlashNoticeUrl('/admin/documentos/voluntariado', { variant: 'error', message: 'Não foi possível criar o serviço voluntário.' }));
    return;
  }
}

export default async function NovoServicoPage() {
  const pessoas = await getPessoasDisponiveis();
  const departamentos = await getDepartamentosDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Serviço Voluntário</h1>
          <p className="admin-page-subtitle">Registre apenas o vínculo necessário e o período de atuação.</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.95rem 1rem', borderLeft: '3px solid var(--primary)' }}>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
          Se houver termo, anexe o link. Se não houver, deixe o registro enxuto e consistente.
        </p>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Voluntário *</label>
            <select
              name="pessoa_id"
              required
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Selecione —</option>
              {pessoas.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Departamento *</label>
            <select
              name="departamento_id"
              required
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Selecione —</option>
              {departamentos.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Serviço *</label>
            <input
              type="text"
              name="servico"
              placeholder="Ex: Coordenação de escalas, Atendimento fraterno, Evangelizador"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Horários (opcional)</label>
            <input
              type="text"
              name="horarios"
              placeholder="Ex: Quintas-feiras 19h-21h, Domingos 8h-12h"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Data de Início</label>
              <input
                type="date"
                name="data_inicio"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="admin-form-group">
              <label>Data de Término</label>
              <input
                type="date"
                name="data_fim"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>URL do termo (opcional)</label>
            <input
              type="url"
              name="termo_url"
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Serviço
            </button>
            <Link href="/admin/documentos/voluntariado" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
