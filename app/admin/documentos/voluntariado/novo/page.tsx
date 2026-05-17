import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServico, getPessoasDisponiveis, getDepartamentosDisponiveis } from '../../actions';

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

    redirect(`/admin/documentos/voluntariado/${servico.id}`);
  } catch (error) {
    console.error('Erro ao criar serviço voluntário:', error);
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
          <p className="admin-page-subtitle">Registre novo compromisso de voluntariado</p>
        </div>
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
            <label>Descrição do Serviço *</label>
            <input
              type="text"
              name="servico"
              placeholder="Ex: Coordenação de escalas, Atendimento fraterno, Evangelizador"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Horários</label>
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
            <label>URL do Termo de Voluntariado</label>
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
