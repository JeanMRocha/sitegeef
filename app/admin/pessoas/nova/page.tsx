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
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Pessoa</h1>
          <p className="admin-page-subtitle">Cadastre uma nova pessoa no sistema</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          {/* Seção 1: Identificação */}
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📋 Identificação</h2>

          <div className="admin-form-group">
            <label>Nome Completo *</label>
            <input type="text" name="nome" required />
          </div>

          <div className="admin-form-group">
            <label>Nome Social</label>
            <input type="text" name="nome_social" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>CPF</label>
              <input type="text" name="cpf" placeholder="000.000.000-00" />
            </div>
            <div className="admin-form-group">
              <label>RG</label>
              <input type="text" name="rg" />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Data de Nascimento</label>
            <input type="date" name="data_nascimento" />
          </div>

          {/* Seção 2: Contato */}
          <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📞 Contato</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Telefone</label>
              <input type="tel" name="telefone" />
            </div>
            <div className="admin-form-group">
              <label>WhatsApp</label>
              <input type="tel" name="whatsapp" />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Email</label>
            <input type="email" name="email" />
          </div>

          <div className="admin-form-group">
            <label>Contato de Emergência</label>
            <input type="text" name="contato_emergencia" placeholder="Nome e telefone" />
          </div>

          {/* Seção 3: Endereço */}
          <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🏠 Endereço</h2>

          <div className="admin-form-group">
            <label>Logradouro</label>
            <input type="text" name="logradouro" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Bairro</label>
              <input type="text" name="bairro" />
            </div>
            <div className="admin-form-group">
              <label>Número</label>
              <input type="text" name="numero" />
            </div>
            <div className="admin-form-group">
              <label>Complemento</label>
              <input type="text" name="complemento" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Cidade</label>
              <input type="text" name="cidade" />
            </div>
            <div className="admin-form-group">
              <label>Estado</label>
              <input type="text" name="estado" placeholder="RJ" maxLength={2} />
            </div>
            <div className="admin-form-group">
              <label>CEP</label>
              <input type="text" name="cep" placeholder="00000-000" />
            </div>
          </div>

          {/* Seção 4: Vínculos */}
          <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🔗 Vínculos</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {TIPOS_VINCULO.map((vinculo) => (
              <label key={vinculo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name={`vinculo_${vinculo}`} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '0.9rem' }}>{vinculo}</span>
              </label>
            ))}
          </div>

          {/* Seção 5: Observações e Permissões */}
          <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>⚙️ Configurações</h2>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
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

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="autoriza_notificacao" defaultChecked style={{ cursor: 'pointer' }} />
              <span>Autoriza notificações</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="autoriza_imagem_voz" style={{ cursor: 'pointer' }} />
              <span>Autoriza uso de imagem/voz</span>
            </label>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Pessoa
            </button>
            <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
