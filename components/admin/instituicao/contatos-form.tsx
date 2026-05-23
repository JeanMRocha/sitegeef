'use client';

import { useState } from 'react';
import { addContato } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface ContatoTipo {
  id: string;
  label: string;
}

interface Pessoa {
  id: string;
  nome: string;
  email?: string;
}

interface ContatosFormProps {
  tiposDisponiveis?: ContatoTipo[];
  pessoasDisponiveis?: Pessoa[];
}

export default function ContatosForm({ tiposDisponiveis = [], pessoasDisponiveis = [] }: ContatosFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    tipo: '',
    telefone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    facebook: '',
    youtube: '',
    site: '',
    responsavel_id: '',
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

    if (!formData.tipo) {
      setError('Selecione um tipo de contato');
      setIsLoading(false);
      return;
    }

    try {
      const result = await addContato({
        tipo: formData.tipo,
        telefone: formData.telefone || undefined,
        whatsapp: formData.whatsapp || undefined,
        email: formData.email || undefined,
        instagram: formData.instagram || undefined,
        facebook: formData.facebook || undefined,
        youtube: formData.youtube || undefined,
        site: formData.site || undefined,
        responsavel_id: formData.responsavel_id || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setFormData({
          tipo: '',
          telefone: '',
          whatsapp: '',
          email: '',
          instagram: '',
          facebook: '',
          youtube: '',
          site: '',
          responsavel_id: '',
        });
        setTimeout(() => {
          router.push('/admin/instituicao/contatos');
          router.refresh();
        }, 1000);
      } else {
        setError(result.error || 'Erro ao salvar');
      }
    } catch (err) {
      setError('Erro ao salvar contato');
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
          Contato adicionado com sucesso!
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="tipo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Tipo de Contato *
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        >
          <option value="">Selecione um tipo</option>
          {tiposDisponiveis.map(tipo => (
            <option key={tipo.id} value={tipo.label}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="telefone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(XX) XXXXX-XXXX"
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
        <label htmlFor="whatsapp" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="(XX) XXXXX-XXXX"
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
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemplo.com"
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
        <label htmlFor="instagram" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Instagram
        </label>
        <input
          type="text"
          id="instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="@usuario"
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
        <label htmlFor="facebook" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Facebook
        </label>
        <input
          type="text"
          id="facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          placeholder="URL do Facebook"
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
        <label htmlFor="youtube" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          YouTube
        </label>
        <input
          type="text"
          id="youtube"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          placeholder="URL do YouTube"
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
        <label htmlFor="site" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Site/Página Web
        </label>
        <input
          type="url"
          id="site"
          name="site"
          value={formData.site}
          onChange={handleChange}
          placeholder="https://exemplo.com"
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
        <label htmlFor="responsavel_id" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Responsável (Pessoa)
        </label>
        <select
          id="responsavel_id"
          name="responsavel_id"
          value={formData.responsavel_id}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
          }}
        >
          <option value="">Selecione uma pessoa (opcional)</option>
          {pessoasDisponiveis.map(pessoa => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
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
          {isLoading ? 'Adicionando...' : 'Adicionar Contato'}
        </button>
      </div>
    </form>
  );
}
