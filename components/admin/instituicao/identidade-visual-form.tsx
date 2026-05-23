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
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '0.5rem',
          border: '1px solid #fca5a5',
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          borderRadius: '0.5rem',
          border: '1px solid #86efac',
        }}>
          Dados salvos com sucesso!
        </div>
      )}

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Logotipos</h3>
        <BrandAssetUpload
          title="Logo"
          description="Logo sem fundo (transparente) para uso em fundos claros e materiais digitais"
          fieldName="logo_url"
          currentAsset={logoUrl}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <BrandAssetUpload
            title="Logo com Fundo"
            description="Logo com fundo para contraste imediato e apoio visual mais marcante"
            fieldName="logo_com_fundo_url"
            currentAsset={logoComFundoUrl}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Descrição Geral
        </label>
        <textarea
          id="identidade_visual_descricao"
          name="identidade_visual_descricao"
          value={formData.identidade_visual_descricao}
          onChange={handleChange}
          placeholder="Descrição geral da identidade visual"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_letras_descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Descrição das Letras
        </label>
        <textarea
          id="identidade_visual_letras_descricao"
          name="identidade_visual_letras_descricao"
          value={formData.identidade_visual_letras_descricao}
          onChange={handleChange}
          placeholder="Detalhes sobre tipografia e letras"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_visual_descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Descrição Visual
        </label>
        <textarea
          id="identidade_visual_visual_descricao"
          name="identidade_visual_visual_descricao"
          value={formData.identidade_visual_visual_descricao}
          onChange={handleChange}
          placeholder="Detalhes visuais (cores, símbolos, etc)"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_composicao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Composição
        </label>
        <textarea
          id="identidade_visual_composicao"
          name="identidade_visual_composicao"
          value={formData.identidade_visual_composicao}
          onChange={handleChange}
          placeholder="Composição da identidade visual"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_uso" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Diretrizes de Uso
        </label>
        <textarea
          id="identidade_visual_uso"
          name="identidade_visual_uso"
          value={formData.identidade_visual_uso}
          onChange={handleChange}
          placeholder="Como usar corretamente a identidade visual"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="identidade_visual_exemplos" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Exemplos
        </label>
        <textarea
          id="identidade_visual_exemplos"
          name="identidade_visual_exemplos"
          value={formData.identidade_visual_exemplos}
          onChange={handleChange}
          placeholder="Exemplos de aplicação"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
