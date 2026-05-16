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
      <div className="area-page">
        <section className="area-hero">
          <div className="area-hero-top">
            <div>
              <p className="area-subtitle">Instituição</p>
              <h1 className="area-hero-title">Editar Instituição</h1>
            </div>
          </div>
          <p className="area-subtitle">Dados oficiais do GEEF.</p>
        </section>

        <section className="area-section">
          <div className="table-surface" style={{ maxWidth: '920px', margin: '0 auto' }}>
            <div className="area-section-title">
              <h2>Identificação</h2>
              <p>Dados legais e apresentação institucional.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Nome oficial *</span>
                <input type="text" name="nome_oficial" defaultValue={instituicao?.nome_oficial || ''} required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Nome curto</span>
                <input type="text" name="nome_curto" defaultValue={instituicao?.nome_curto || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>CNPJ</span>
                <input type="text" name="cnpj" placeholder="00.000.000/0000-00" defaultValue={instituicao?.cnpj || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Data de fundação</span>
                <input type="date" name="data_fundacao" defaultValue={instituicao?.data_fundacao || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Natureza jurídica</span>
                <input type="text" name="natureza_juridica" placeholder="Ex: Associação Civil Sem Fins Lucrativos" defaultValue={instituicao?.natureza_juridica || ''} className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Endereço</h2>
              <p>Localização institucional.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Logradouro</span>
                <input type="text" name="logradouro" defaultValue={endereco?.logradouro || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Bairro</span>
                <input type="text" name="bairro" defaultValue={endereco?.bairro || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Número</span>
                <input type="text" name="numero" defaultValue={endereco?.numero || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Complemento</span>
                <input type="text" name="complemento" defaultValue={endereco?.complemento || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Cidade</span>
                <input type="text" name="cidade" defaultValue={endereco?.cidade || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Estado</span>
                <input type="text" name="estado" maxLength={2} defaultValue={endereco?.estado || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>CEP</span>
                <input type="text" name="cep" placeholder="00000-000" defaultValue={endereco?.cep || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Link Google Maps</span>
                <input type="url" name="maps_link" defaultValue={endereco?.maps_link || ''} className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Descritivo</h2>
              <p>Texto institucional, missão, visão e valores.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Descrição breve</span>
                <textarea name="descricao" defaultValue={instituicao?.descricao || ''} rows={3} className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>História</span>
                <textarea name="historia" defaultValue={instituicao?.historia || ''} rows={4} className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Missão</span>
                <textarea name="missao" defaultValue={instituicao?.missao || ''} rows={3} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Visão</span>
                <textarea name="visao" defaultValue={instituicao?.visao || ''} rows={3} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Valores</span>
                <textarea name="valores" defaultValue={instituicao?.valores || ''} rows={3} className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Documentos</h2>
              <p>Links e arquivos de referência.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Logo (URL)</span>
                <input type="url" name="logo_url" defaultValue={instituicao?.logo_url || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Estatuto (URL do PDF)</span>
                <input type="url" name="estatuto_url" defaultValue={instituicao?.estatuto_url || ''} className="profile-form-input" />
              </label>
            </div>

            <div className="area-panel-grid" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Salvar</button>
              <Link href="/admin/instituicao" className="profile-form-btn profile-form-btn-secondary">Cancelar</Link>
            </div>
          </div>
        </section>
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
