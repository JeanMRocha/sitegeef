'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContasForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    finalidade: '',
    chave_pix: '',
    visibilidade: 'privada' as 'privada' | 'publica',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.banco) {
      setError('Selecione um banco');
      setIsLoading(false);
      return;
    }

    try {
      // Placeholder para implementação completa
      // const result = await addContaBancaria({ ... });
      setSuccess(true);
      setFormData({
        banco: '',
        agencia: '',
        conta: '',
        finalidade: '',
        chave_pix: '',
        visibilidade: 'privada',
      });
      setTimeout(() => {
        router.push('/admin/instituicao/contas');
        router.refresh();
      }, 1000);
    } catch (err) {
      setError('Erro ao salvar conta');
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
          Conta adicionada com sucesso!
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="banco" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Banco *
        </label>
        <input
          type="text"
          id="banco"
          name="banco"
          value={formData.banco}
          onChange={handleChange}
          placeholder="Nome do banco"
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label htmlFor="agencia" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Agência
          </label>
          <input
            type="text"
            id="agencia"
            name="agencia"
            value={formData.agencia}
            onChange={handleChange}
            placeholder="XXXXX"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          />
        </div>
        <div>
          <label htmlFor="conta" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Conta
          </label>
          <input
            type="text"
            id="conta"
            name="conta"
            value={formData.conta}
            onChange={handleChange}
            placeholder="XXXXXXXX-X"
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="finalidade" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Finalidade
        </label>
        <input
          type="text"
          id="finalidade"
          name="finalidade"
          value={formData.finalidade}
          onChange={handleChange}
          placeholder="Ex: Doações, Repasses, etc"
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
        <label htmlFor="chave_pix" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Chave PIX
        </label>
        <input
          type="text"
          id="chave_pix"
          name="chave_pix"
          value={formData.chave_pix}
          onChange={handleChange}
          placeholder="Email, CNPJ, CPF ou chave aleatória"
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
        <label htmlFor="visibilidade" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Visibilidade
        </label>
        <select
          id="visibilidade"
          name="visibilidade"
          value={formData.visibilidade}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        >
          <option value="privada">🔒 Privada (Apenas admin)</option>
          <option value="publica">🌐 Pública (Visível no site)</option>
        </select>
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
          {isLoading ? 'Adicionando...' : 'Adicionar Conta'}
        </button>
      </div>
    </form>
  );
}
