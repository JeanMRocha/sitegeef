import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServico, getPessoasDisponiveis, getDepartamentosDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Serviço Voluntário - Admin GEEF',
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

type DepartamentoDisponivel = {
  id: string;
  nome: string | null;
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
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];
  const departamentos = (await getDepartamentosDisponiveis()) as DepartamentoDisponivel[];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Serviço Voluntário</h1>
          <p className="admin-page-subtitle">Registre apenas o vínculo necessário e o período de atuação.</p>
        </div>
      </div>

      <div className="admin-card panel-accent-card">
        <p className="mb-0 text-sm-muted">
          Se houver termo, anexe o link. Se não houver, deixe o registro enxuto e consistente.
        </p>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <LgpdFormNotice
          title="Serviço voluntário"
          text="Use só o vínculo e o período necessários para gestão interna e comprovação."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Voluntário *</label>
            <select name="pessoa_id" required>
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Departamento *</label>
            <select name="departamento_id" required>
              <option value="">— Selecione —</option>
              {departamentos.map((d) => (
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

          <div className="form-grid-2">
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

          <div className="form-actions-row">
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
