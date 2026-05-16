import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getInstituicao, getEnderecos, updateInstituicao, updateEndereco } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Instituição - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    // Update instituicao
    await updateInstituicao({
      nome_oficial: formData.get('nome_oficial') as string,
      nome_curto: (formData.get('nome_curto') as string) || undefined,
      cnpj: (formData.get('cnpj') as string) || undefined,
      natureza_juridica: (formData.get('natureza_juridica') as string) || undefined,
      data_fundacao: (formData.get('data_fundacao') as string) || undefined,
      logo_url: (formData.get('logo_url') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
      historia: (formData.get('historia') as string) || undefined,
      missao: (formData.get('missao') as string) || undefined,
      visao: (formData.get('visao') as string) || undefined,
      valores: (formData.get('valores') as string) || undefined,
      estatuto_url: (formData.get('estatuto_url') as string) || undefined,
    });

    // Update endereco
    await updateEndereco({
      cep: (formData.get('cep') as string) || undefined,
      logradouro: (formData.get('logradouro') as string) || undefined,
      numero: (formData.get('numero') as string) || undefined,
      complemento: (formData.get('complemento') as string) || undefined,
      bairro: (formData.get('bairro') as string) || undefined,
      cidade: (formData.get('cidade') as string) || undefined,
      estado: (formData.get('estado') as string) || undefined,
      maps_link: (formData.get('maps_link') as string) || undefined,
    });

    redirect('/admin/instituicao');
  } catch (error) {
    console.error('Erro ao atualizar instituição:', error);
    throw error;
  }
}

async function EditInstituicaoContent() {
  const instituicao = await getInstituicao();
  const enderecos = await getEnderecos();
  const endereco = enderecos[0];

  return (
    <form action={handleSubmit}>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Instituição</h1>
          <p className="admin-page-subtitle">Dados oficiais do GEEF</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Seção 1: Identificação */}
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🏛️ Identificação</h2>

        <div className="admin-form-group">
          <label>Nome Oficial *</label>
          <input type="text" name="nome_oficial" defaultValue={instituicao?.nome_oficial || ''} required />
        </div>

        <div className="admin-form-group">
          <label>Nome Curto (sigla)</label>
          <input type="text" name="nome_curto" defaultValue={instituicao?.nome_curto || ''} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>CNPJ</label>
            <input type="text" name="cnpj" placeholder="00.000.000/0000-00" defaultValue={instituicao?.cnpj || ''} />
          </div>
          <div className="admin-form-group">
            <label>Data de Fundação</label>
            <input type="date" name="data_fundacao" defaultValue={instituicao?.data_fundacao || ''} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Natureza Jurídica</label>
          <input
            type="text"
            name="natureza_juridica"
            placeholder="Ex: Associação Civil Sem Fins Lucrativos"
            defaultValue={instituicao?.natureza_juridica || ''}
          />
        </div>

        {/* Seção 2: Endereço */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📍 Endereço</h2>

        <div className="admin-form-group">
          <label>Logradouro</label>
          <input type="text" name="logradouro" defaultValue={endereco?.logradouro || ''} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Bairro</label>
            <input type="text" name="bairro" defaultValue={endereco?.bairro || ''} />
          </div>
          <div className="admin-form-group">
            <label>Número</label>
            <input type="text" name="numero" defaultValue={endereco?.numero || ''} />
          </div>
          <div className="admin-form-group">
            <label>Complemento</label>
            <input type="text" name="complemento" defaultValue={endereco?.complemento || ''} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Cidade</label>
            <input type="text" name="cidade" defaultValue={endereco?.cidade || ''} />
          </div>
          <div className="admin-form-group">
            <label>Estado</label>
            <input type="text" name="estado" maxLength={2} defaultValue={endereco?.estado || ''} />
          </div>
          <div className="admin-form-group">
            <label>CEP</label>
            <input type="text" name="cep" placeholder="00000-000" defaultValue={endereco?.cep || ''} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Link Google Maps</label>
          <input type="url" name="maps_link" defaultValue={endereco?.maps_link || ''} />
        </div>

        {/* Seção 3: Descritivo */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📝 Descritivo</h2>

        <div className="admin-form-group">
          <label>Descrição Breve</label>
          <textarea
            name="descricao"
            defaultValue={instituicao?.descricao || ''}
            rows={3}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
              resize: 'vertical',
            }}
          />
        </div>

        <div className="admin-form-group">
          <label>História</label>
          <textarea
            name="historia"
            defaultValue={instituicao?.historia || ''}
            rows={4}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
              resize: 'vertical',
            }}
          />
        </div>

        <div className="admin-form-group">
          <label>Missão</label>
          <textarea
            name="missao"
            defaultValue={instituicao?.missao || ''}
            rows={3}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Visão</label>
            <textarea
              name="visao"
              defaultValue={instituicao?.visao || ''}
              rows={3}
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>
          <div className="admin-form-group">
            <label>Valores</label>
            <textarea
              name="valores"
              defaultValue={instituicao?.valores || ''}
              rows={3}
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Seção 4: URLs */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🔗 Documentos</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Logo (URL)</label>
            <input type="url" name="logo_url" defaultValue={instituicao?.logo_url || ''} />
          </div>
          <div className="admin-form-group">
            <label>Estatuto (URL do PDF)</label>
            <input type="url" name="estatuto_url" defaultValue={instituicao?.estatuto_url || ''} />
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
          <Link href="/admin/instituicao" className="admin-btn admin-btn-secondary">
            ❌ Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}

export default function EditInstituicaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditInstituicaoContent />
    </Suspense>
  );
}
