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
    cnae_principal: initialData?.cnae_principal || '',
    cnae_descricao: initialData?.cnae_descricao || '',
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
        cnae_principal: formData.cnae_principal || undefined,
        cnae_descricao: formData.cnae_descricao || undefined,
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
            <option value="microempresa">Microempresa</option>
            <option value="pequena">Pequena</option>
            <option value="media">Média</option>
            <option value="grande">Grande</option>
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
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Atividade Econômica Principal (CNAE)</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="cnae_principal" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Código CNAE
          </label>
          <select
            id="cnae_principal"
            name="cnae_principal"
            value={formData.cnae_principal}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          >
            <option value="">Selecione uma atividade</option>
            <option value="94.91-0-00">94.91-0-00 - Atividades de organizações religiosas ou filosóficas</option>
            <option value="94.92-8-00">94.92-8-00 - Atividades de organizações políticas</option>
            <option value="94.93-6-00">94.93-6-00 - Atividades de organizações sindicais</option>
            <option value="94.99-5-00">94.99-5-00 - Outras atividades associativas não especificadas anteriormente</option>
            <option value="85.92-8-00">85.92-8-00 - Ensino superior (não comercial)</option>
            <option value="85.91-0-00">85.91-0-00 - Ensino profissional (não comercial)</option>
            <option value="80.10-4-00">80.10-4-00 - Serviços privados de vigilância</option>
            <option value="outro">Outro - Especificar manualmente</option>
          </select>
        </div>
        <div>
          <label htmlFor="cnae_descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Descrição da Atividade
          </label>
          <input
            type="text"
            id="cnae_descricao"
            name="cnae_descricao"
            value={formData.cnae_descricao}
            onChange={handleChange}
            placeholder="Descrição da atividade econômica principal"
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
