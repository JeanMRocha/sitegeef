'use client';

import { useState } from 'react';
import { updateInstituicao } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface IdentificacaoFormProps {
  initialData?: {
    nome_oficial?: string;
    nome_curto?: string;
    cnpj?: string;
    natureza_juridica?: string;
    porte?: string;
    data_fundacao?: string;
    cnae_principal?: string;
    cnae_descricao?: string;
    cnaes_secundarios?: Array<{ codigo: string; descricao?: string | null }>;
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
          Dados salvos com sucesso!
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="nome_oficial" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Nome oficial *
        </label>
        <input
          type="text"
          id="nome_oficial"
          name="nome_oficial"
          value={formData.nome_oficial}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="nome_curto" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Nome curto
        </label>
        <input
          type="text"
          id="nome_curto"
          name="nome_curto"
          value={formData.nome_curto}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="natureza_juridica" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Natureza Jurídica
        </label>
        <select
          id="natureza_juridica"
          name="natureza_juridica"
          value={formData.natureza_juridica}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="cnpj" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          CNPJ
        </label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          placeholder="XX.XXX.XXX/XXXX-XX"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label htmlFor="porte" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Porte
          </label>
          <select
            id="porte"
            name="porte"
            value={formData.porte}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          >
            <option value="">Selecione</option>
            <option value="Microempresa">Microempresa</option>
            <option value="Pequena">Pequena</option>
            <option value="Média">Média</option>
            <option value="Grande">Grande</option>
          </select>
        </div>
        <div>
          <label htmlFor="data_fundacao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Data de fundação
          </label>
          <input
            type="date"
            id="data_fundacao"
            name="data_fundacao"
            value={formData.data_fundacao}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Atividade econômica</h3>
        <p style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--muted)' }}>
          O CNAE agora é mantido em tabela própria, com vínculo explícito à instituição.
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>CNAE principal</strong>
            <p style={{ margin: 0 }}>{initialData?.cnae_principal || '—'}</p>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Descrição principal</strong>
            <p style={{ margin: 0 }}>{initialData?.cnae_descricao || '—'}</p>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>CNAEs secundários</strong>
            {initialData?.cnaes_secundarios?.length ? (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {initialData.cnaes_secundarios.map((cnae) => (
                  <div key={cnae.codigo} style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                    <strong>{cnae.codigo}</strong>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{cnae.descricao || 'Sem descrição'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0 }}>—</p>
            )}
          </div>
        </div>
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
