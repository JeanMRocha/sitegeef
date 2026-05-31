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
    <form onSubmit={handleSubmit} className="form-max-width">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          Contato adicionado com sucesso!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="tipo" className="form-label">
          Tipo de Contato *
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">Selecione um tipo</option>
          {tiposDisponiveis.map(tipo => (
            <option key={tipo.id} value={tipo.label}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="telefone" className="form-label">
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(XX) XXXXX-XXXX"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="whatsapp" className="form-label">
          WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="(XX) XXXXX-XXXX"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemplo.com"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="instagram" className="form-label">
          Instagram
        </label>
        <input
          type="text"
          id="instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="@usuario"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="facebook" className="form-label">
          Facebook
        </label>
        <input
          type="text"
          id="facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          placeholder="URL do Facebook"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="youtube" className="form-label">
          YouTube
        </label>
        <input
          type="text"
          id="youtube"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          placeholder="URL do YouTube"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="site" className="form-label">
          Site/Página Web
        </label>
        <input
          type="url"
          id="site"
          name="site"
          value={formData.site}
          onChange={handleChange}
          placeholder="https://exemplo.com"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="responsavel_id" className="form-label">
          Responsável (Pessoa)
        </label>
        <select
          id="responsavel_id"
          name="responsavel_id"
          value={formData.responsavel_id}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Selecione uma pessoa (opcional)</option>
          {pessoasDisponiveis.map(pessoa => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </select>
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
          {isLoading ? 'Adicionando...' : 'Adicionar Contato'}
        </button>
      </div>
    </form>
  );
}
