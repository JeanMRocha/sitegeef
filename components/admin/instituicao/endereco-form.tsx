'use client';

import { useState } from 'react';
import { updateEndereco } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface EnderecoFormProps {
  initialData?: {
    id?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cep?: string;
    cidade?: string;
    estado?: string;
    maps_link?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

export default function EnderecoForm({ initialData }: EnderecoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    logradouro: initialData?.logradouro || '',
    numero: initialData?.numero || '',
    complemento: initialData?.complemento || '',
    bairro: initialData?.bairro || '',
    cep: initialData?.cep || '',
    cidade: initialData?.cidade || '',
    estado: initialData?.estado || '',
    maps_link: initialData?.maps_link || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = await updateEndereco({
        logradouro: formData.logradouro || undefined,
        numero: formData.numero || undefined,
        complemento: formData.complemento || undefined,
        bairro: formData.bairro || undefined,
        cep: formData.cep || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined,
        maps_link: formData.maps_link || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/instituicao/endereco');
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
        <label htmlFor="logradouro" className="form-label">
          Logradouro
        </label>
        <input
          type="text"
          id="logradouro"
          name="logradouro"
          value={formData.logradouro}
          onChange={handleChange}
          placeholder="Rua, Avenida, etc"
          className="form-input"
        />
      </div>

      <div className="form-group form-grid-2">
        <div>
          <label htmlFor="numero" className="form-label">
            Número
          </label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="form-input-styled"
          />
        </div>
        <div>
          <label htmlFor="cep" className="form-label">
            CEP
          </label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            placeholder="XXXXX-XXX"
            className="form-input-styled"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="complemento" className="form-label">
          Complemento
        </label>
        <input
          type="text"
          id="complemento"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
          placeholder="Apto, sala, etc"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bairro" className="form-label">
          Bairro
        </label>
        <input
          type="text"
          id="bairro"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group form-grid-2">
        <div>
          <label htmlFor="cidade" className="form-label">
            Cidade
          </label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="form-input-styled"
          />
        </div>
        <div>
          <label htmlFor="estado" className="form-label">
            Estado
          </label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="SP, RJ, etc"
            className="form-input-styled"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="maps_link" className="form-label">
          Link Google Maps
        </label>
        <input
          type="url"
          id="maps_link"
          name="maps_link"
          value={formData.maps_link}
          onChange={handleChange}
          placeholder="https://maps.google.com/..."
          className="form-input"
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
