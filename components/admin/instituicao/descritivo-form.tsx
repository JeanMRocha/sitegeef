'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface DescritivoFormProps {
  initialData?: {
    descricao?: string;
    historia?: string;
  } | null;
}

export default function DescritivoForm({ initialData }: DescritivoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    descricao: initialData?.descricao || '',
    historia: initialData?.historia || '',
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
        descricao: formData.descricao || undefined,
        historia: formData.historia || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/instituicao/descritivo');
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
        <label htmlFor="descricao" className="form-label">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição geral sobre a instituição"
          rows={6}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="historia" className="form-label">
          História
        </label>
        <textarea
          id="historia"
          name="historia"
          value={formData.historia}
          onChange={handleChange}
          placeholder="Histórico da instituição"
          rows={6}
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
