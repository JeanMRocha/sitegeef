import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createPessoa } from '../actions';

export const metadata = {
  title: 'Nova Pessoa - Admin GEEF',
};

const TIPOS_VINCULO = [
  'frequentador',
  'tarefeiro',
  'voluntario',
  'evangelizador',
  'crianca',
  'jovem',
  'responsavel_legal',
  'leitor',
  'comprador',
  'doador',
  'assistido',
  'palestrante',
  'dirigente',
  'membro_departamento',
  'visitante',
];

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const vinculos = TIPOS_VINCULO.filter((v) => formData.get(`vinculo_${v}`) === 'on');

    await createPessoa({
      nome: formData.get('nome') as string,
      nome_social: (formData.get('nome_social') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      telefone: (formData.get('telefone') as string) || undefined,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      data_nascimento: (formData.get('data_nascimento') as string) || undefined,
      cpf: (formData.get('cpf') as string) || undefined,
      rg: (formData.get('rg') as string) || undefined,
      logradouro: (formData.get('logradouro') as string) || undefined,
      numero: (formData.get('numero') as string) || undefined,
      bairro: (formData.get('bairro') as string) || undefined,
      cidade: (formData.get('cidade') as string) || undefined,
      estado: (formData.get('estado') as string) || undefined,
      cep: (formData.get('cep') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      contato_emergencia: (formData.get('contato_emergencia') as string) || undefined,
      autoriza_notificacao: formData.get('autoriza_notificacao') === 'on',
      autoriza_imagem_voz: formData.get('autoriza_imagem_voz') === 'on',
      vinculos: vinculos as any[],
    });

    redirect('/admin/pessoas');
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    throw error;
  }
}

export default function NovaPessoaPage() {
  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Cadastro de pessoa</p>
            <h1 className="area-hero-title">Nova Pessoa</h1>
          </div>
        </div>
        <p className="area-subtitle">Cadastre uma nova pessoa no sistema.</p>
      </section>

      <section className="area-section">
        <div className="table-surface" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <form action={handleSubmit}>
            <div className="area-section-title">
              <h2>Identificação</h2>
              <p>Dados principais da pessoa cadastrada.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Nome completo *</span>
                <input type="text" name="nome" required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Nome social</span>
                <input type="text" name="nome_social" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>CPF</span>
                <input type="text" name="cpf" placeholder="000.000.000-00" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>RG</span>
                <input type="text" name="rg" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Data de nascimento</span>
                <input type="date" name="data_nascimento" className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Contato</h2>
              <p>Telefone, email e contato de emergência.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Telefone</span>
                <input type="tel" name="telefone" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>WhatsApp</span>
                <input type="tel" name="whatsapp" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Email</span>
                <input type="email" name="email" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Contato de emergência</span>
                <input type="text" name="contato_emergencia" placeholder="Nome e telefone" className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Endereço</h2>
              <p>Localização da pessoa.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Logradouro</span>
                <input type="text" name="logradouro" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Bairro</span>
                <input type="text" name="bairro" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Número</span>
                <input type="text" name="numero" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Complemento</span>
                <input type="text" name="complemento" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Cidade</span>
                <input type="text" name="cidade" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Estado</span>
                <input type="text" name="estado" placeholder="RJ" maxLength={2} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>CEP</span>
                <input type="text" name="cep" placeholder="00000-000" className="profile-form-input" />
              </label>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Vínculos</h2>
              <p>Selecione os vínculos desta pessoa.</p>
            </div>
            <div className="table-surface">
              <div className="tag-list" style={{ flexWrap: 'wrap' }}>
                {TIPOS_VINCULO.map((vinculo) => (
                  <label key={vinculo} className="tag" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name={`vinculo_${vinculo}`} />
                    <span>{vinculo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="area-section-title" style={{ marginTop: '1.5rem' }}>
              <h2>Configurações</h2>
              <p>Observações e autorizações.</p>
            </div>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Observações</span>
                <textarea name="observacoes" rows={4} className="profile-form-input" />
              </label>
              <label className="tag" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="autoriza_notificacao" defaultChecked />
                <span>Autoriza notificações</span>
              </label>
              <label className="tag" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="autoriza_imagem_voz" />
                <span>Autoriza imagem/voz</span>
              </label>
            </div>

            <div className="area-panel-grid" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Criar Pessoa</button>
              <Link href="/admin/pessoas" className="profile-form-btn profile-form-btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
