'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { PORTE_CNPJ_OPTIONS } from '@/lib/instituicao/porte';
import { useRouter } from 'next/navigation';

interface IdentificacaoFormProps {
  initialData?: {
    nome_oficial?: string;
    nome_curto?: string;
    cnpj?: string;
    natureza_juridica?: string;
    porte?: string;
    data_fundacao?: string;
  } | null;
}

export default function IdentificacaoForm({ initialData }: IdentificacaoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome_oficial: initialData?.nome_oficial || '',
    nome_curto: initialData?.nome_curto || '',
    cnpj: initialData?.cnpj || '',
    natureza_juridica: initialData?.natureza_juridica || '',
    porte: initialData?.porte || '',
    data_fundacao: initialData?.data_fundacao?.slice(0, 10) || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await updateInstituicao({
        nome_oficial: formData.nome_oficial || undefined,
        nome_curto: formData.nome_curto || undefined,
        cnpj: formData.cnpj || undefined,
        natureza_juridica: formData.natureza_juridica || undefined,
        porte: formData.porte || undefined,
        data_fundacao: formData.data_fundacao || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/instituicao/identificacao');
          router.refresh();
        }, 1000);
      } else {
        setError(result.error || 'Erro ao salvar');
      }
    } catch (err) {
      setError('Erro ao salvar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-max-width">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          Dados salvos com sucesso!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="nome_oficial" className="form-label">
          Nome oficial *
        </label>
        <input
          type="text"
          id="nome_oficial"
          name="nome_oficial"
          value={formData.nome_oficial}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nome_curto" className="form-label">
          Nome curto
        </label>
        <input
          type="text"
          id="nome_curto"
          name="nome_curto"
          value={formData.nome_curto}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="natureza_juridica" className="form-label">
          Natureza Jurídica
        </label>
        <select
          id="natureza_juridica"
          name="natureza_juridica"
          value={formData.natureza_juridica}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Selecione</option>
          <option value="100-8">100-8 - Empresa Pública</option>
          <option value="200-4">200-4 - Empresa Privada</option>
          <option value="300-0">300-0 - Sociedade Anônima Aberta</option>
          <option value="399-9">399-9 - Associação Privada</option>
          <option value="400-5">400-5 - Sociedade Anônima Fechada</option>
          <option value="500-1">500-1 - Sociedade Limitada</option>
          <option value="600-7">600-7 - Sociedade em Nome Coletivo</option>
          <option value="700-3">700-3 - Sociedade em Comandita Simples</option>
          <option value="800-9">800-9 - Sociedade em Comandita por Ações</option>
          <option value="900-5">900-5 - Fundação Privada</option>
          <option value="1000-1">1000-1 - Cooperativa</option>
          <option value="1100-7">1100-7 - Empresa Individual de Responsabilidade Limitada</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="cnpj" className="form-label">
          CNPJ
        </label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          placeholder="XX.XXX.XXX/XXXX-XX"
          className="form-input"
        />
      </div>

      <div className="form-group form-grid-2">
        <div>
          <label htmlFor="porte" className="form-label">
            Porte do CNPJ
          </label>
          <select
            id="porte"
            name="porte"
            value={formData.porte}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Selecione</option>
            {PORTE_CNPJ_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="data_fundacao" className="form-label">
            Data de fundação
          </label>
          <input
            type="date"
            id="data_fundacao"
            name="data_fundacao"
            value={formData.data_fundacao}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => router.back()}
          className="form-btn form-btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`form-btn form-btn-primary ${isLoading ? 'disabled' : ''}`}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
