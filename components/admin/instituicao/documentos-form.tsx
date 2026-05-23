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
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
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
          Documentos salvos com sucesso!
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Documentos Legais</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Registros de estatuto, certificados de registro e documentos legais da instituição.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="statute" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Estatuto Social
        </label>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Arquivo PDF com o estatuto social da instituição
        </p>

        <div style={{
          padding: '2rem',
          border: '2px dashed var(--border)',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
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
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
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
