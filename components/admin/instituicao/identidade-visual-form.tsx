'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';
import { BrandAssetUpload } from '@/components/admin/brand-asset-upload';

interface IdentidadeVisualFormProps {
  initialData?: {
    logo_url?: string;
    logo_com_fundo_url?: string;
    identidade_visual_descricao?: string;
    identidade_visual_letras_descricao?: string;
    identidade_visual_visual_descricao?: string;
    identidade_visual_composicao?: string;
    identidade_visual_uso?: string;
    identidade_visual_exemplos?: string;
  } | null;
}

export default function IdentidadeVisualForm({ initialData }: IdentidadeVisualFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [logoComFundoUrl, setLogoComFundoUrl] = useState(initialData?.logo_com_fundo_url || '');

  const [formData, setFormData] = useState({
    identidade_visual_descricao: initialData?.identidade_visual_descricao || '',
    identidade_visual_letras_descricao: initialData?.identidade_visual_letras_descricao || '',
    identidade_visual_visual_descricao: initialData?.identidade_visual_visual_descricao || '',
    identidade_visual_composicao: initialData?.identidade_visual_composicao || '',
    identidade_visual_uso: initialData?.identidade_visual_uso || '',
    identidade_visual_exemplos: initialData?.identidade_visual_exemplos || '',
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
        logo_url: logoUrl || undefined,
        logo_com_fundo_url: logoComFundoUrl || undefined,
        identidade_visual_descricao: formData.identidade_visual_descricao || undefined,
        identidade_visual_letras_descricao: formData.identidade_visual_letras_descricao || undefined,
        identidade_visual_visual_descricao: formData.identidade_visual_visual_descricao || undefined,
        identidade_visual_composicao: formData.identidade_visual_composicao || undefined,
        identidade_visual_uso: formData.identidade_visual_uso || undefined,
        identidade_visual_exemplos: formData.identidade_visual_exemplos || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/instituicao/identidade-visual');
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

      <div className="form-section">
        <h3 className="form-section-title">Logotipos</h3>
        <BrandAssetUpload
          title="Logo"
          description="Logo sem fundo (transparente) para uso em fundos claros e materiais digitais"
          fieldName="logo_url"
          currentAsset={logoUrl}
        />
        <div className="form-section-item">
          <BrandAssetUpload
            title="Logo com Fundo"
            description="Logo com fundo para contraste imediato e apoio visual mais marcante"
            fieldName="logo_com_fundo_url"
            currentAsset={logoComFundoUrl}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_descricao" className="form-label">
          Descrição Geral
        </label>
        <textarea
          id="identidade_visual_descricao"
          name="identidade_visual_descricao"
          value={formData.identidade_visual_descricao}
          onChange={handleChange}
          placeholder="Descrição geral da identidade visual"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_letras_descricao" className="form-label">
          Descrição das Letras
        </label>
        <textarea
          id="identidade_visual_letras_descricao"
          name="identidade_visual_letras_descricao"
          value={formData.identidade_visual_letras_descricao}
          onChange={handleChange}
          placeholder="Detalhes sobre tipografia e letras"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_visual_descricao" className="form-label">
          Descrição Visual
        </label>
        <textarea
          id="identidade_visual_visual_descricao"
          name="identidade_visual_visual_descricao"
          value={formData.identidade_visual_visual_descricao}
          onChange={handleChange}
          placeholder="Detalhes visuais (cores, símbolos, etc)"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_composicao" className="form-label">
          Composição
        </label>
        <textarea
          id="identidade_visual_composicao"
          name="identidade_visual_composicao"
          value={formData.identidade_visual_composicao}
          onChange={handleChange}
          placeholder="Composição da identidade visual"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_uso" className="form-label">
          Diretrizes de Uso
        </label>
        <textarea
          id="identidade_visual_uso"
          name="identidade_visual_uso"
          value={formData.identidade_visual_uso}
          onChange={handleChange}
          placeholder="Como usar corretamente a identidade visual"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="identidade_visual_exemplos" className="form-label">
          Exemplos
        </label>
        <textarea
          id="identidade_visual_exemplos"
          name="identidade_visual_exemplos"
          value={formData.identidade_visual_exemplos}
          onChange={handleChange}
          placeholder="Exemplos de aplicação"
          rows={3}
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
