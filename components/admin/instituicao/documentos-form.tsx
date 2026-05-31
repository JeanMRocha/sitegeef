'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface DocumentosFormProps {
  initialData?: {
    estatuto_url?: string;
  } | null;
}

export default function DocumentosForm({ initialData }: DocumentosFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [statuteFile, setStatuteFile] = useState<File | null>(null);
  const [statuteUrl, setStatuteUrl] = useState(initialData?.estatuto_url || '');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Arquivo maior que 10MB');
        return;
      }
      setStatuteFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Placeholder para upload de arquivo
      // Para implementação completa, seria necessário usar uploadStorageAsset
      const result = await updateInstituicao({
        estatuto_url: statuteUrl || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setStatuteFile(null);
        setTimeout(() => {
          router.push('/admin/instituicao/documentos');
          router.refresh();
        }, 1000);
      } else {
        setError(result.error || 'Erro ao salvar');
      }
    } catch (err) {
      setError('Erro ao salvar documentos');
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
          Documentos salvos com sucesso!
        </div>
      )}

      <div className="form-group">
        <h3 className="form-section-title">Documentos Legais</h3>
        <p className="form-hint">
          Registros de estatuto, certificados de registro e documentos legais da instituição.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="statute" className="form-label">
          Estatuto Social
        </label>
        <p className="form-hint">
          Arquivo PDF com o estatuto social da instituição
        </p>

        <div className="file-upload-area">
          {statuteFile ? (
            <>
              <p style={{ fontWeight: 600 }}>📄 {statuteFile.name}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {(statuteFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : statuteUrl ? (
            <>
              <p style={{ fontWeight: 600 }}>📄 Documento já enviado</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <a href={statuteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  Ver documento
                </a>
              </p>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum arquivo enviado</p>
          )}
        </div>

        <input
          type="file"
          id="statute"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
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
