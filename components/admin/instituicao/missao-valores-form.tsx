'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface MissaoValoresFormProps {
  initialData?: {
    missao?: string;
    visao?: string;
    valores?: string;
  } | null;
}

export default function MissaoValoresForm({ initialData }: MissaoValoresFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    missao: initialData?.missao || '',
    visao: initialData?.visao || '',
    valores: initialData?.valores || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        missao: formData.missao || undefined,
        visao: formData.visao || undefined,
        valores: formData.valores || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/instituicao/missao-valores');
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
        <label htmlFor="missao" className="form-label">
          Missão
        </label>
        <textarea
          id="missao"
          name="missao"
          value={formData.missao}
          onChange={handleChange}
          placeholder="Nossa missão é..."
          rows={4}
          className="form-textarea"
        />
      </div>

      <div className="spacing-lg">
        <label htmlFor="visao" className="form-field-label">
          Visão
        </label>
        <textarea
          id="visao"
          name="visao"
          value={formData.visao}
          onChange={handleChange}
          placeholder="Nossa visão é..."
          rows={4}
          className="form-textarea"
        />
      </div>

      <div className="spacing-lg">
        <label htmlFor="valores" className="form-field-label">
          Valores
        </label>
        <textarea
          id="valores"
          name="valores"
          value={formData.valores}
          onChange={handleChange}
          placeholder="Nossos valores são..."
          rows={4}
          className="form-textarea"
        />
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
